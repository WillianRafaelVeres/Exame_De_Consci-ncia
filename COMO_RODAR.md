# Custodia - execucao local

Aplicativo mobile offline em Expo/React Native.

## Instalar

```bash
npm install
```

## Rodar no celular com Expo Go

1. Atualize o Expo Go no celular.
2. Apague o cache/dados do Expo Go no Android ou reinstale o Expo Go.
3. Conecte computador e celular no mesmo Wi-Fi.
4. Rode:

```bash
npm run start:lan
```

5. O terminal vai mostrar:

```text
Teste no navegador do celular: http://SEU_IP:PORTA/status
URL manual no Expo Go: exp://SEU_IP:PORTA
```

6. Abra a URL `/status` no navegador do celular.

Se aparecer `packager-status:running`, a rede esta OK. Abra o Expo Go, toque em `Scan QR Code` e escaneie o QR novo do terminal.

Se a tela ainda mostrar `Failed to download remote update`, nao abra o projeto antigo pela Home do Expo Go. Limpe os dados do Expo Go/reinstale e escaneie o QR novo. Este projeto local usa o slug `custodia-local` para nao reaproveitar cache remoto antigo.

Se a URL `/status` nao abrir no navegador do celular, rode o PowerShell como Administrador e execute:

```bash
npm run fix:expo-firewall
```

Depois rode `npm run start:lan` novamente.

## Tunnel

O tunnel usa ngrok e pode falhar com `failed to start tunnel` ou `remote gone away`.

```bash
npm run start:tunnel
```

Prefira LAN quando isso acontecer.

## Verificacoes

```bash
npx expo install --check
npx tsc --noEmit
npx expo-doctor
```
