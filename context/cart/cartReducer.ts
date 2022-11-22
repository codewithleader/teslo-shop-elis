import { ICartProduct } from '../../interfaces';
import { CartState } from './';

type CartActionType =
  | { type: '[CART] - LoadCart from cookies | storage'; payload: ICartProduct[] }
  | { type: '[CART] - Updated products in cart | storage'; payload: ICartProduct[] };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case '[CART] - LoadCart from cookies | storage':
      return {
        ...state,
        // property: value,
      };

    case '[CART] - Updated products in cart | storage':
      return {
        ...state,
        cart: [...action.payload],
      };

    default:
      return state;
  }
};
