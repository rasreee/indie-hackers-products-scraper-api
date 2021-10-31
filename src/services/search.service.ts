import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';

const APPLICATION_ID = 'N86T1R3OWZ';
const API_KEY = '5140dac5e87f47346abbda1a34ee70c3';

export default class SearchService {
  client: SearchClient;
  index: SearchIndex;
  constructor() {
    this.client = algoliasearch(APPLICATION_ID, API_KEY);
    this.index = this.client.initIndex('products');
  }

  async foo() {
    this.index.browseObjects();
  }
}
