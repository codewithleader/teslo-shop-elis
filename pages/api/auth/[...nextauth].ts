import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';

export default NextAuth({
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
        console.log({ credentials });
        // Todo: validar contra database.
        // return { email: 'juan@juan.com', id: '124563' };

        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            break;

          case 'credentials':
            token.user = user;
            break;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
});
