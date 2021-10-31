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
  Referer: 'https://www.scraper.com/products',
  'Referrer-Policy': 'unsafe-url',
};

const HITS_PER_PAGE = 16;

interface IHGetProductsReq {
  indexName: 'products';
  params: string;
}

const ParamKeys = {
  page: ':page',
  hitsPerPage: ':hitsPerPage',
};

const PARAMS = `query=&hitsPerPage=${ParamKeys.hitsPerPage}&page=${ParamKeys.page}&restrictSearchableAttributes=&facets=%5B%5D&tagFilters=`;

const BODY = { requests: [{ indexName: 'products', params: PARAMS } as IHGetProductsReq] };

class ScraperService {
  constructor(private apiUrl = API_URL, private headers = HEADERS, private params = PARAMS) {}

  private getBody = (page = 0, hitsPerPage = HITS_PER_PAGE) => {
    const params = this.params.replace(ParamKeys.hitsPerPage, `${hitsPerPage}`).replace(ParamKeys.page, `${page}`);
    return { requests: [{ indexName: 'products', params } as IHGetProductsReq] };
  };

  public getProducts = async () => {
    const response = await axios.post(this.apiUrl, this.getBody(), {
      headers: this.headers,
    });
    return response.data as GetProductsData;
  };

  getAllProducts = async () => {
    try {
      const allProducts: Array<Promise<GetProductsData>> = [];
      const { hits, nbPages: totalPages } = await this.getProducts().then(data => data.results[0]);

      return allProducts;
    } catch (err) {
      throw err;
    }
  };
}

export default ScraperService;
