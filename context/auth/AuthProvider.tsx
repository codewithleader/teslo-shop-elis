import { useReducer } from 'react';
import Cookies from 'js-cookie';

import { AuthContext, authReducer } from './';
import { tesloApi } from '../../api';
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

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', {
        email,
        password,
      });

      const {token, user} = data;

      // Save to Cookies
      Cookies.set('token', token)
      dispatch({type: '[AUTH] - Login', payload: user})

      return true;
    } catch (error) {
      console.log('An error here', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // Methods
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
