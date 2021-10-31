import axios from 'axios';
import { GetProductHit, GetProductsData, Product } from '@interfaces/products.interface';
import { logger } from '@utils/logger';

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

const ARGS = { headers: HEADERS, apiUrl: API_URL, params: PARAMS };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultParser = ({ _tags: tags, productId: id, startDateStr: startDate, _highlightResult, ...rest }: GetProductHit): Product => {
  const product: Product = { id, tags, startDate, ...rest };

  return product;
};

class ScraperService {
  constructor(private args = ARGS, private log = logger, private parser = defaultParser) {}

  private getBody = (page: number, hitsPerPage = HITS_PER_PAGE) => {
    const params = this.args.params.replace(ParamKeys.hitsPerPage, `${hitsPerPage}`).replace(ParamKeys.page, `${page}`);
    return { requests: [{ indexName: 'products', params } as IHGetProductsReq] };
  };

  public getPage = async (page = 0) => {
    const response = await axios.post(this.args.apiUrl, this.getBody(page), {
      headers: this.args.headers,
    });
    return response.data.results[0] as GetProductsData;
  };

  getAllProducts = async () => {
    try {
      const initialPromise = this.getPage();

      const allPromises = await initialPromise.then(({ hits, nbPages: totalPages }) => {
        const promises: Array<Promise<GetProductHit[]>> = [new Promise(resolve => resolve(hits))];

        let page = 1;
        while (page < totalPages) {
          promises[page] = this.getPage(page).then(data => data.hits);
          page += 1;
        }

        return promises;
      });

      const allHits = await Promise.all(allPromises);

      const allProducts = allHits.flat().map(this.parser);
      this.log.info(`Scraped ${allProducts.length} products:`);
      this.log.info(allProducts);
      return allProducts;
    } catch (err) {
      this.log.error('Failed to scrape products: ', err);
      throw err;
    }
  };
}

export default ScraperService;
