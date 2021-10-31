import axios from 'axios';
import { GetProductHit, GetProductsData } from '@interfaces/products.interface';
import { logger } from '@utils/logger';
import { DEFAULT_HEADERS, IH_API_URL, PARAMS_TEMPLATE, defaultParser, ParamKeys, IHGetProductsReq } from './constants';

const DEFAULT_OPTIONS: Dict = { headers: DEFAULT_HEADERS, apiUrl: IH_API_URL, params: PARAMS_TEMPLATE };

type Chunk = GetProductHit[] | Error;

export type GenFuturesResult = {
  chunks: Chunk[];
  totalHits: number;
};

class ScraperService {
  private opts: Dict;

  constructor(opts?: Dict) {
    this.opts = { ...DEFAULT_OPTIONS, ...opts };
  }

  private getBody = (page: number, hitsPerPage = 16) => {
    const params = this.opts.params.replace(ParamKeys.hitsPerPage, `${hitsPerPage}`).replace(ParamKeys.page, `${page}`);
    return { requests: [{ indexName: 'products', params } as IHGetProductsReq] };
  };

  public getPage = async (page = 0) => {
    const response = await axios.post(this.opts.apiUrl, this.getBody(page), {
      headers: this.opts.headers,
    });
    return response.data.results[0] as GetProductsData;
  };

  // TODO batch the pages in chunks
  genFutures = async (): Promise<GenFuturesResult> => {
    const res = await this.getPage(0).then(async ({ hits, nbPages: totalPages }) => {
      const chunks: Array<Chunk> = [hits];

      let totalHits = hits.length;
      let page = 1;
      while (page < totalPages) {
        const data = await this.getPage(page)
          .then(({ hits }) => {
            totalHits += hits.length;
            return hits;
          })
          .catch(err => {
            if (err instanceof Error) return err;
            return new Error('Caught unknown error type');
          });

        chunks[page] = data;
        page += 1;
      }

      logger.info('# Chunks: ', chunks.length);
      logger.info('# Hits: ', totalHits);
      return { chunks, totalHits };
    });

    return res;
  };
}

export default ScraperService;
