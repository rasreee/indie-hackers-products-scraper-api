import { GetProductHit, Product } from '@interfaces/products.interface';

export const IH_API_URL =
  'https://n86t1r3owz-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)%3B%20JS%20Helper%202.21.1&x-algolia-application-id=N86T1R3OWZ&x-algolia-api-key=5140dac5e87f47346abbda1a34ee70c3';

export const DEFAULT_HEADERS = {
  accept: 'application/json',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  'content-type': 'application/x-www-form-urlencoded',
  pragma: 'no-cache',
  'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  Referer: 'https://www.scraper.com/products',
  'Referrer-Policy': 'unsafe-url',
};

export interface IHGetProductsReq {
  indexName: 'products';
  params: string;
}

export const ParamKeys = {
  page: ':page',
  hitsPerPage: ':hitsPerPage',
};

export const PARAMS_TEMPLATE = `query=&hitsPerPage=${ParamKeys.hitsPerPage}&page=${ParamKeys.page}&restrictSearchableAttributes=&facets=%5B%5D&tagFilters=`;

/* eslint-disable @typescript-eslint/no-unused-vars */
export const defaultParser = ({
  _tags: tags,
  productId: id,
  startDateStr: startDate,
  _highlightResult,
  last30DaysUniques,
  ...rest
}: GetProductHit): Product => {
  const product: Product = { id, tags, startDate, ...rest };

  return product;
};
