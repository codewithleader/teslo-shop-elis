import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';

interface ContextProps {
  cart: ICartProduct[];
  isLoaded: boolean;
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;

  // Methods:
  addProductToCart: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void;
  // Orders:
  createOrder: () => Promise<void>;
}

export const CartContext = createContext({} as ContextProps);
