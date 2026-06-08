import { getAllKeys, getJson, removeItems, setJson, setString } from '../services/storage';
import { prayers } from '../content/prayers';
import { guideItems } from '../content/guideItems';

const RESET_MARKER_KEY = 'custodia:reset:v2_logo_latin_counts';

async function resetLocalDataOnce(): Promise<void> {
  const alreadyReset = await getJson<boolean>(RESET_MARKER_KEY);
  if (alreadyReset) return;

  const keys = await getAllKeys();
  const custodiaKeys = keys.filter(
    (key) => key.startsWith('custodia:') && key !== RESET_MARKER_KEY
  );

  await removeItems(custodiaKeys);
  await setString(RESET_MARKER_KEY, 'true');
}

export async function initializeDatabase(): Promise<void> {
  await resetLocalDataOnce();

  // Seed prayers
  const existingPrayers = await getJson<typeof prayers>('custodia:prayers');
  if (!existingPrayers) {
    await setJson('custodia:prayers', prayers);
  } else {
    const existingIds = new Set(existingPrayers.map((prayer) => prayer.id));
    const mergedPrayers = [
      ...existingPrayers,
      ...prayers.filter((prayer) => !existingIds.has(prayer.id)),
    ];
    await setJson('custodia:prayers', mergedPrayers);
  }

  // Seed guide items
  const existingGuide = await getJson('custodia:guide_items');
  if (!existingGuide) {
    await setJson('custodia:guide_items', guideItems);
  }

  // Ensure basic collections exist
  const sins = await getJson('custodia:sins');
  if (!sins) await setJson('custodia:sins', []);

  const exams = await getJson('custodia:exams');
  if (!exams) await setJson('custodia:exams', {});

  const confessions = await getJson('custodia:confessions');
  if (!confessions) await setJson('custodia:confessions', []);
}
