import App from '@app';
import ProductsRoute from '@routes/products.route';
import Scraper from '@scraper';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 5000));
});

describe('scraper', () => {
  describe('scraper.init', () => {
    it('should initialize the Scraper', () => {
      const productsRoute = new ProductsRoute();
      const app = new App([productsRoute]);
      const scraper = new Scraper(app);

      expect(() => {
        scraper
          .init()
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
