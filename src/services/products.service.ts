import ScraperService from './scraper.service';
import { HttpException } from '@exceptions/HttpException';
import { Product } from '@interfaces/products.interface';
import { logger } from '@utils/logger';
import { defaultParser } from './constants';

export interface ProductTask {
  type: 'bulkSaveProducts';
  data: Product[];
}

class ProductsService {
  private products: Product[] = [];

  constructor(private scraperService: ScraperService) {}

  public async getProducts(offset = 0, limit = 10): Promise<Product[]> {
    if (offset < 0 || offset >= this.products.length - 1) throw new HttpException(416, 'Range Not Satisfiable');
    return this.products.slice(offset, limit);
  }

  public async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  public async getProductById(productId: string): Promise<Product> {
    const found = this.products.find(product => product.id === productId);
    if (!found) throw new HttpException(409, `Nonexistent product ID ${productId}`);
    return found;
  }

  queue: ProductTask[] = [];

  private handleError(e: Error): void {
    logger.error(JSON.stringify(e, null, 2));
  }

  public async syncProducts(): Promise<void> {
    const { chunks, totalHits } = await this.scraperService.genFutures();

    chunks.map(chunk => {
      if (chunk instanceof Error) return this.handleError(chunk);
      const products = chunk.map(data => defaultParser(data));
      this.queue.push({ type: 'bulkSaveProducts', data: products });
    });
  }
}

export default ProductsService;
