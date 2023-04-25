import { db } from 'database';
import { OrderModel, ProductModel, UserModel } from 'models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number; // role: 'client'
  numberOfProducts: number;
  productsWithNoInventory: number; // 0 productos disponibles
  lowInventory: number; // productos con 10 o menos
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect();

  // Se comentó esto porque con Promise.all es más rápido la consulta ya que las hace todas en simultaneo
  // const numberOfOrders = await OrderModel.count();
  // const paidOrders = await OrderModel.find({ isPaid: true }).count();
  // const numberOfClients = await UserModel.find({ role: 'client' }).count();
  // const numberOfProducts = await ProductModel.count();
  // const productsWithNoInventory = await ProductModel.find({ inStock: 0 }).count();
  // const lowInventory = await ProductModel.find({ inStock: { $lte: 10 } }).count();

  // Tienen que estar en el mismo orden
  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    OrderModel.count(),
    OrderModel.find({ isPaid: true }).count(),
    UserModel.find({ role: 'client' }).count(),
    ProductModel.count(),
    ProductModel.find({ inStock: 0 }).count(),
    ProductModel.find({ inStock: { $lte: 10 } }).count(),
  ]);

  await db.disconnect();

  res.status(200).json({
    paidOrders,
    lowInventory,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
  });
}
