# 1 ERROR:

(property) authorize: (credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) => Awaitable<User | null>
Type '(credentials: Record<"email" | "password", string> | undefined) => Promise<{ \_id: string; email: string; role: string; name: string; } | null>' is not assignable to type '(credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) => Awaitable<User | null>'.
Type 'Promise<{ \_id: string; email: string; role: string; name: string; } | null>' is not assignable to type 'Awaitable<User | null>'.
Type 'Promise<{ \_id: string; email: string; role: string; name: string; } | null>' is not assignable to type 'PromiseLike<User | null>'.
Types of property 'then' are incompatible.
Type '<TResult1 = { \_id: string; email: string; role: string; name: string; } | null, TResult2 = never>(onfulfilled?: ((value: { \_id: string; email: string; role: string; name: string; } | null) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<...>) | ... 1 mor...' is not assignable to type '<TResult1 = User | null, TResult2 = never>(onfulfilled?: ((value: User | null) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<...>) | null | undefined) => PromiseLike<...>'.
Types of parameters 'onfulfilled' and 'onfulfilled' are incompatible.
Types of parameters 'value' and 'value' are incompatible.
Type '{ \_id: string; email: string; role: string; name: string; } | null' is not assignable to type 'User | null'.
Property 'id' is missing in type '{ \_id: string; email: string; role: string; name: string; }' but required in type 'User'.ts(2322)
types.d.ts(463, 5): 'id' is declared here.
credentials.d.ts(13, 5): The expected type comes from property 'authorize' which is declared here on type 'UserCredentialsConfig<{ email: { label: string; type: string; placeholder: string; }; password: { label: string; type: string; placeholder: string; }; }>'

```bash
async authorize(credentials) {
        console.log({ credentials });
        // Todo: validar contra database.
        // return { email: 'juan@juan.com', id: '124563' };

        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
```

# 2 y 3 ERROR:

- (property) clientId: string
Type 'string | undefined' is not assignable to type 'string'.
Type 'undefined' is not assignable to type 'string'.ts(2322)
oauth.d.ts(91, 5): The expected type comes from property 'clientId' which is declared here on type 'OAuthUserConfig<any>'

- (property) clientSecret: string
Type 'string | undefined' is not assignable to type 'string'.
Type 'undefined' is not assignable to type 'string'.ts(2322)
oauth.d.ts(92, 5): The expected type comes from property 'clientSecret' which is declared here on type 'OAuthUserConfig<any>'

```bash
GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
```

# 4 ERROR:

Property 'accessToken' does not exist on type 'Session'.ts(2339)

```bash
async session({ session, token, user }){
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
```
