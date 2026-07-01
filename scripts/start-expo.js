const { execFileSync, spawn } = require('child_process');
const net = require('net');
const os = require('os');

const DEFAULT_PORT = 8081;
const PORT_SCAN_LIMIT = 20;
const VALID_MODES = new Set(['lan', 'tunnel']);

function getMode() {
  const mode = process.argv[2] || 'lan';
  if (!VALID_MODES.has(mode)) {
    console.error('Modo invalido. Use `lan` ou `tunnel`.');
    process.exit(1);
  }
  return mode;
}

function getStartPort(mode) {
  const envKey = mode === 'tunnel' ? 'EXPO_TUNNEL_PORT' : 'EXPO_LAN_PORT';
  const parsed = Number.parseInt(
    process.env[envKey] || process.env.EXPO_PORT || '',
    10,
  );
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_PORT;
}

function getExpoCliPath() {
  try {
    return require.resolve('expo/bin/cli');
  } catch {
    console.error('Nao encontrei o CLI local do Expo. Rode `npm install` antes de iniciar o app.');
    process.exit(1);
  }
}

function getLanAddress() {
  const candidates = [];
  const interfaces = os.networkInterfaces();

  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const address of addresses || []) {
      if (address.family !== 'IPv4' || address.internal) {
        continue;
      }

      if (address.address.startsWith('169.254.') || address.address === '127.0.0.1') {
        continue;
      }

      candidates.push({ name, address: address.address });
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  const preferred =
    candidates.find((candidate) => /wi-?fi|wlan|ethernet/i.test(candidate.name)) ||
    candidates[0];

  return preferred.address;
}

function warnIfWindowsNetworkIsPublic() {
  if (process.platform !== 'win32') {
    return;
  }

  try {
    const output = execFileSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        "Get-NetConnectionProfile | Where-Object {$_.IPv4Connectivity -ne 'Disconnected'} | Select-Object -ExpandProperty NetworkCategory",
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );

    if (output.includes('Public')) {
      console.log('');
      console.log('Aviso: sua rede do Windows esta como Public.');
      console.log('Se o Expo Go mostrar "Failed to download remote update", altere o Wi-Fi para Rede privada');
      console.log('ou libere o Node.js/Expo no Firewall do Windows para redes privadas.');
      console.log('');
    }
  } catch {
    // This check is best-effort only.
  }
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        server.close(() => resolve(true));
      })
      .listen(port, '0.0.0.0');
  });
}

async function findFreePort(startPort) {
  for (let port = startPort; port < startPort + PORT_SCAN_LIMIT; port += 1) {
    if (await isPortFree(port)) {
      return port;
    }
  }

  return null;
}

function getExtraArgs() {
  return process.argv
    .slice(3)
    .filter((arg) => arg !== '--dry-run' && arg !== '--offline');
}

async function main() {
  const mode = getMode();
  const dryRun = process.argv.includes('--dry-run');
  const extraArgs = getExtraArgs();
  const offlineRequested = process.argv.includes('--offline');
  const startPort = getStartPort(mode);
  const port = await findFreePort(startPort);

  if (!port) {
    console.error(`Nenhuma porta livre encontrada entre ${startPort} e ${startPort + PORT_SCAN_LIMIT - 1}.`);
    process.exit(1);
  }

  const env = { ...process.env };
  const hostArgs = mode === 'tunnel' ? ['--tunnel'] : ['--lan'];

  if (mode === 'lan') {
    if (offlineRequested) {
      console.log('Aviso: ignorando --offline porque o Expo SDK 57 nao permite usar --offline junto com --lan.');
    }

    const host = process.env.REACT_NATIVE_PACKAGER_HOSTNAME || getLanAddress();
    if (!host) {
      console.error('Nao encontrei um IP de rede local. Verifique se o Wi-Fi/Ethernet esta ativo.');
      process.exit(1);
    }

    env.REACT_NATIVE_PACKAGER_HOSTNAME = host;
    console.log(`Expo LAN host: ${host}`);
    console.log(`Teste no navegador do celular: http://${host}:${port}/status`);
    console.log(`URL manual no Expo Go: exp://${host}:${port}`);
    warnIfWindowsNetworkIsPublic();
  } else {
    delete env.REACT_NATIVE_PACKAGER_HOSTNAME;
    console.log('Expo tunnel: ngrok');
  }

  if (port !== startPort) {
    console.log(`Porta ${startPort} ocupada; usando ${port}.`);
  } else {
    console.log(`Metro port: ${port}`);
  }

  if (dryRun) {
    return;
  }

  const child = spawn(
    process.execPath,
    [getExpoCliPath(), 'start', '--clear', '--go', ...hostArgs, '--port', String(port), ...extraArgs],
    {
      env,
      stdio: 'inherit',
    },
  );

  child.on('error', (error) => {
    console.error('Nao foi possivel iniciar o Expo:', error);
    process.exit(1);
  });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      child.kill(signal);
    });
  }

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
