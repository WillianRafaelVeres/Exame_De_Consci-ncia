import { GuideItem } from '../../types';
import { guideItems } from '../../content/guideItems';

export async function getGuideItems(): Promise<GuideItem[]> {
  return guideItems;
}

export async function getGuideCategories(): Promise<string[]> {
  const categories = Array.from(new Set(guideItems.map((g) => g.category)));
  return categories;
}
