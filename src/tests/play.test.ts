import IndieHackersService from '@services/indie-hackers.service';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
});

describe('IndieHackersService', () => {
  jest.setTimeout(5000);
  describe('ih.getProducts', () => {
    it('response statusCode 200', async () => {
      const service = new IndieHackersService();
      try {
        const data = await service.getProducts();

        expect(data).toBeTruthy();
      } catch (err) {
        expect(err).toBeNull();
      }
    });
  });
});
