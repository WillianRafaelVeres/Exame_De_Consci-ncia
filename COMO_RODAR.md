# Custodia - execucao local

Aplicativo mobile offline em Expo/React Native.

> Este projeto esta fixado no Expo SDK 54 para funcionar no Expo Go instalado pela Play Store. SDKs mais novos podem aparecer como incompativeis no celular mesmo quando o Expo Go ja esta atualizado.

## Instalar

```bash
npm install
```

## Rodar no celular com Expo Go

1. Atualize o Expo Go no celular.
2. Feche o Expo Go completamente. Se ele insistir em abrir um projeto antigo, limpe os dados do app ou reinstale o Expo Go.
3. Conecte computador e celular no mesmo Wi-Fi.
4. Rode:

```bash
npm start
```

O `npm start` usa o modo LAN e mostra algo assim:

```text
IPs de rede detectados:
 * 192.168.1.25 (Wi-Fi; privado, fisico)

Teste no navegador do celular: http://192.168.1.25:8081/status
URL manual no Expo Go: exp://192.168.1.25:8081
```

Abra a URL `/status` no navegador do celular.

Se aparecer `packager-status:running`, a rede esta OK. Abra o Expo Go, toque em `Scan QR Code` e escaneie o QR novo do terminal. Evite abrir o projeto pela tela inicial/recents do Expo Go, porque ela pode reaproveitar cache antigo.

## Quando fica carregando e cai na tela azul

Se a URL `/status` nao abre no navegador do celular, o problema e rede/firewall. No Windows, isso normalmente acontece quando o Wi-Fi esta como `Public`.

Rode o PowerShell como Administrador e execute:

```bash
npm run fix:expo-firewall
```

Depois rode novamente:

```bash
npm start
```

Se o terminal escolher um IP errado, force o IP do Wi-Fi manualmente:

```powershell
$env:EXPO_GO_HOST_IP="192.168.1.25"; npm start
```

Troque `192.168.1.25` pelo IP mostrado no seu Wi-Fi.

## Tunnel

Use o tunnel quando o celular nao consegue acessar a LAN, ou quando computador e celular estao em redes diferentes.

```bash
npm run start:tunnel
```

O tunnel usa ngrok e depende da internet. Se ele falhar com `failed to start tunnel` ou `remote gone away`, volte para LAN e corrija a rede/firewall.

## Instalar no Android como app

O Expo Go serve para abrir/testar o projeto. Para instalar o Custodia como aplicativo separado no celular, gere um APK com EAS Build.

Primeiro faca login:

```bash
npm run eas:login
```

Na primeira vez, configure/vincule o projeto EAS:

```bash
npm run eas:configure
```

Depois gere o APK:

```bash
npm run build:android:apk
```

Quando o build terminar, o EAS mostra um link/QR Code. Abra esse link no celular Android e instale o APK. Se o Android pedir permissao para instalar app de fonte desconhecida, libere para o navegador usado no download.

Para instalar o ultimo build em um emulador Android:

```bash
npm run install:android:emulator
```

## Verificacoes

```bash
npx expo install --check
npx tsc --noEmit
npx expo-doctor
```
