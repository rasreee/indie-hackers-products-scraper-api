import puppeteer from 'puppeteer';
import fs from 'fs';
import { Product, RevenueExplanation } from './interfaces/products.interface';
import path from 'path';

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
      const productCards: Product[] = [];
      for (let i = 0; i < linkEls.length; i++) {
        const node = linkEls[i];

        // id
        const id = node.getAttribute('href')?.replace('/product/', '');

        // header
        const headerEls = node.querySelector('.product-card__header > div.product-card__header-text')?.children;
        const name = headerEls?.item(0)?.textContent;
        const tagline = headerEls?.item(1)?.textContent;

        // revenue
        const revenueEls = node.querySelector('.product-card__revenue > div.product-card__revenue-text')?.children;
        const revenueNumberMatch = revenueEls?.item(0)?.textContent?.trim().match(/\d+/);
        const monthlyRevenue = revenueNumberMatch ? parseInt(revenueNumberMatch[0]) : null;
        let revenueExplanation = revenueEls
          ?.item(1)
          ?.textContent?.trim()
          ?.replace('revenue', '')
          .replace(/[\n|\s]+/, '');
        if (revenueExplanation === '-verified') {
          revenueExplanation = RevenueExplanation.StripeVerified;
        }

        if (!id) throw new Error('Invalid product id');
        if (!name) throw new Error('Invalid name');
        if (!tagline) throw new Error('Invalid tagline');
        if (!monthlyRevenue) throw new Error(`Invalid monthly revenue`);
        if (!revenueExplanation || revenueExplanation !== RevenueExplanation.SelfReported) throw new Error(`Invalid revenue explanation`);

        productCards[i] = { id, name, tagline, monthlyRevenue, revenueExplanation };
      }

      return productCards;
    });
    await browser.close();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

class Scraper {
  public async init() {
    const scrapedData = await scrapeProductsData();

    fs.writeFile(path.join(__dirname, 'fixtures/products.json'), JSON.stringify(scrapedData), err => {
      if (err) throw err;
      console.log('✅ Success!');
      console.log(scrapedData);
    });
  }
}

export default Scraper;
