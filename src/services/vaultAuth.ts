import { getString, removeItem, setString } from './storage';
import { hashPin, verifyPin } from '../utils/crypto';

const VAULT_PIN_KEY = 'custodia:vaultPinHash';

export async function hasVaultPin(): Promise<boolean> {
  const hash = await getString(VAULT_PIN_KEY);
  return !!hash;
}

export async function createVaultPin(
  pin: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const hash = await hashPin(pin);
    await setString(VAULT_PIN_KEY, hash);
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar PIN do Cofre:', error);
    return {
      success: false,
      error: 'Nao foi possivel salvar o PIN do Cofre. Tente novamente.',
    };
  }
}

export async function verifyVaultPin(pin: string): Promise<boolean> {
  const stored = await getString(VAULT_PIN_KEY);
  if (!stored) return false;
  return verifyPin(pin, stored);
}

export async function changeVaultPin(
  oldPin: string,
  newPin: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const valid = await verifyVaultPin(oldPin);
    if (!valid) {
      return { success: false, error: 'PIN atual incorreto.' };
    }

    const hash = await hashPin(newPin);
    await setString(VAULT_PIN_KEY, hash);
    return { success: true };
  } catch (error) {
    console.error('Erro ao alterar PIN do Cofre:', error);
    return {
      success: false,
      error: 'Nao foi possivel alterar o PIN do Cofre. Tente novamente.',
    };
  }
}

export async function deleteVaultPin(): Promise<void> {
  await removeItem(VAULT_PIN_KEY);
}
