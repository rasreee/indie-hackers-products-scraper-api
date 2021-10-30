import axios from 'axios';
import { logger } from '@utils/logger';

class Scraper {
  public url = 'https://www.indiehackers.com/products';

  public async init() {
    const response = await axios.get(this.url);

    logger.info('👌 Scraped page data: ');
    logger.info(response.data);
  }
}

export default Scraper;
