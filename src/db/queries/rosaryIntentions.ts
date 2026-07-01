import { getJson, setJson } from '../../services/storage';
import { weekdayOptions } from '../../content/rosary';

const ROSARY_INTENTIONS_KEY = 'custodia:rosary_intentions:v1';
const DECADE_COUNT = 5;

export type RosaryIntentionsByDay = Record<string, string[]>;

function createEmptyIntentions(): RosaryIntentionsByDay {
  return weekdayOptions.reduce<RosaryIntentionsByDay>((acc, day) => {
    acc[day.id] = Array.from({ length: DECADE_COUNT }, () => '');
    return acc;
  }, {});
}

function normalizeIntentions(value: RosaryIntentionsByDay | null): RosaryIntentionsByDay {
  const fallback = createEmptyIntentions();
  if (!value) return fallback;

  for (const day of weekdayOptions) {
    const saved = Array.isArray(value[day.id]) ? value[day.id] : [];
    fallback[day.id] = Array.from(
      { length: DECADE_COUNT },
      (_, index) => saved[index] ?? ''
    );
  }

  return fallback;
}

export async function getRosaryIntentions(): Promise<RosaryIntentionsByDay> {
  const saved = await getJson<RosaryIntentionsByDay>(ROSARY_INTENTIONS_KEY);
  return normalizeIntentions(saved);
}

export async function saveRosaryIntentions(
  intentions: RosaryIntentionsByDay
): Promise<void> {
  await setJson(ROSARY_INTENTIONS_KEY, normalizeIntentions(intentions));
}

export async function setRosaryIntention(
  dayId: string,
  decadeIndex: number,
  text: string
): Promise<RosaryIntentionsByDay> {
  const intentions = await getRosaryIntentions();
  const currentDay = intentions[dayId] ?? Array.from({ length: DECADE_COUNT }, () => '');
  currentDay[decadeIndex] = text;
  intentions[dayId] = currentDay;
  await saveRosaryIntentions(intentions);
  return intentions;
}
