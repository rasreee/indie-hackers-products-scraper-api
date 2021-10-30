import { HttpException } from '@exceptions/HttpException';
import { Product } from '@interfaces/products.interface';
import productModel from '@models/products.model';

class ProductService {
  private apiUrl = `${process.env.SIMPLE_SCRAPER_API_URL}?apiKey=${process.env.SIMPLE_SCRAPER_API_KEY}`;

  public products = productModel;

  public async findAllProduct(): Promise<Product[]> {
    const products: Product[] = await fetch(apiUrl);
    return this.products;
  }

  public async findProductById(productId: number): Promise<Product> {
    const findProduct: Product = this.products.find(product => product.id === productId);
    if (!findProduct) throw new HttpException(409, "You're not product");

    return findProduct;
  }
}

export default ProductService;
