import { Product } from '@/interfaces/products.interface';
import productFixtures from './products.json';

export const getProductFixtures = (): Product[] => {
  const result = productFixtures.map(item => ({ ...item } as Product));

  return result;
};

export const getProductFixture = (id: string): Product => {
  const found = getProductFixtures().find(item => item.id === id);
  if (!found) throw new Error(`tried to retrieve non-existent fixture for id ${id}`);
  return found;
};
