export const productTags = [
  'commitment-full-time',
  'commitment-side-project',
  'employees-0',
  'employees-10-plus',
  'employees-under-10',
  'founders-code-no',
  'founders-code-yes',
  'founders-solo',
  'funding-bootstrapped',
  'funding-seed',
  'funding-self',
  'platform-browser',
  'platform-mobile',
  'platform-web',
  'revenue-model-commission',
  'revenue-model-free',
  'revenue-model-partnerships',
  'revenue-model-subscription',
  'revenue-model-transactional',
  'stripe-verified-revenue',
  'vertical-ai',
  'vertical-analytics',
  'vertical-apis',
  'vertical-b2b',
  'vertical-b2c',
  'vertical-bots',
  'vertical-calendar',
  'vertical-games',
  'vertical-communication',
  'vertical-community',
  'vertical-content',
  'vertical-email-marketing',
  'vertical-finance',
  'vertical-health-fitness',
  'vertical-marketing',
  'vertical-productivity',
  'vertical-programming',
  'vertical-saas',
  'vertical-sales',
  'vertical-shopping',
  'vertical-social-media',
  'vertical-task-management',
  'vertical-writing',
] as const;

export type ProductTag = typeof productTags[number];

export enum MatchLevel {
  none = 'none',
}

export type HighlightResult = {
  value: string;
  matchLevel: MatchLevel;
  matchedWords: string[];
};

export type GetProductsData = {
  results: {
    hits: GetProductHit[];
    nbHits: number;
    page: number;
    nbPages: number;
    hitsPerPage: number;
    exhaustiveNbHits: boolean;
    exhaustiveTypo: boolean;
    query: string;
    params: string;
    index: 'products';
    processingTimeMS: number;
  }[];
};

export enum HighlightKey {
  name = 'name',
  tagline = 'tagline',
  twitterHandle = 'twitterHandle',
  websiteUrl = 'websiteUrl',
}

export type GetProductHit = {
  _tags: ProductTag[];
  approvedTimestamp: number;
  avatarUrl: string;
  bumpedTimestamp: number;
  createdTimestamp: number;
  description: string;
  last30DaysUniques: null | any;
  name: string;
  numFollowers: number;
  productId: string;
  publishedTimestamp: number;
  revenue: number;
  startDateStr: string;
  tagline: string;
  twitterHandle: string;
  updatedTimestamp: number;
  userIds: string[];
  websiteUrl: string;
  objectID: string;
  _highlightResult: Record<HighlightKey, HighlightResult>;
};

export type GetProductsResults = {
  hits: GetProductHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  query: string;
  params: string;
  index: string;
  processingTimeMS: number;
};
