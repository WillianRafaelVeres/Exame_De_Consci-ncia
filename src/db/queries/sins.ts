import { Sin, SinSourceType } from '../../types';
import { getJson, setJson } from '../../services/storage';
import { todayISO } from '../../utils/date';

export type CreateSinInput = {
  id?: string;
  date?: string;
  sourceType: SinSourceType;
  sourceId: string;
  sourceTitle: string;
  text: string;
  fromQuestion?: boolean;
  needsConfession?: boolean;
};

const SINS_KEY = 'custodia:sins';

function normalizeComparableText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function occurrenceKey(sin: Pick<Sin, 'sourceType' | 'sourceId' | 'text'>): string {
  return [
    sin.sourceType,
    sin.sourceId,
    normalizeComparableText(sin.text),
  ].join('|');
}

function legacyText(raw: Record<string, unknown>): string {
  const parts = [
    raw.text,
    raw.title,
    raw.description,
    raw.occasion,
    raw.nearOccasion,
  ]
    .filter((value) => typeof value === 'string' && value.trim().length > 0)
    .map((value) => String(value).trim());

  return parts.join('\n');
}

function normalizeSourceType(raw: Record<string, unknown>): SinSourceType {
  const value = raw.sourceType ?? raw.type;
  if (
    value === 'commandment' ||
    value === 'capital_sin' ||
    value === 'state_of_life' ||
    value === 'manual'
  ) {
    return value;
  }

  if (raw.commandment) return 'commandment';
  if (raw.category) return 'capital_sin';
  return 'manual';
}

