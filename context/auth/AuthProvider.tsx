// React
import { useEffect, useReducer } from 'react';
// NextJS
// import { useRouter } from 'next/router';
// next-auth
import { useSession, signOut } from 'next-auth/react';
// others
import axios from 'axios';
import Cookies from 'js-cookie';
// context
import { AuthContext, authReducer } from './';
// api
import { tesloApi } from '../../api';
// interfaces
import { IUser } from '../../interfaces';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: '[AUTH] - Login', payload: data?.user as IUser });
    }
  }, [status, data]);

  const checkToken = async () => {
    // Validar si existe token en cookies
    if (!Cookies.get('token')) {
      return;
    }

    // Validar token y signIn.
    try {
      const { data } = await tesloApi.get('/user/validate-token'); // No es necesario mandar las cookies porque las cookies se envían automaticamente al servidor.

      const { token, user } = data;

      // Save to Cookies
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });
    } catch (error) {
      Cookies.remove('token');
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', {
        email,
        password,
      });

      const { token, user } = data;

      // Save to Cookies
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });

      return true;
    } catch (error) {
      return false;
    }
  };

  // Todo: USAR ESTA SI EL PROFE FERNANDO DICE QUE SI (Nota: Isaías dijo que no, pero ya estoy entendiendo. Estos hooks lo que hacen es que mantienen las funciones guardadas en la caché y si saturamos la caché (agotamos la memoria caché) entonces nuestra app sería mas lenta)
  // const loginUser = useCallback(async (email: string, password: string): Promise<boolean> => {
  //   try {
  //     const { data } = await tesloApi.post('/user/login', {
  //       email,
  //       password,
  //     });

  //     const { token, user } = data;

  //     // Save to Cookies
  //     Cookies.set('token', token);
  //     dispatch({ type: '[AUTH] - Login', payload: user });

  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }, []);

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data;

      // Save to Cookies
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });

      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }

      return {
        hasError: true,
        message: 'Failed to create user - try again',
      };
    }
  };

  const logout = () => {
    Cookies.remove('cart');
    // remove address data
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');

    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // Methods
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
