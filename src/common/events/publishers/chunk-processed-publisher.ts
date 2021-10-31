import { Subjects, Publisher, ProductsScrapedEvent } from '@common/events';

export class ProductsScrapedPublisher extends Publisher<ProductsScrapedEvent> {
  subject: Subjects.ProductsScraped = Subjects.ProductsScraped;
}
