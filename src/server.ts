process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import scraper from '@/scraper';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import ProductsRoute from '@routes/products.route';

validateEnv();

const app = new App([new IndexRoute(), new ProductsRoute()]);

app.listen();

(async () => {
  await scraper();
})();
