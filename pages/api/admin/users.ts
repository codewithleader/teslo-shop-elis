import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';
import { UserModel } from 'models';
import { IUser } from 'interfaces';
import { db } from 'database';

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res);

    case 'PUT':
      return updateUser(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const users = await UserModel.find().select('-password').lean();

  await db.disconnect();

  return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = '' } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: `No existe usuario con ID: ${userId}` });
  }

  const validRoles = ['client', 'admin', 'super-user', 'CEO'];
  if (!validRoles.includes(role)) {
    return res
      .status(400)
      .json({ message: `Rol no permitido. Los roles permitidos son: ${validRoles.join(', ')}` });
  }

  await db.connect();
  const user = await UserModel.findById(userId);

  if (!user) {
    await db.disconnect();
    return res.status(404).json({ message: `No existe usuario con ID: ${userId}` });
  }

  user.role = role;

  await user.save();
  await db.disconnect();

  return res.status(200).json({ message: 'Usuario actualizado' });
};
