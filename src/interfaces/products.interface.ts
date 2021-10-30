export enum RevenueExplanation {
  SelfReported = 'self-reported',
  StripeVerified = 'stripe-verified',
}
export interface Product {
  id: string;
  name: string;
  tagline: string;
  revenueExplanation: RevenueExplanation;
  monthlyRevenue: number;
}
