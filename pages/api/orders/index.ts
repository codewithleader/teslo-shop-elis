import type { NextApiRequest, NextApiResponse } from 'next';
// next-auth
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
// import { getSession } from 'next-auth/react';
// lodash
import { round } from 'lodash';
// mongoDB
import { db } from '../../../database';
// interfaces
import { IOrder } from '../../../interfaces';
import { ProductModel, OrderModel } from '../../../models';

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  // Verificar que tengamos un usuario
  // const session: any = await getSession({ req }); // { expires: string, user: IUser } - Al mandar la request (req) van las cookies y se sabrá si hay un user 😱

  const session = await getServerSession(req, res, authOptions); // ? Nuevo cambio

  if (!session) {
    return res.status(401).json({ message: 'Debe estar autenticado para hacer esto' });
  }

  // Crear un arreglo con los productos que la persona quiere
  const productsIds: string[] = orderItems.map(product => product._id);

  await db.connect();
  // Buscar productos cuyo _id esté incluido en productsIds
  const dbProducts = await ProductModel.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice: number | undefined = dbProducts.find(
        prod => prod.id === current._id
      )?.price;
      if (!currentPrice) {
        throw new Error('Verifique el carrito de nuevo, producto no existe');
      }
      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (taxRate + 1);

    if (total !== backendTotal) {
      throw new Error('El total no cuadra con el monto');
    }

    // todo bien hasta este punto
    const userId = session.user._id;
    const newOrder = new OrderModel({ ...req.body, isPaid: false, user: userId });
    newOrder.total = round(newOrder.total, 2); // con lodash
    // newOrder.total = Math.round(newOrder.total * 100) / 100; // reduce a 2 decimales
    // console.log('total:', newOrder.total);
    await newOrder.save();
    await db.disconnect();
    res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log('Error en subTotal', error);
    res.status(400).json({
      message: error.message || 'Revise logs del servidor',
    });
  }
};