function normalizeSin(raw: unknown): Sin | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const oldStatus = obj.status;

  if (oldStatus && oldStatus !== 'active') return null;

  const sourceType = normalizeSourceType(obj);
  const text = legacyText(obj);
  if (!text) return null;

  const fallbackSource =
    sourceType === 'commandment'
      ? 'Mandamento'
      : sourceType === 'capital_sin'
      ? 'Pecado capital'
      : sourceType === 'state_of_life'
      ? 'Estado de vida'
      : 'Anotação manual';

  const sourceTitle =
    typeof obj.sourceTitle === 'string' && obj.sourceTitle.trim()
      ? obj.sourceTitle.trim()
      : typeof obj.commandment === 'string' && obj.commandment.trim()
      ? obj.commandment.trim()
      : typeof obj.category === 'string' && obj.category.trim()
      ? obj.category.trim()
      : fallbackSource;

  const sourceId =
    typeof obj.sourceId === 'string' && obj.sourceId.trim()
      ? obj.sourceId.trim()
      : `${sourceType}_${sourceTitle.toLowerCase().replace(/\s+/g, '_')}`;

  const rawId = obj.id;
  const id =
    typeof rawId === 'string'
      ? rawId
      : typeof rawId === 'number'
      ? String(rawId)
      : `${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const now = new Date().toISOString();

  return {
    id,
    date: typeof obj.date === 'string' ? obj.date : todayISO(),
    sourceType,
    sourceId,
    sourceTitle,
    text,
    count:
      typeof obj.count === 'number' && Number.isFinite(obj.count) && obj.count > 0
        ? Math.floor(obj.count)
        : 1,
    fromQuestion: Boolean(obj.fromQuestion),
    needsConfession:
      typeof obj.needsConfession === 'boolean'
        ? obj.needsConfession
        : true,
    status: 'active',
    createdAt:
      typeof obj.createdAt === 'string' ? obj.createdAt : now,
    updatedAt:
      typeof obj.updatedAt === 'string' ? obj.updatedAt : now,
  };
}

function mergeDuplicateSins(sins: Sin[]): Sin[] {
  const map = new Map<string, Sin>();

  for (const sin of sins) {
    const key = occurrenceKey(sin);
    const existing = map.get(key);

    if (!existing) {
      map.set(key, sin);
      continue;
    }

    map.set(key, {
      ...existing,
      count: existing.count + sin.count,
      needsConfession: existing.needsConfession || sin.needsConfession,
      fromQuestion: existing.fromQuestion && sin.fromQuestion,
      updatedAt:
        (sin.updatedAt ?? '') > (existing.updatedAt ?? '')
          ? sin.updatedAt
          : existing.updatedAt,
    });
  }

  return Array.from(map.values());
}

async function loadSins(): Promise<Sin[]> {
  const data = await getJson<unknown[]>(SINS_KEY);
  if (!data) return [];

  const normalized = mergeDuplicateSins(data
    .map(normalizeSin)
    .filter((sin): sin is Sin => sin !== null));

  if (JSON.stringify(data) !== JSON.stringify(normalized)) {
    await saveSins(normalized);
  }

  return normalized;
}

async function saveSins(sins: Sin[]): Promise<void> {
  await setJson(SINS_KEY, sins);
}

function sortSins(sins: Sin[]): Sin[] {
  return [...sins].sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
  });
}

export async function listSins(): Promise<Sin[]> {
  return sortSins(await loadSins());
}

export async function getSins(): Promise<Sin[]>;
export async function getSins(status: 'active'): Promise<Sin[]>;
export async function getSins(): Promise<Sin[]> {
  return sortSins(await loadSins());
}

export async function getSin(id: string | number): Promise<Sin | null> {
  const sins = await loadSins();
  return sins.find((s) => s.id === String(id)) ?? null;
}

export async function createSin(data: CreateSinInput): Promise<string> {
  const sins = await loadSins();
  const now = new Date().toISOString();
  const id = data.id ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const trimmedText = data.text.trim();
  const sameOccurrenceIndex = sins.findIndex(
    (sin) =>
      occurrenceKey(sin) ===
      occurrenceKey({
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        text: trimmedText,
      })
  );
  const existingIndex =
    sameOccurrenceIndex >= 0
      ? sameOccurrenceIndex
      : sins.findIndex((sin) => sin.id === id);

  if (existingIndex >= 0) {
    sins[existingIndex] = {
      ...sins[existingIndex],
      count: sins[existingIndex].count + 1,
      needsConfession: sins[existingIndex].needsConfession || (data.needsConfession ?? true),
      updatedAt: now,
    };
    await saveSins(sins);
    return sins[existingIndex].id;
  }

  const sin: Sin = {
    id,
    date: data.date ?? todayISO(),
    sourceType: data.sourceType,
    sourceId: data.sourceId,
    sourceTitle: data.sourceTitle,
    text: trimmedText,
    count: 1,
    fromQuestion: Boolean(data.fromQuestion),
    needsConfession: data.needsConfession ?? true,
    status: 'active',
    createdAt: existingIndex >= 0 ? sins[existingIndex].createdAt : now,
    updatedAt: now,
  };

  sins.push(sin);
  await saveSins(sins);
  return id;
}

export async function updateSin(
  id: string | number,
  data: Partial<Pick<Sin, 'text' | 'needsConfession'>>
): Promise<void> {
  const sins = await loadSins();
  const idx = sins.findIndex((s) => s.id === String(id));
  if (idx === -1) return;
  sins[idx] = {
    ...sins[idx],
    ...data,
    text: data.text !== undefined ? data.text.trim() : sins[idx].text,
    status: 'active',
    updatedAt: new Date().toISOString(),
  };
  await saveSins(sins);
}

export async function decrementSin(id: string | number): Promise<void> {
  const sins = await loadSins();
  const idx = sins.findIndex((s) => s.id === String(id));
  if (idx === -1) return;

  if (sins[idx].count > 1) {
    sins[idx] = {
      ...sins[idx],
      count: sins[idx].count - 1,
      updatedAt: new Date().toISOString(),
    };
    await saveSins(sins);
    return;
  }

  await saveSins(sins.filter((sin) => sin.id !== String(id)));
}

export async function deleteSin(id: string | number): Promise<void> {
  const sins = await loadSins();
  await saveSins(sins.filter((sin) => sin.id !== String(id)));
}

export async function purgeActiveSinsAfterConfession(): Promise<void> {
  await saveSins([]);
}

export async function clearActiveSinsAfterConfession(): Promise<void> {
  await purgeActiveSinsAfterConfession();
}

export async function markAllConfessed(): Promise<void> {
  await purgeActiveSinsAfterConfession();
}

export async function countActiveSins(): Promise<number> {
  return (await loadSins()).length;
}
