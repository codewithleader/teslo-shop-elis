import { ICartProduct } from '../../interfaces';
import { CartState } from './';

type CartActionType =
  | { type: '[CART] - LoadCart from cookies | storage'; payload: ICartProduct[] }
  | { type: '[CART] - Updated products in cart'; payload: ICartProduct[] }
  | { type: '[CART] - Change cart quantity'; payload: ICartProduct }
  | { type: '[CART] - Remove product in cart'; payload: ICartProduct };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case '[CART] - LoadCart from cookies | storage':
      return {
        ...state,
        cart: [...action.payload],
      };

    case '[CART] - Updated products in cart':
      return {
        ...state,
        cart: [...action.payload],
      };

    case '[CART] - Change cart quantity':
      return {
        ...state,
        cart: state.cart.map(product => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          // product.quantity = action.payload.quantity;
          // return product;
          return action.payload; // Producto con la cantidad actualizada.
        }),
      };

    case '[CART] - Remove product in cart':
      return {
        ...state,
        // Option #1:
        cart: state.cart.filter(
          product => !(product._id === action.payload._id && product.size === action.payload.size) // true or false: Si es true mantiene el producto, si es false lo elimina del array.
        ),

        // Option #2:
        // cart: state.cart.filter(product => {
        //   if (product._id === action.payload._id && product.size === action.payload.size) {
        //     return false;
        //   }
        //   return true;
        // }),

        // Option #3:
        // cart: state.cart.filter(product => {
        //   if (product._id === action.payload._id) {
        //     if (product.size === action.payload.size) {
        //       return false;
        //     }
        //   }
        //   return true;
        // }),
      };

    default:
      return state;
  }
};
