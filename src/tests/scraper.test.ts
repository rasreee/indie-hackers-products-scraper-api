import ProductsRoute from '@routes/products.route';
import Scraper from '@scraper';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 5000));
});

describe('scraper', () => {
  describe('scraper.run', () => {
    it('should run the scraper / runScraper', () => {
      const productsRoute = new ProductsRoute();
      const scraper = new Scraper();

      expect(() => {
        scraper
          .run()
          .then(() => {
            expect(productsRoute.productsController.productService.products).toHaveLength(16);
          })
          .catch(err => {
            throw err;
          });
      }).not.toThrow();
    });
  });
});
