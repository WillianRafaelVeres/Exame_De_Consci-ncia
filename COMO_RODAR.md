# Custódia - execução local

Aplicativo mobile offline em Expo/React Native. Neste MVP, os dados ficam somente no dispositivo usando AsyncStorage. O app abre direto; apenas Registros e Preparar Confissão usam o PIN do Cofre, salvo como hash. A digital é opcional e serve apenas para abrir o Cofre no aparelho.

## Instalação

```bash
npm install
```

## Rodar no celular com Expo Go

1. Instale o Expo Go no celular.
2. Conecte computador e celular na mesma rede Wi-Fi.
3. Rode:

```bash
npm run start:lan
```

4. Escaneie o QR Code exibido no terminal com o Expo Go.

## Alternativa por tunnel

Use quando LAN não funcionar por firewall, VPN ou rede restrita:

```bash
npm run start:tunnel
```

## Verificações

```bash
npx tsc --noEmit
npx expo-doctor
```

## Privacidade

O app não usa login online, servidor, Supabase, Firebase, SQLite, SecureStore, analytics, crash reporting externo, sincronização ou backup automático. Qualquer exportação futura deve ser manual e criptografada.
