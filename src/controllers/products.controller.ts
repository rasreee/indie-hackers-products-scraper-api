import { NextFunction, Request, Response } from 'express';
import { Product } from '@interfaces/products.interface';
import ProductsService from '@services/products.service';
import ScraperService from '@services/scraper.service';

class ProductsController {
  public productsService: ProductsService;
  constructor(scraperService: ScraperService) {
    this.productsService = new ProductsService(scraperService);
  }

  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const offset = parseInt(req.query.offset as string);
      const limit = parseInt(req.query.limit as string);
      const getProductsData = await this.productsService.getProducts(offset, limit);

      res.status(200).json({ data: getProductsData, message: 'get' });
    } catch (error) {
      next(error);
    }
  };

  public getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const getAllProductsData: Product[] = await this.productsService.getAllProducts();

      res.status(200).json({ data: getAllProductsData, message: 'getAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const getOneProductData: Product = await this.productsService.getProductById(productId);

      res.status(200).json({ data: getOneProductData, message: 'getOne' });
    } catch (error) {
      next(error);
    }
  };

  public syncProducts = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedData = await this.productsService.syncProducts();
      res.status(200).json({ data: updatedData, message: 'syncAll' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
