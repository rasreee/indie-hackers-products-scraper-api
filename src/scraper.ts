import puppeteer from 'puppeteer';
import fs from 'fs';

const productsUrl = 'https://indiehackers.com/products';

/**
 * Grabs required data from the HTML
 */
const getVisual = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(productsUrl);
    await page.waitForSelector('a.product-card__link');

    const result = await page.evaluate(() => {
      const linkEls = document.querySelectorAll('a.product-card__link');
      const productCards: any[] = [];
      for (let i = 0; i < linkEls.length; i++) {
        const node = linkEls[i];

        const id = node.getAttribute('href').replace('/product/', '');
        const header = node.querySelector('.product-card__header > div.product-card__header-text');
        const name = header.children.item(0).textContent;
        const tagline = header.children.item(1).textContent;

        // get revenue data
        const revenue = node.querySelector('.product-card__revenue > div.product-card__revenue-text');
        const revenueNumber = revenue.children.item(0).childNodes.item(1).textContent.trim();
        const revenueExplanationText = revenue.children
          .item(1)
          .textContent.trim()
          .replace(/[\n|\s]+revenue/, '');
        const revenueExplanation = revenueExplanationText === 'self-reported' ? revenueExplanationText : 'stripe-verified';

        productCards[i] = { id, name, tagline, revenueNumber: parseInt(revenueNumber), revenueExplanation };
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
    const productsData = await getVisual();
    fs.writeFile('products.json', JSON.stringify(productsData), err => {
      if (err) throw err;
      console.log('✅ Success!');
      console.log(productsData);
    });
  }
}

export default Scraper;
