import * as Crypto from 'expo-crypto';

const HASH_VERSION = 'pin-sha256-v1';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPin(pin: string): Promise<string> {
  const salt = bytesToHex(Crypto.getRandomBytes(16));
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`
  );

  return `${HASH_VERSION}:${salt}:${digest}`;
}

export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  const [version, salt, expected] = storedHash.split(':');

  if (version !== HASH_VERSION || !salt || !expected) {
    const legacyDigest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `custodia_local_salt_v1${pin}`
    );
    return legacyDigest === storedHash;
  }

  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`
  );

  return digest === expected;
}
