import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

export const CartPage = () => {
  return (
    <ShopLayout title={'Cart - 3'} pageDescription={'Shopping Cart'}>
      <Typography variant='h1' component='h1'>
        Cart
      </Typography>

      <Grid container sx={{ p: 1 }}>
        <Grid item xs={12} md={7}>
          <CartList editable />
        </Grid>

        <Grid item xs={12} md={5}>
          <Card className='summary-card' sx={{ p: 2 }}>
            <CardContent>
              <Typography variant='h2'>
                <b>Order Summary</b>
              </Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
