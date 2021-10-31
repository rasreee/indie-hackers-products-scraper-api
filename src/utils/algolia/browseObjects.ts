import { createBrowsablePromise } from './createBrowsablePromise';
import { encode } from './helpers';
import { SearchIndex, SearchOptions } from './search';
import { RequestOptions } from './transporter';
import { BrowseOptions, BrowseResponse, MethodEnum } from './types';

export const browseObjects = (base: SearchIndex) => {
  return <TObject>(requestOptions?: SearchOptions & BrowseOptions<TObject> & RequestOptions): Readonly<Promise<void>> => {
    return createBrowsablePromise<TObject>({
      shouldStop: response => response.cursor === undefined,
      ...requestOptions,
      request: (data: Record<string, any>): Readonly<Promise<BrowseResponse<TObject>>> =>
        base.transporter.read(
          {
            method: MethodEnum.Post,
            path: encode('1/indexes/%s/browse', base.indexName),
            data,
          },
          requestOptions,
        ),
    });
  };
};
