import { Product } from '@interfaces/products.interface';
import Queue from 'bull';
import { ProductsScrapedPublisher } from '@common/events/publishers/chunk-processed-publisher';
import { natsWrapper } from '../nats-wrapper';

const scraperQueue = new Queue<{ products: Product[] }>('products:scraper', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

scraperQueue.process(async job => {
  new ProductsScrapedPublisher(natsWrapper.client).publish({
    products: job.data.products,
  });
});

export { scraperQueue };
