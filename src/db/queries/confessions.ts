import { Confession } from '../../types';
import { getJson, setJson } from '../../services/storage';

const CONFESSIONS_KEY = 'custodia:confessions';

async function loadConfessions(): Promise<Confession[]> {
  const data = await getJson<Confession[]>(CONFESSIONS_KEY);
  return data ?? [];
}

async function saveConfessions(list: Confession[]): Promise<void> {
  await setJson(CONFESSIONS_KEY, list);
}

export async function getLastConfession(): Promise<Confession | null> {
  const list = await loadConfessions();
  return list.length ? list[list.length - 1] : null;
}

export async function createConfession(
  date: string,
  sinCount: number,
  notes?: string,
  keepPrivateHistory: boolean = false
): Promise<number> {
  const list = await loadConfessions();
  const id = Date.now();
  const item: Confession = {
    id,
    date,
    notes: notes ?? null,
    sinCount,
    keepPrivateHistory: keepPrivateHistory ?? false,
    createdAt: new Date().toISOString(),
  };
  list.push(item);
  await saveConfessions(list);
  return id;
}

export async function getConfessions(limit: number = 20): Promise<Confession[]> {
  const list = await loadConfessions();
  return list.slice(-limit).reverse();
}
