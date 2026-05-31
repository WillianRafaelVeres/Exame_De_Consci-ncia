import { Sin, SinStatus } from '../../types';
import { getJson, setJson } from '../../services/storage';
import { todayISO } from '../../utils/date';

type CreateSinInput = Omit<Sin, 'id' | 'createdAt' | 'updatedAt'>;

const SINS_KEY = 'custodia:sins';

async function loadSins(): Promise<Sin[]> {
  const data = await getJson<Sin[]>(SINS_KEY);
  return data ?? [];
}

async function saveSins(sins: Sin[]): Promise<void> {
  await setJson(SINS_KEY, sins);
}

function cloneSin(s: CreateSinInput, id: number): Sin {
  const now = new Date().toISOString();
  return {
    id,
    date: s.date || todayISO(),
    type: s.type ?? 'manual',
    sourceId: s.sourceId ?? null,
    sourceTitle: s.sourceTitle ?? null,
    commandment: s.commandment ?? null,
    category: s.category ?? null,
    title: s.title,
    description: s.description ?? null,
    occasion: s.occasion ?? s.nearOccasion ?? null,
    nearOccasion: s.nearOccasion ?? null,
    isRepeated: !!s.isRepeated,
    needsConfession: !!s.needsConfession,
    hasRepaired: !!s.hasRepaired,
    concretePropose: s.concretePropose ?? null,
    status: s.status,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listSins(): Promise<Sin[]> {
  const sins = await loadSins();
  return sins.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt < a.createdAt ? 1 : -1));
}

export async function getSins(status?: SinStatus): Promise<Sin[]> {
  const sins = await loadSins();
  const filtered = status ? sins.filter((s) => s.status === status) : sins.filter((s) => s.status !== 'deleted');
  return filtered.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt < a.createdAt ? 1 : -1));
}

export async function getSin(id: number): Promise<Sin | null> {
  const sins = await loadSins();
  const found = sins.find((s) => s.id === id && s.status !== 'deleted');
  return found ?? null;
}

export async function createSin(data: CreateSinInput): Promise<number> {
  const sins = await loadSins();
  const id = Date.now() + Math.floor(Math.random() * 1000);
  const sin = cloneSin(data, id);
  sins.push(sin);
  await saveSins(sins);
  return id;
}

export async function updateSin(id: number, data: Partial<Sin>): Promise<void> {
  const sins = await loadSins();
  const idx = sins.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const existing = sins[idx];
  const updated: Sin = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  } as Sin;
  sins[idx] = updated;
  await saveSins(sins);
}

export async function deleteSin(id: number): Promise<void> {
  await updateSin(id, { status: 'deleted' });
}

export async function clearActiveSinsAfterConfession(): Promise<void> {
  const sins = await loadSins();
  const now = new Date().toISOString();
  for (const s of sins) {
    if (s.status === 'active') {
      s.status = 'confessed';
      s.updatedAt = now;
    }
  }
  await saveSins(sins);
}

export async function purgeActiveSinsAfterConfession(): Promise<void> {
  const sins = await loadSins();
  const filtered = sins.filter(
    (s) => s.status !== 'active' && s.status !== 'confessed'
  );
  await saveSins(filtered);
}

export async function markAllConfessed(): Promise<void> {
  await clearActiveSinsAfterConfession();
}

export async function countActiveSins(): Promise<number> {
  const sins = await loadSins();
  return sins.filter((s) => s.status === 'active').length;
}
