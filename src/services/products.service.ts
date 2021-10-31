import productModel from '@models/products.model';
import puppeteer from 'puppeteer';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import { mergeMessages } from '@utils/util';
import { ParserUtil } from '@utils/parser.util';
import { Product } from '@interfaces/products.interface';
import { saveFixture } from '@utils/fixture.util';

const scrapeProductsData = async () => {
  const productsUrl = 'https://indiehackers.com/products';

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(productsUrl);
    await page.waitForSelector('a.product-card__link');

    const result = await page.evaluate(() => {
      const linkEls = document.querySelectorAll('a.product-card__link');

      const rawData: any[] = [];

      for (let i = 0; i < linkEls.length; i++) {
        const node = linkEls[i];

        // id
        const id = node.getAttribute('href');

        // header
        const headerEls = node.querySelector('.product-card__header > div.product-card__header-text')?.children;
        const name = headerEls?.item(0)?.textContent;
        const tagline = headerEls?.item(1)?.textContent;

        // revenue
        const revenueEls = node.querySelector('.product-card__revenue > div.product-card__revenue-text')?.children;
        const revenueNumber = revenueEls?.item(0)?.textContent;
        const revenueExplanation = revenueEls?.item(1)?.textContent;

        rawData[i] = { id, name, tagline, revenueNumber, revenueExplanation };
      }

      return rawData;
    });

    await browser.close();

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

class ProductService {
  public products = productModel;

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
