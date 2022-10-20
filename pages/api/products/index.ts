import type { NextApiRequest, NextApiResponse } from 'next';
import { db, SHOP_CONSTANTS } from '../../../database';
import { IProduct } from '../../../interfaces';
import { ProductModel } from '../../../models';

type Data = { message: string } | IProduct[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    default:
      return res.status(400).json({ message: 'Bad Request | Elis' });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = 'all' } = req.query;

  let condition = {};

  if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = { gender };
  }
  await db.connect();

  const products = await ProductModel.find(condition)
    .select('title images price inStock slug -_id') // INCREIBLE 🤯 Para filtrar por propiedad 😱
    .lean(); // lean(): trae menos información.

  await db.disconnect();

  res.status(200).json(products);
};
