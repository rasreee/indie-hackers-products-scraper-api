process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import fs from 'fs';

import App from './app';
import IndexRoute from '@routes/index.route';
import ProductsRoute from '@routes/products.route';
import SyncRoute from '@routes/sync.route';
import validateEnv from '@utils/validateEnv';
import { logDir } from '@utils/logger';

validateEnv();

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const app = new App([new IndexRoute(), new ProductsRoute(), new SyncRoute()]);

app.listen();
