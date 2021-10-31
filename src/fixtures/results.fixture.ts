/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetProductsData, Product } from '@interfaces/products.interface';
import fixtureJson from './algolia.json';

export const getProductsDataFixture = () => {
  return fixtureJson as GetProductsData;
};

export const getProductsFixture = () => {
  return getProductsDataFixture().results[0].hits.map(hit => {
    const { _tags, _highlightResult, objectID, productId, startDateStr, last30DaysUniques, ...rest } = hit;

    return { id: productId, tags: _tags, startDate: startDateStr, ...rest } as Product;
  });
};
