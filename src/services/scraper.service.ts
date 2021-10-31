import axios from 'axios';
import { GetProductHit, GetProductsData } from '@interfaces/products.interface';
import { logger } from '@utils/logger';
import { DEFAULT_HEADERS, IH_API_URL, PARAMS_TEMPLATE, ParamKeys, IHGetProductsReq } from './constants';

const DEFAULT_OPTIONS: Dict = { headers: DEFAULT_HEADERS, apiUrl: IH_API_URL, params: PARAMS_TEMPLATE };

type Chunk = GetProductHit[] | Error;

export type SyncProductsResult = {
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
  startSyncProducts = async (onChunk: (chunk: GetProductHit[]) => void, onError: (e: Error) => void): Promise<void> => {
    const futureChunks: Array<Promise<Chunk>> = [];

    const firstRes = await this.getPage(0);

    const totalHits = firstRes.nbHits;
    logger.info('# Chunks: ', futureChunks.length);
    logger.info('# Hits: ', totalHits);

    onChunk(firstRes.hits);
    let page = 1;
    while (page < firstRes.nbPages - 1) {
      try {
        const nextChunk = await this.getPage(page).then(res => res.hits);
        onChunk(nextChunk);
      } catch (err) {
        err instanceof Error ? onError(err) : onError(new Error('Caught unknown error: ' + JSON.stringify(err)));
      }
      page += 1;
    }
  };
}

export default ScraperService;
