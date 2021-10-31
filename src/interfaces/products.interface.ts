import { isNumber, isObject, isString } from '@utils/util';

export enum RevenueExplanation {
  SelfReported = 'self-reported',
  StripeVerified = 'stripe-verified',
}
export interface Product {
  id: string;
  name: string;
  tagline: string;
  revenueExplanation: RevenueExplanation;
  revenueNumber: number;
}

export type RawProduct = { [k in keyof Product]: any };

export const isRevenueExplanation = (o: any): o is RevenueExplanation => {
  return [isString(o), o === RevenueExplanation.StripeVerified || RevenueExplanation.SelfReported].every(res => res);
};

export const isProduct = (o: any): o is Product => {
  return [
    isObject(o),
    isString(o.id),
    isString(o.name),
    isString(o.tagline),
    isNumber(o.revenueNumber),
    isRevenueExplanation(o.revenueExplanation),
  ].every(res => res);
};
