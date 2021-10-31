process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';

import App from './app';
import IndexRoute from '@routes/index.route';
import ProductsRoute from '@routes/products.route';
import validateEnv from '@utils/validateEnv';
import { natsWrapper } from 'nats-wrapper';
import { ProductsScrapedListener } from '@common/events/listeners/products-scraped-listener';

validateEnv();

const connectNats = async () => {
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ProductsScrapedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

const app = new App([new IndexRoute(), new ProductsRoute()]);

app.listen();
