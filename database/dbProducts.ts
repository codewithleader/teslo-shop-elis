import { IProduct } from '../interfaces';
import { ProductModel } from '../models';
import { db } from './';

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  db.connect();

  const product = await ProductModel.findOne({ slug }).lean();

  db.disconnect();

  if (!product) {
    return null;
  }

  /* Converting the Mongoose document to a plain JavaScript object. (Serialized) */
  return JSON.parse(JSON.stringify(product));
};

interface ProductSlug {
  slug: string
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect();

  const slugs = await ProductModel.find().select('slug -_id').lean();

  await db.disconnect();

  return slugs;
};
