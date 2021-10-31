import { getProductFixtures } from '@fixtures/products.fixture';
import { ParserUtil } from '@utils/parser.util';

describe('parser', () => {
  describe('parseId', () => {
    it('should parse productID correctly / parseId ', () => {
      const projectId = 'test-parse-id__SUCCESS';
      const mockData = `/product/${projectId}`;
      const result = ParserUtil.parseId(mockData);
      expect(result).toEqual(projectId);
    });
  });

  it('should parse all products successfully / parseProducts', () => {
    const data = getProductFixtures();
    const res = ParserUtil.parseProducts(data);
    expect(res.errors).toEqual([]);
  });
});
