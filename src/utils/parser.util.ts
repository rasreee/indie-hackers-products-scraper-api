import { isProduct, Product, RawProduct, RevenueExplanation } from '@interfaces/products.interface';

export const trimAllWhitespace = (s: string) => {
  return s.replace(/[\n\s\t]+/g, '');
};

export const parseMonthlyRevenue = (s: string) => {
  const match = s.trim().split(',').join('').match(/\d+/);
  if (!match) return new Error(`Invalid revenueNumber: ${s}`);
  return parseInt(match[0]);
};

const asEnum = (s: string): RevenueExplanation => {
  if (s === '-verified') return RevenueExplanation.StripeVerified;

  if (s === 'self-reported') return RevenueExplanation.SelfReported;

  throw new Error(`Expected s to be one of the enum values. Got ${s}`);
};

export const parseRevenueExplanation = (s: string): RevenueExplanation | Error => {
  const match = trimAllWhitespace(s).match(/-verified|self-reported/);
  const result: RevenueExplanation | Error = match ? asEnum(match[0]) : new Error(`Invalid revenueExplanation: ${s}`);
  return result;
};

export class ParserUtil {
  static parseId = (path: string) => {
    const id = path.replace(/\/product\//g, '');

    return id ? id : new Error(`Invalid ID: ${path}`);
  };

  static parseProduct = (data: RawProduct): Product => {
    const parsedData = {
      id: this.parseId(data.id),
      name: trimAllWhitespace(data.name),
      tagline: data.tagline.trim(),
      revenueNumber: parseMonthlyRevenue(data.revenueNumber),
      revenueExplanation: parseRevenueExplanation(data.revenueExplanation),
    };

    if (!isProduct(parsedData)) {
      const errors: string[] = [];
      Object.values(parsedData).forEach(result => {
        if (result instanceof Error) {
          errors.push(result.message);
        }
      });

      throw new Error(`Could not parse product for id ${data.id}. Reason: ${errors.join('\n')}`);
    }

    return parsedData;
  };

  static parseProducts = (rawProducts: RawProduct[]): { products: Product[]; errors: string[] } => {
    const products: Product[] = [];
    const errors: string[] = [];
    rawProducts.forEach(data => {
      try {
        const parsedData = this.parseProduct(data);
        products.push(parsedData);
      } catch (err) {
        err instanceof Error && errors.push(err.message);
      }
    });

    return { products, errors };
  };
}
