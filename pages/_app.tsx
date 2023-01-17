// ? AQUÍ VAN TODOS LOS PRIVIDERS
// next
import type { AppProps } from 'next/app';
// next-auth
import { SessionProvider } from 'next-auth/react';
//mui
import CssBaseline from '@mui/material/CssBaseline';
// theme
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../themes';
// css
import '../styles/globals.css';
// swr
import { SWRConfig } from 'swr';
// context providers
import { AuthProvider, CartProvider, UiProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          // refreshInterval: 300, // Hace la petición cada 3 seg y devuelve status(304) si no hay cambios
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
        }}
      >
        <AuthProvider>
          <CartProvider>
            <UiProvider>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <Component {...pageProps} />
              </ThemeProvider>
            </UiProvider>
          </CartProvider>
        </AuthProvider>
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
