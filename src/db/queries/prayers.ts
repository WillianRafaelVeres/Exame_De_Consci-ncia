import { Prayer } from '../../types';
import { prayers } from '../../content/prayers';

export async function getPrayers(): Promise<Prayer[]> {
  return prayers;
}
