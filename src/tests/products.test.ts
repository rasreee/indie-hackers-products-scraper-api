import App from '@app';
import ProductModel from '@models/products.model';
import ProductRoute from '@routes/products.route';
import request from 'supertest';
import { getProductFixture } from '@fixtures/products.fixture';
import { Product } from '@interfaces/products.interface';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 5000));
});

describe('Testing Products', () => {
  jest.setTimeout(30000);

  describe('[GET] /products?', () => {
    it('responds statusCode 200 / get 10', done => {
      const productsRoute = new ProductRoute();
      const app = new App([productsRoute]);
      return request(app.getServer())
        .get(`${productsRoute.path}?offset=${0}&limit=${10}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.ok);
          expect(res.body.message).toEqual('get');
          expect(res.body.data.length).toBeLessThanOrEqual(10);
        });
    });
  });

  describe('[GET] /products/all', () => {
    it('response statusCode 200 / getAll', async () => {
      const getProduct: Product[] = await ProductModel.find();
      const productsRoute = new ProductRoute();
      const app = new App([productsRoute]);
      return request(app.getServer()).get(`${productsRoute.path}/all`).expect(200, { data: getProduct, message: 'getAll' });
    });
  });

  describe('[GET] /products/:id', () => {
    it('response statusCode 200 / getOne', () => {
      const productId = 'legup-health-for-now';
      const expectedProduct = getProductFixture(productId);
      const productsRoute = new ProductRoute();
      const app = new App([productsRoute]);
      const test = request(app.getServer()).get(`${productsRoute.path}/${productId}`);
      test.expect(200, { data: expectedProduct, message: 'getOne' });
    });
  });

  describe('[GET] /products/sync', () => {
    it('response statusCode 200 / syncAll', done => {
      const productsRoute = new ProductRoute();
      const app = new App([productsRoute]);

      return request(app.getServer())
        .get(`${productsRoute.path}/sync`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toEqual('syncAll');
        });
    });
  });
});
