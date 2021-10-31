import { GetProductHit, GetProductsResults } from '@fixtures/results.fixture';
import axios from 'axios';

const API_URL =
  'https://n86t1r3owz-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)%3B%20JS%20Helper%202.21.1&x-algolia-application-id=N86T1R3OWZ&x-algolia-api-key=5140dac5e87f47346abbda1a34ee70c3';

class IndieHackersService {
  getProducts = async () => {
    const body = {
      requests: [{ indexName: 'products', params: 'query=&hitsPerPage=16&page=0&restrictSearchableAttributes=&facets=%5B%5D&tagFilters=' }],
    };

    const headers = {
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

    const response = await axios.post(API_URL, body, {
      headers,
    });

    if (response.status === 200) {
      const results: GetProductsResults = response.data.results;
      return results;
    }

    const error = new Error(response.statusText);
    throw error;
  };
}

export default IndieHackersService;
