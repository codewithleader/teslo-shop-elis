import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { IUser } from '../interfaces';

import { JWTResponse } from './jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string;
    user: IUser;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    _id: string;
    email: string;
    role: string;
    name: string;
    password?: string;

    createdAt?: string;
    updatedAt?: string;
  }
  interface Session {
    user: IUser;
    accessToken: string;
  }
}
