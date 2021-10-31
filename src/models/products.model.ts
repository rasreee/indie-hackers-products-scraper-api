import { Product } from '@interfaces/products.interface';
import mongoose from 'mongoose';

const schema = new mongoose.Schema<Product>({
  id: String,
  tags: Array,
  name: String,
  tagline: String,
  startDate: String,
  last30DaysUniques: null,
  approvedTimestamp: Number,
  avatarUrl: String,
  bumpedTimestamp: Number,
  createdTimestamp: Number,
  description: String,
  numFollowers: Number,
  publishedTimestamp: Number,
  revenue: Number,
  twitterHandle: String,
  updatedTimestamp: Number,
  userIds: Array,
  websiteUrl: String,
});

const ProductModel = mongoose.model('Product', schema);

export default ProductModel;
