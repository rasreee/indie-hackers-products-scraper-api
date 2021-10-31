import request from 'supertest';
import App from '@app';
import SyncRoute from '@routes/sync.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Sync', () => {
  describe('[GET] /sync', () => {
    it('response statusCode 200', () => {
      const syncRoute = new SyncRoute();
      const app = new App([syncRoute]);

      return request(app.getServer()).get(`${syncRoute.path}`).expect(200);
    });
  });
});
