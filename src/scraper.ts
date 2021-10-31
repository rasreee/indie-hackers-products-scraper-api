import App from './app';
import puppeteer from 'puppeteer';

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
  constructor(private app: App) {}

  init = async () => {
    const rawData = await scrapeProductsData();

    this.app.saveData(rawData);
  };
}

export default Scraper;
