import { NextFunction, Request, Response } from 'express';
import { Product } from '@interfaces/products.interface';
import productService from '@services/products.service';

class ProductsController {
  public productService = new productService();

  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllProductsData: Product[] = await this.productService.findAllProduct();

      res.status(200).json({ data: findAllProductsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const findOneProductData: Product = await this.productService.findProductById(productId);

      res.status(200).json({ data: findOneProductData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
