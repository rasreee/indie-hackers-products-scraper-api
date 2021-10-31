export const MethodEnum: Readonly<Record<string, MethodType>> = {
  Delete: 'DELETE',
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
};

export type MethodType = 'DELETE' | 'GET' | 'POST' | 'PUT';

export type ObjectWithObjectID = {
  /**
   * The object id of the object.
   */
  readonly objectID: string;
};

export type BrowseResponse<TObject> = {
  /**
   * The hits per page.
   */
  hits: Array<TObject & ObjectWithObjectID>;

  /**
   * The cursor used for iterate on the next page.
   */
  cursor?: string;
};

export type BrowseOptions<TObject> = {
  /**
   * The callback called for each batch of objects.
   */
  readonly batch?: (batch: ReadonlyArray<TObject & ObjectWithObjectID>) => any;

  /**
   * The callback called to determine if the browse should stop. By
   * default this checks whether there's any more content to get.
   */
  readonly shouldStop?: (response: BrowseResponse<TObject>) => boolean;
};

export type BrowseRequestData = {
  /**
   * If available, should be used for browsing to the next page.
   */
  readonly cursor?: string;

  /**
   * If cursor is not available, should be used for browsing to the next page.
   */
  readonly page?: number;
};
