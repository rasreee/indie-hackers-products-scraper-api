import ScraperService from './scraper.service';
import { HttpException } from '@exceptions/HttpException';
import { GetProductHit, Product } from '@interfaces/products.interface';
import { logger } from '@utils/logger';
import { defaultParser } from './constants';
import QueueService, { WorkerNames } from './queue.service';

export interface ProductTask {
  type: 'bulkSaveProducts';
  data: Product[];
}

class ProductsService {
  private products: Product[] = [];

  constructor(private scraperService: ScraperService, private queueService: QueueService) {}

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

  public parseProducts(hits: GetProductHit[]): Product[] {
    const parsedProducts = hits.map(data => defaultParser(data));

    return parsedProducts;
  }

  public async bulkSaveProducts(products: Product[]) {
    logger.info('Called bulkSaveProducts()');
  }

  public async syncProducts(): Promise<void> {
    await this.scraperService.startSyncProducts(
      chunk => {
        logger.info(`👉 Got chunk with ${chunk.length} items`);
        const data = this.parseProducts(chunk);
        this.queueService.push(WorkerNames.BULK_SAVE_PRODUCTS, data);
      },
      e => {
        logger.error(e);
      },
    );
  }
}

export default ProductsService;
