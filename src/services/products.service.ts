import { Product } from '@interfaces/products.interface';
import productModel from '@models/products.model';

class ProductService {
  private apiUrl = `${process.env.SIMPLE_SCRAPER_API_URL}?apiKey=${process.env.SIMPLE_SCRAPER_API_KEY}`;

  public products = productModel;

  public async findAllProduct(): Promise<Product[]> {
    return this.products;
  }

  public async findProductById(productId: string): Promise<Product> {
    // const findProduct: Product = this.products.find(product => product.id === productId);
    // if (!findProduct) throw new HttpException(409, "You're not product");
    // return findProduct;
    return this.products[0];
  }
}

export default ProductService;
