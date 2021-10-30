import puppeteer from 'puppeteer';
import fs from 'fs';
import { logger } from './utils/logger';

const scraperApiKey = process.env.SCRAPER_API_KEY;

const productsUrl = 'https://indiehackers.com/products';
const proxyUrl = `http://scraperapi.render=true:${scraperApiKey}@proxy-server.scraperapi.com:8001`;

const getVisual = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(productsUrl);
    await page.waitForSelector('.product-card__link');

    const result = await page.evaluate(() => {
      const linkEls = document.querySelectorAll('a.product-card__link');
      const links: string[] = [];
      for (let i = 0; i < linkEls.length; i++) {
        links[i] = linkEls[i].getAttribute('href');
      }

      return links;
    });
    await browser.close();
    return result;
  } catch (error) {
    console.error(error);
  }
};

class Scraper {
  public async init() {
    const page = await getVisual();
    fs.writeFile('products.json', JSON.stringify(page), err => {
      if (err) throw err;
      console.log('✅ SUCCESS!');
    });
    logger.info('\n⭐ RESULT:\n');
    logger.info(page);
  }
}

export default Scraper;
