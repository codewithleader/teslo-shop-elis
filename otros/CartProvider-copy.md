// React
import { useEffect, useReducer, useState } from 'react';
// cookies
import Cookies from 'js-cookie';
// axios
import axios from 'axios';
// utils
import { tesloApi } from '../../api';
// context
import { CartContext, cartReducer } from './';
// Interfaces
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';

export interface CartState {
  cart: ICartProduct[];
  isLoaded: boolean;
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  isLoaded: false,
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children: React.ReactNode;
}

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);
  const [isMounted, setIsMounted] = useState(false);

  // useEffect #1: Add to Cart from Cookies:
  useEffect(() => {
    if (!isMounted) {
      try {
        const cartProductsFromCookies = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [];

        dispatch({
          type: '[CART] - LoadCart from cookies | storage',
          payload: cartProductsFromCookies,
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

  // useEffect #2: Update Cart from Cookies:
  useEffect(() => {
    if (Cookies.get('firstName')) {
      const shippingAddress = {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
      };

      dispatch({ type: '[CART] - LoadAddress From Cookies', payload: shippingAddress });
    }
  }, []);

  // useEffect #3: Add product to Cookies
  useEffect(() => {
    if (isMounted) Cookies.set('cart', JSON.stringify(state.cart));
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

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0); // 0.10 (From Environment Variables)

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1), // Example: 100 * 1.10
      // total: (subTotal * (taxRate + 1)).toFixed(2), // Example: 100 * 1.10
    };

    dispatch({ type: '[CART] - Update Order Summary', payload: orderSummary });
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

  const updateAddress = (address: ShippingAddress) => {
    Cookies.set('firstName', address.firstName);
    Cookies.set('lastName', address.lastName);
    Cookies.set('address', address.address);
    Cookies.set('address2', address.address2 || '');
    Cookies.set('zip', address.zip);
    Cookies.set('city', address.city);
    Cookies.set('country', address.country);
    Cookies.set('phone', address.phone);

    dispatch({ type: '[CART] - Update Address', payload: address });
  };

  /**
   * It creates an order
   * @returns {} { hasError, message } An object with two properties: hasError and message. message puede ser un mensaje de error o, si todo sale bien, es el id de la orden.
   */
  const createOrder = async ():Promise<{hasError: boolean; message: string}> => {
    if (!state.shippingAddress) {
      throw new Error('No hay dirección de Entrega');
    }

    // Preparar la orden
    const body: IOrder = {
      orderItems: state.cart.map(p => ({ ...p, size: p.size! })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);
      // todo: dispatch

      return {
        hasError: false,
        message: data._id!,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        }
      }

      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador',
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        // Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,

        // Orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
