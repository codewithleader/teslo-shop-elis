import { useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
};

interface Props {
  children: React.ReactNode;
}

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  const addProductToCart = (product: ICartProduct) => {
    // ! Nivel 1: No funciona porque guarda cada producto aparte y no acumula la cantidad en el mismo producto (repeticion del mismo producto)

    // dispatch({ type: '[CART] - Add Product | storage', payload: product });

    // ! Nivel 2: Tampoco funcionaría

    // const productInCart = state.cart.filter(p => p._id !== product._id && p.size !== product.size);
    // dispatch({ type: '[CART] - Add Product | storage', payload: [...productInCart, product] });

    // ? Nivel final: Si funciona
    const productInCart = state.cart.some(p => p._id === product._id);
    if (!productInCart) {
      return dispatch({
        type: '[CART] - Updated products in cart | storage',
        payload: [...state.cart, product],
      });
    }

    const productInCartButDifferentSize = state.cart.some(
      p => p._id === product._id && p.size === product.size
    );
    if (!productInCartButDifferentSize) {
      return dispatch({
        type: '[CART] - Updated products in cart | storage',
        payload: [...state.cart, product],
      });
    }

    // Acumular
    const updatedProducts = state.cart.map(p => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      // Actualizar la cantidad:
      p.quantity += product.quantity;
      return p;
    });

    dispatch({
      type: '[CART] - Updated products in cart | storage',
      payload: updatedProducts,
    });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        // Methods
        addProductToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
