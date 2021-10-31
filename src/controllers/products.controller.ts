import { NextFunction, Request, Response } from 'express';
import { Product } from '@interfaces/products.interface';
import productService from '@services/products.service';

class ProductsController {
  public productService = new productService();

  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const offset = parseInt(req.query.offset as string);
      const limit = parseInt(req.query.limit as string);
      const getProductsData = await this.productService.getProducts(offset, limit);

      res.status(200).json({ data: getProductsData, message: 'get' });
    } catch (error) {
      next(error);
    }
  };

  public getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const getAllProductsData: Product[] = await this.productService.getAllProducts();

      res.status(200).json({ data: getAllProductsData, message: 'getAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const getOneProductData: Product = await this.productService.getProductById(productId);

      res.status(200).json({ data: getOneProductData, message: 'getOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
