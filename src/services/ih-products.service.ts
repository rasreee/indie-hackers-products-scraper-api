import { GetProductHit, GetProductsData, Product } from '@interfaces/products.interface';
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

const PARAMS = `query=&hitsPerPage=${ParamKeys.hitsPerPage}&page=${ParamKeys.page}&restrictSearchableAttributes=&facets=%5B%5D&tagFilters=`;

const BODY = { requests: [{ indexName: 'products', params: PARAMS } as IHRequest] };

class IndieHackersService {
  constructor(private apiUrl = API_URL, private headers = HEADERS, private params = PARAMS) {}

  private mapToProduct = (hit: GetProductHit): Product => {
    const { _tags, _highlightResult, objectID, productId, startDateStr, last30DaysUniques, ...rest } = hit;

    return { id: productId, tags: _tags, startDate: startDateStr, ...rest } as Product;
  };

  private getBody = (page = 0, hitsPerPage = HITS_PER_PAGE) => {
    const params = this.params.replace(ParamKeys.hitsPerPage, `${hitsPerPage}`).replace(ParamKeys.page, `${page}`);
    return { requests: [{ indexName: 'products', params } as IHRequest] };
  };

  getAllProducts = async () => {
    try {
      const allProducts: any[] = [];
      let page = 0;
      let numPages = 1;

      const response = await axios.post(this.apiUrl, this.getBody(), {
        headers: this.headers,
      });

      if (response.status !== 200) throw new Error(response.statusText);

      const data: GetProductsData = response.data;
      const results = data.results[0];

      const allHits = results.hits;

      // now we know how many pages there are in total
      numPages = results.nbPages;
      page += 1;
      while (page < numPages) {}

      return allProducts;
    } catch (err) {
      throw err;
    }
  };
}

export default IndieHackersService;