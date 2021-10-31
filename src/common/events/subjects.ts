export enum Subjects {
  ProductsCleared = 'products:cleared', // all products data has been deleted
  ProductsScraped = 'products:scraped', // a chunk of products has been fetched
  ScrapeComplete = 'scrape:complete', // done scraping all IH website data
}
