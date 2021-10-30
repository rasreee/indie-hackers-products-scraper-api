import puppeteer from 'puppeteer';
import fs from 'fs';
import { Product, RevenueExplanation } from './interfaces/products.interface';

const productsUrl = 'https://indiehackers.com/products';

/**
 * Grabs required data from the HTML
 */
const getRawProducts = async () => {
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

        const url = node.getAttribute('href');

        // header
        const header = node.querySelector('.product-card__header > div.product-card__header-text');
        const name = header.children.item(0).textContent;
        const tagline = header.children.item(1).textContent;

        // revenue
        const revenueEls = node.querySelector('.product-card__revenue > div.product-card__revenue-text').children;
        const revenueNumber = revenueEls.item(0).textContent.trim();
        const revenueExplanation = revenueEls.item(1).textContent.trim();

        productCards[i] = { url, name, tagline, revenueNumber, revenueExplanation };
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

interface RawProduct {
  url: string;
  name: string;
  tagline: string;
  revenueNumber: string;
  revenueExplanation: string;
}

const parseRevenueExplanation = (val: string) => {
  const result = val.replace('revenue', '').replace(/[\n|\s]+/, '');
  if (result === RevenueExplanation.SelfReported) return RevenueExplanation.SelfReported;
  else if (result === '-verified') return RevenueExplanation.StripeVerified;
  else throw new Error(`invalid revenueExplanation ${val}`);
};

const parseMonthlyRevenue = (val: string) => {
  const result = parseInt(val.match(/\d+/)[0]);
  if (Number.isInteger(result)) return result;
  throw new Error(`invalid revenueNumber ${val}`);
};

const parseProductsData = (rawData: RawProduct[]) => {
  const products: any[] = rawData.map(data => ({
    id: data.url.replace('/product/', ''),
    name: data.name,
    tagline: data.tagline,
    revenueExplanation: parseRevenueExplanation(data.revenueExplanation),
    monthlyRevenue: parseMonthlyRevenue(data.revenueNumber),
  }));
  return products;
};

class Scraper {
  public async init() {
    const rawProducts = await getRawProducts();

    const productsData = parseProductsData(rawProducts);
    fs.writeFile('products.json', JSON.stringify(productsData), err => {
      if (err) throw err;
      console.log('✅ Success!');
      console.log(productsData);
    });
  }
}

export default Scraper;
