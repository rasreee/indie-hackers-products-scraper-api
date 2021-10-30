import { Product, RevenueExplanation } from '@interfaces/products.interface';

const productModel: Product[] = [
  {
    id: 'airgram',
    name: 'Airgram',
    tagline: 'Recording, transcript, notes for zoom & google meet.',
    revenueExplanation: RevenueExplanation.SelfReported,
    monthlyRevenue: 0,
  },
  {
    id: 'karma',
    name: 'Karma',
    tagline: 'WFH sorted: praise, rewards, surveys and watercooler chats',
    revenueExplanation: RevenueExplanation.StripeVerified,
    monthlyRevenue: 24877,
  },
];

export default productModel;
