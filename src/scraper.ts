import axios from 'axios';
import { logger } from '@utils/logger';

const PAGE_URL = 'https://www.indiehackers.com/products';

const scraper = async () => {
  const response = await axios.get(PAGE_URL);

  logger.info('👌 Scraped page data: ');
  logger.info(response.data);
};

export default scraper;
