import { DailyExam } from '../../types';
import { getJson, setJson } from '../../services/storage';
import { todayISO } from '../../utils/date';

const EXAMS_KEY = 'custodia:exams';

async function loadExams(): Promise<Record<string, DailyExam>> {
  const data = await getJson<Record<string, DailyExam>>(EXAMS_KEY);
  return data ?? {};
}

async function saveExams(map: Record<string, DailyExam>): Promise<void> {
  await setJson(EXAMS_KEY, map);
}

export async function getTodayExam(): Promise<DailyExam | null> {
  return getExamByDate(todayISO());
}

export async function getExamByDate(date: string): Promise<DailyExam | null> {
  const map = await loadExams();
  return map[date] ?? null;
}

export async function upsertExam(
  date: string,
  data: Partial<Pick<DailyExam, 'completed' | 'stepReached' | 'notes'>>
): Promise<void> {
  const map = await loadExams();
  const now = new Date().toISOString();
  const existing = map[date];
  const id = existing?.id ?? Date.now();
  map[date] = {
    id,
    date,
    completed: !!data.completed,
    stepReached: data.stepReached ?? existing?.stepReached ?? 0,
    notes: data.notes ?? existing?.notes ?? null,
    createdAt: existing?.createdAt ?? now,
  };
  await saveExams(map);
}

export async function getRecentExams(limit: number = 7): Promise<DailyExam[]> {
  const map = await loadExams();
  const items = Object.values(map).sort((a, b) => (a.date < b.date ? 1 : -1));
  return items.slice(0, limit);
}
