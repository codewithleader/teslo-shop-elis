// React
import { useContext, useEffect, useState } from 'react';
// NextJS
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// cookies
import Cookies from 'js-cookie';
// context
import { CartContext } from '../../context';
// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// Custom Components
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { Chip } from '@mui/material';
// utils
// import { countries } from '../../utils';

export const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/address');
    }
  }, [router]);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();

    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    // Si todo sale bien redireccionar
    router.replace(`/orders/${message}`);
  };

  if (!shippingAddress) {
    return <></>;
  }

  const { address, address2, city, country, firstName, lastName, phone, zip } = shippingAddress;

  return (
    <ShopLayout title={'Order Summary'} pageDescription={'Order Summary'}>
      <Typography variant='h1' component='h1'>
        Order Summary
      </Typography>

      <Grid container sx={{ p: 1 }}>
        <Grid item xs={12} md={7}>
          <CartList />
        </Grid>

        <Grid item xs={12} md={5}>
          <Card className='summary-card' sx={{ p: 2 }}>
            <CardContent>
              <Typography variant='h2'>
                Review ({numberOfItems} {numberOfItems > 1 ? 'products' : 'product'})
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent={'space-between'}>
                <Typography variant='subtitle1'>Shipping Address</Typography>
                <NextLink href={'/checkout/address'} passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ''}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              {/* <Typography>{countries.find(c => c.code === country)?.name}</Typography> */}
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent={'end'}>
                <NextLink href={'/cart'} passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button
                  color='secondary'
                  className='circular-btn'
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirm Order
                </Button>
                <Chip
                  // Mostrar Error si existe
                  color='error'
                  label={errorMessage}
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
