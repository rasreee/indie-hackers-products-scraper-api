import { HttpException } from '@exceptions/HttpException';
import { Product } from '@interfaces/products.interface';
import productModel from '@models/products.model';

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
}

export default ProductService;
