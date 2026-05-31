import { getString, setString } from '../../services/storage';

export async function getSetting(key: string): Promise<string | null> {
  return getString(`custodia:setting:${key}`);
}

export async function setSetting(key: string, value: string): Promise<void> {
  await setString(`custodia:setting:${key}`, value);
}
