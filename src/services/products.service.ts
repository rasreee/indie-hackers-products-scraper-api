import { HttpException } from '@exceptions/HttpException';
import { Product } from '@interfaces/products.interface';
import { saveFixture } from '@utils/fixture.util';
import ScraperService from './scraper.service';

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

  public async syncProducts(): Promise<Product[]> {
    const products = await this.scraperService.getAllProducts();

    this.products = [...products];

    saveFixture('products.json', products);

    return products;
  }
}

export default ProductsService;
