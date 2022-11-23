import { useEffect, useReducer, useState } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';

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
  const [isMounted, setIsMounted] = useState(false);

  // useEffect #2: Add to Cart from Cookie:
  useEffect(() => {
    if (!isMounted) {
      try {
        const cartProductsFromCookie = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];

        dispatch({
          type: '[CART] - LoadCart from cookies | storage',
          payload: cartProductsFromCookie,
        });
        setIsMounted(true);
      } catch (error) {
        // Si existe algun problema al parsear las cookies se envia al state un array vacio:
        dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: [] });
        setIsMounted(true);
      }
    }
  }, [isMounted]);

  // console.log('State useEffect1:', state); //? Array vacio al recargar 🤒 SOLUCION: desactivar reactStrictMode en el file next.config.js o implementar un useState isMounted

  // useEffect #2: Add product to Cookies
  useEffect(() => {
    if (isMounted) Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart, isMounted]);

  // useEffect #3: Product info to Order page
  useEffect(() => {
    // Option #1: Más simplificada
    const numberOfItems = state.cart.reduce(
      (previousValue, currentValue) => currentValue.quantity + previousValue,
      0
    );

    // Option #2: Más visual
    // const numberOfItems = state.cart.reduce((previousValue, product) => {
    //   // El segundo argumento "0" es el valor inicial de "previousValue"
    //   const accumulator = product.quantity + previousValue;
    //   return accumulator;
    // }, 0);

    // Option #1: Más simplificada
    const subTotal = state.cart.reduce(
      (prev, current) => current.quantity * current.price + prev,
      0
    );

    // Option #2: Más visual
    // const subTotal = state.cart.reduce((previousValue, product) => {
    //   const currentValue = product.quantity * product.price;
    //   return previousValue + currentValue;
    // }, 0)

    const taxRate = 0.10;

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
    };

    console.log({ orderSummary });
  }, [state.cart, isMounted]);

  const addProductToCart = (product: ICartProduct) => {
    //* Nivel 1: No funciona porque guarda cada producto aparte y no acumula la cantidad en el mismo producto (repeticion del mismo producto)

    // dispatch({ type: '[CART] - Updated products in cart', payload: product });

    //* Nivel 2: Tampoco funcionaría

    // const productInCart = state.cart.filter(p => p._id !== product._id && p.size !== product.size);
    // dispatch({ type: '[CART] - Updated products in cart', payload: [...productInCart, product] });

    // ? Nivel final: Si funciona
    const productInCart = state.cart.some(p => p._id === product._id);
    if (!productInCart) {
      return dispatch({
        type: '[CART] - Updated products in cart',
        payload: [...state.cart, product],
      });
    }

    const productInCartButDifferentSize = state.cart.some(
      p => p._id === product._id && p.size === product.size
    );
    if (!productInCartButDifferentSize) {
      return dispatch({
        type: '[CART] - Updated products in cart',
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
      type: '[CART] - Updated products in cart',
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[CART] - Change cart quantity', payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[CART] - Remove product in cart', payload: product });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        // Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
