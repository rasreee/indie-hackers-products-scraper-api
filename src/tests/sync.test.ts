import request from 'supertest';
import App from '@app';
import SyncRoute from '@routes/sync.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 5000));
});

describe('Testing Sync', () => {
  jest.setTimeout(30000);
  describe('[GET] /sync', () => {
    it('response statusCode 200', () => {
      const syncRoute = new SyncRoute();
      const app = new App([syncRoute]);

      return request(app.getServer()).get(`${syncRoute.path}`).expect(200);
    });
  });
});
