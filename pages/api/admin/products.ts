import type { NextApiRequest, NextApiResponse } from 'next';
import { IProduct } from 'interfaces';
import { db } from 'database';
import { ProductModel } from 'models';

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    case 'POST':
      return res.status(400).json({ message: 'No implementado' });

    case 'PUT':
      return res.status(400).json({ message: 'No implementado' });

    case 'DELETE':
      return res.status(400).json({ message: 'No implementado' });

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const products = await ProductModel.find().sort({ title: 'asc' }).lean();

  await db.disconnect();

  // todo: actualizar imagenes

  return res.status(200).json(products);
};
