// css
import '../styles/globals.css';
// ? AQUÍ VAN TODOS LOS PRIVIDERS
// next
import type { AppProps } from 'next/app';
// next-auth
import { SessionProvider } from 'next-auth/react';
// context providers
import { AuthProvider, CartProvider, UiProvider } from '../context';
// Paypal provider
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
//mui
import CssBaseline from '@mui/material/CssBaseline';
// theme
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../themes';
// swr
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
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
      </PayPalScriptProvider>
    </SessionProvider>
  );
}

export default MyApp;
