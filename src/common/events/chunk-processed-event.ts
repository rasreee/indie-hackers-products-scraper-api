import { Product } from '@interfaces/products.interface';
import { Subjects } from './subjects';

export interface ProductsScrapedEvent {
  subject: Subjects.ProductsScraped;
  data: {
    products: Product[];
  };
}
