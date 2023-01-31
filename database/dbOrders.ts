import { isValidObjectId } from 'mongoose';
import { db } from './';
import { IOrder } from '../interfaces';
import { OrderModel } from '../models';

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) {
    return null;
  }

  await db.connect();
  const order = await OrderModel.findById(id).lean();
  await db.disconnect();

  if (!order) {
    return null;
  }

  // JSON.parse(JSON.stringify(order)):
  // Es para serializar de
  // "_id: ObjectId(63c5ccfc0ba45ba7f924647a)"
  // a
  // "_id: 63c5ccfc0ba45ba7f924647a"
  // y otros mas que hay que serializar (la fecha, id de user entre otros...)
  return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  if (!isValidObjectId(userId)) {
    return [];
  }

  await db.connect();
  const orders = await OrderModel.find({user: userId}).lean();
  await db.disconnect();

  return JSON.parse(JSON.stringify(orders));
};
