import NextAuth, { User } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';
import { IUser } from '../../../interfaces';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    // El orden en que aparecen en la pagina /api/auth/signin será este order:
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email:', type: 'email', placeholder: 'You email' },
        password: { label: 'Password:', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {
        // console.log('credentials:', { credentials });
        // return { email: 'juan@juan.com', id: '124563' };

        return (await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        )) as User;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    // ...add more providers here
  ],
  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  // Callbacks
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, //! deprecated
  },
  session: {
    maxAge: 2592000, // 30días
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log('token:', { token });
      // console.log('account:', { account });
      // console.log('user:', { user });
      if (account) {
        token.accessToken = account.access_token || '';
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            break;

          case 'credentials':
            token.user = user!;
            break;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // console.log('session:', { session });
      // console.log('token:', { token });
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.user = token.user as IUser;

      // console.log('session: After', { session });
      return session;
    },
  },
};

export default NextAuth(authOptions);
