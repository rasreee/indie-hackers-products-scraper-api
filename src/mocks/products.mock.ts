import scrapedProductsData from './scraped-products-data.json';

export type ScrapedProductData = {
  tagline: string;
  name: string;
  revenueExplanationText: string;
  revenueNumberText: string;
};

export const getMockScrapedProducts = () => {
  const products: ScrapedProductData[] = scrapedProductsData.map(scrapedProduct => ({ ...scrapedProduct } as ScrapedProductData));
  return products;
};
