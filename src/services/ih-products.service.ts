import { GetProductHit, GetProductsResults, ProductTag } from '@fixtures/results.fixture';
import axios from 'axios';

const API_URL =
  'https://n86t1r3owz-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)%3B%20JS%20Helper%202.21.1&x-algolia-application-id=N86T1R3OWZ&x-algolia-api-key=5140dac5e87f47346abbda1a34ee70c3';

const HEADERS = {
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
  Referer: 'https://www.indiehackers.com/products',
  'Referrer-Policy': 'unsafe-url',
};

const HITS_PER_PAGE = 16;

interface IHRequest {
  indexName: 'products';
  params: string;
}

const ParamKeys = {
  page: ':page',
  hitsPerPage: ':hitsPerPage',
};

class IndieHackersService {
  private headers = HEADERS;
  private paramsBase = `query=&hitsPerPage=${ParamKeys.hitsPerPage}&page=${ParamKeys.page}&restrictSearchableAttributes=&facets=%5B%5D&tagFilters=`;

  private mapToProduct = (hit: GetProductHit): Omit<GetProductHit, '_highlightResult' | '_tags'> & { tags: ProductTag[] } => {
    const { _tags, _highlightResult, ...rest } = hit;

    return { tags: _tags, ...rest };
  };

  private getBody = (params: string) => {
    return { requests: [{ indexName: 'products', params } as IHRequest] };
  };

  getAllProducts = async () => {
    try {
      const allProducts: any[] = [];
      let page = 0;
      let totalPages = 1;
      const params = this.paramsBase.replace(ParamKeys.hitsPerPage, `${HITS_PER_PAGE}`).replace(ParamKeys.page, '0');

      const response = await axios.post(API_URL, this.getBody(params), {
        headers: this.headers,
      });

      if (response.status !== 200) throw new Error(response.statusText);

      const results: GetProductsResults = response.data.results;
      totalPages = results.nbPages;
      const products: any[] = [];
      results.hits.forEach(hit => {
        const res = this.mapToProduct(hit);
        products.push(res);
      });

      page += 1;

      while (page < results) {}

      return allProducts;
    } catch (err) {
      throw err;
    }
  };
}

export default IndieHackersService;
