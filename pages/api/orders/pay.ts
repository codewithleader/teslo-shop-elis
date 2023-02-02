import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IPayPal } from '../../../interfaces';
import { OrderModel } from '../../../models';

type Data = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return payOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
  const body = new URLSearchParams('grant_type=client_credentials');

  try {
    const { data } = await axios.post<IPayPal.IPayPaloAuthTokenResponse>(
      process.env.PAYPAL_OAUTH_URL || '',
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log('An error here:', error);
    }
    return null;
  }

  return '';
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  // todo: validar session del usuario
  // todo: validar MongoId

  const payPalBearerToken = await getPayPalBearerToken();
  if (!payPalBearerToken) {
    return res.status(400).json({ message: 'No se pudo confirmar el token de PayPal' });
  }

  const { transactionId = '', orderId = '' } = req.body;

  const { data } = await axios.get<IPayPal.IPayPalOrderStatusResponse>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${payPalBearerToken}`,
      },
    }
  );

  if (data.status !== 'COMPLETED') {
    return res.status(401).json({ message: 'Orden no reconocida' });
  }

  await db.connect();
  const dbOrder = await OrderModel.findById(orderId);

  if (!dbOrder) {
    await db.disconnect();
    return res.status(400).json({ message: 'Orden no existe en nuestra base de datos' });
  }

  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    return res.status(400).json({ message: 'Los montos de PayPal y nuestra orden no son iguales' });
  }

  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true;

  await dbOrder.save();

  db.disconnect();

  return res.status(200).json({ message: 'Orden pagada' });
};
