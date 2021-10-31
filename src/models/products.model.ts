import { Product } from '@interfaces/products.interface';
import mongoose from 'mongoose';

const schema = new mongoose.Schema<Product>({
  id: { type: String, required: true },
  tags: { type: Array, required: true },
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  startDate: { type: String, required: true },
  approvedTimestamp: Number,
  avatarUrl: { type: String, required: true },
  bumpedTimestamp: { type: Number, required: true },
  createdTimestamp: Number,
  description: { type: String, required: true },
  numFollowers: { type: Number, required: true },
  publishedTimestamp: { type: Number, required: true },
  revenue: { type: Number, required: true },
  twitterHandle: { type: Number, required: true },
  updatedTimestamp: { type: Number, required: true },
  userIds: { type: Array, required: true },
  websiteUrl: { type: String, required: true },
});

const ProductModel = mongoose.model('Product', schema);

export default ProductModel;
