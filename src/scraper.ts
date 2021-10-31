import puppeteer from 'puppeteer';
import fs from 'fs';
import { Product, RevenueExplanation } from './interfaces/products.interface';
import path from 'path';
import { logger } from './utils/logger';

const productsUrl = 'https://indiehackers.com/products';

/**
 * Grabs required data from the HTML
 * TODO have a cron job update this data
 * TODO either the
 */
const scrapeProductsData = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(productsUrl);
    await page.waitForSelector('a.product-card__link');

    const result = await page.evaluate(() => {
      const linkEls = document.querySelectorAll('a.product-card__link');

      const rawData: any[] = [];

      for (let i = 0; i < linkEls.length; i++) {
        const node = linkEls[i];

        // id
        const id = node.getAttribute('href');

        // header
        const headerEls = node.querySelector('.product-card__header > div.product-card__header-text')?.children;
        const name = headerEls?.item(0)?.textContent;
        const tagline = headerEls?.item(1)?.textContent;

        // revenue
        const revenueEls = node.querySelector('.product-card__revenue > div.product-card__revenue-text')?.children;
        const revenueNumber = revenueEls?.item(0)?.textContent;
        const revenueExplanation = revenueEls?.item(1)?.textContent;

        rawData[i] = { id, name, tagline, revenueNumber, revenueExplanation };
      }

      return rawData;
    });

    await browser.close();

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

class Scraper {
  mapRawProductData = (data: { id: any; name: any; tagline: any; revenueNumber: any; revenueExplanation: any }): Product => {
    const { id, name, tagline, revenueNumber, revenueExplanation } = data;
    if (typeof id !== 'string') throw new Error('Invalid product id');
    if (typeof name !== 'string') throw new Error('Invalid name');
    if (typeof tagline !== 'string') throw new Error('Invalid tagline');
    if (typeof revenueNumber !== 'string') throw new Error(`Invalid monthly revenue`);
    if (!(revenueExplanation in RevenueExplanation)) throw new Error(`Invalid revenue explanation`);

    return { id, name, tagline, monthlyRevenue: parseInt(revenueNumber), revenueExplanation };
  };

  init = async () => {
    logger.info('---------------------------------------');
    logger.info('        👋 Initializing Scraper        ');
    logger.info('---------------------------------------');
    const rawData = await scrapeProductsData();

    const productsData = rawData.map(this.mapRawProductData);

    fs.writeFile(path.join(__dirname, 'fixtures/products.json'), JSON.stringify(productsData), err => {
      if (err) throw err;
      logger.info('✅ Success!');
      logger.info(productsData);
    });
  };
}

export default Scraper;
