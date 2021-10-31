import { Product } from '@interfaces/products.interface';
import productFixtures from './raw-products.json';

export const getProductFixtures = (): any[] => {
  const result = productFixtures.map(item => ({ ...item }));

  return result;
};

export const getProductFixture = (id: string): Product => {
  const found = getProductFixtures().find(item => item.id === id);
  if (!found) throw new Error(`tried to retrieve non-existent fixture for id ${id}`);
  return found;
};
