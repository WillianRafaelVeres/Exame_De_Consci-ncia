const { execFileSync, spawn } = require('child_process');
const net = require('net');
const os = require('os');

const DEFAULT_PORT = 8081;
const PORT_SCAN_LIMIT = 20;
const VALID_MODES = new Set(['lan', 'tunnel']);
const EXPLICIT_HOST_ENV_KEYS = ['EXPO_GO_HOST_IP', 'REACT_NATIVE_PACKAGER_HOSTNAME'];

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

function isPrivateIPv4(address) {
  if (address.startsWith('10.')) return true;
  if (address.startsWith('192.168.')) return true;

  const parts = address.split('.').map((part) => Number.parseInt(part, 10));
  return parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
}

function isLikelyVirtualInterface(name) {
  return /bluetooth|docker|hyper-v|loopback|npcap|tailscale|tunnel|virtual|vethernet|vmware|vpn|wsl/i.test(name);
}

function getLanCandidates() {
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

      candidates.push({
        name,
        address: address.address,
        private: isPrivateIPv4(address.address),
        virtual: isLikelyVirtualInterface(name),
      });
    }
  }

  return candidates.sort((a, b) => scoreLanCandidate(b) - scoreLanCandidate(a));
}

function scoreLanCandidate(candidate) {
  let score = 0;

  if (candidate.private) score += 80;
  if (!candidate.virtual) score += 60;
  if (/wi-?fi|wlan/i.test(candidate.name)) score += 40;
  if (/ethernet/i.test(candidate.name)) score += 20;
  if (candidate.virtual) score -= 120;

  return score;
}

function getExplicitLanAddress() {
  for (const key of EXPLICIT_HOST_ENV_KEYS) {
    const value = process.env[key];
    if (value && value.trim()) {
      return { source: key, address: value.trim() };
    }
  }

  return null;
}

function getLanAddress() {
  const explicit = getExplicitLanAddress();
  if (explicit) {
    return explicit;
  }

  const candidates = getLanCandidates();
  if (candidates.length === 0) {
    return null;
  }

  const [preferred] = candidates;
  return { ...preferred, source: preferred.name };
}

function printLanDiagnostics(selected, port) {
  const candidates = getLanCandidates();

  if (candidates.length > 0) {
    console.log('IPs de rede detectados:');
    for (const candidate of candidates) {
      const marker = candidate.address === selected.address ? '*' : '-';
      const flags = [
        candidate.private ? 'privado' : 'nao-privado',
        candidate.virtual ? 'virtual/vpn' : 'fisico',
      ].join(', ');
      console.log(` ${marker} ${candidate.address} (${candidate.name}; ${flags})`);
    }
  }

  console.log('');
  console.log(`Expo LAN host: ${selected.address}`);
  console.log(`Teste no navegador do celular: http://${selected.address}:${port}/status`);
  console.log(`URL manual no Expo Go: exp://${selected.address}:${port}`);
  console.log('');
  console.log('Se o celular nao abrir a URL /status, a rede/firewall esta bloqueando o Metro.');
  console.log('Nesse caso rode `npm run fix:expo-firewall` como Administrador ou use `npm run start:tunnel`.');
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
    .filter((arg) => arg !== '--dry-run');
}

function appendNoProxy(env, host) {
  const entries = new Set(
    [env.NO_PROXY, env.no_proxy]
      .filter(Boolean)
      .flatMap((value) => value.split(',').map((item) => item.trim()).filter(Boolean)),
  );

  for (const item of ['localhost', '127.0.0.1', host]) {
    entries.add(item);
  }

  const value = Array.from(entries).join(',');
  env.NO_PROXY = value;
  env.no_proxy = value;
}

async function main() {
  const mode = getMode();
  const dryRun = process.argv.includes('--dry-run');
  const extraArgs = getExtraArgs();
  const startPort = getStartPort(mode);
  const port = await findFreePort(startPort);

  if (!port) {
    console.error(`Nenhuma porta livre encontrada entre ${startPort} e ${startPort + PORT_SCAN_LIMIT - 1}.`);
    process.exit(1);
  }

  const env = { ...process.env };
  const hostArgs = ['--host', mode];
  env.EXPO_NO_TELEMETRY = '1';

  if (mode === 'lan') {
    const host = getLanAddress();
    if (!host) {
      console.error('Nao encontrei um IP de rede local. Verifique se o Wi-Fi/Ethernet esta ativo.');
      process.exit(1);
    }

    const address = host.address;
    env.REACT_NATIVE_PACKAGER_HOSTNAME = address;
    appendNoProxy(env, address);
    printLanDiagnostics(host, port);
    warnIfWindowsNetworkIsPublic();
  } else {
    delete env.REACT_NATIVE_PACKAGER_HOSTNAME;
    appendNoProxy(env, '127.0.0.1');
    console.log('Expo tunnel: ngrok');
    console.log('Use este modo quando o celular nao consegue acessar a URL /status da LAN.');
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
