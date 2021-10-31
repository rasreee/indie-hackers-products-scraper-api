import puppeteer from 'puppeteer';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import { mergeMessages } from '@utils/util';
import { ParserUtil } from '@utils/parser.util';
import { Product } from '@interfaces/products.interface';
import { saveFixture } from '@utils/fixture.util';
import { getProductsFixture } from '@fixtures/results.fixture';

class ProductService {
  public products = getProductsFixture();

  public async getProducts(offset = 0, limit = 10): Promise<Product[]> {
    if (offset < 0 || offset >= this.products.length - 1) throw new HttpException(416, 'Range Not Satisfiable');
    return this.products.slice(offset, limit);
  }

  public async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  public async getProductById(productId: string): Promise<Product> {
    // const getProduct: Product = this.products.get(product => product.id === productId);
    // if (!getProduct) throw new HttpException(409, "You're not product");
    // return getProduct;
    return this.products[0];
  }

  public async syncProducts(): Promise<Product[]> {
    const rawData = await scrapeProductsData();

    const { errors, products } = ParserUtil.parseProducts(rawData);

    errors.length && logger.error(`Omitted ${errors.length} items due to parsing errors.\nDetails: `, mergeMessages(errors));
    logger.info(`Saved ${products.length}/${rawData.length}`, errors);

    this.products = [...products];

    saveFixture('raw-products.json', rawData);
    saveFixture('products.json', products);

    return products;
  }
}

export default ProductService;
