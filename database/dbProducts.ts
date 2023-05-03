import { IProduct } from '../interfaces';
import { ProductModel } from '../models';
import { db } from './';

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  await db.connect();

  const product = await ProductModel.findOne({ slug }).lean();

  await db.disconnect();

  if (!product) {
    return null;
  }

  // procesamiento de imagenes cuando la subamos al server
  product.images = product.images.map(image => {
    return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
  });

  /* Converting the Mongoose document to a plain JavaScript object. (Serialized) */
  return JSON.parse(JSON.stringify(product));
};

interface ProductSlug {
  slug: string;
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect();

  const slugs = await ProductModel.find().select('slug -_id').lean();

  await db.disconnect();

  return slugs;
};

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  term = term.toString().toLowerCase();

  await db.connect();

  const products = await ProductModel.find({
    $text: { $search: term },
  })
    .select('title images price inStock slug -_id')
    .lean();

  await db.disconnect();

  const updatedProducts = products.map(product => {
    // procesamiento de imagenes cuando la subamos al server
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
    });

    return product;
  });

  return updatedProducts;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connect();

  const products = await ProductModel.find().lean();

  await db.disconnect();

  const updatedProducts = products.map(product => {
    // procesamiento de imagenes cuando la subamos al server
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
    });

    return product;
  });

  /* Converting the Mongoose document to a plain JavaScript object. (Serialized) */
  return JSON.parse(JSON.stringify(updatedProducts));
};
