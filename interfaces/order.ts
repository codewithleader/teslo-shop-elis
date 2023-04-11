import { IUser, ISize } from './';

export interface IOrder {
  _id?: string;
  user?: IUser | string;
  orderItems: IOrderItem[];
  paymentResult?: string;
  shippingAddress: ShippingAddress;

  tax: number;
  total: number;
  subTotal: number;
  numberOfItems: number;

  isPaid: boolean;
  paidAt?: string;

  transactionId?: string;

  // Al tener la propiedad {timestamps: true} en el userSchema, crea estas variables:
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderItem {
  _id: string;
  size: ISize;
  slug: string;
  image: string;
  price: number;
  title: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  quantity: number;
}

export interface ShippingAddress {
  zip: string;
  city: string;
  phone: string;
  address: string;
  country: string;
  lastName: string;
  address2?: string;
  firstName: string;
}
