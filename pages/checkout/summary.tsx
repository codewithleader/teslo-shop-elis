import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

export const SummaryPage = () => {
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
              <Typography variant='h2'>Review (3 products)</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent={'space-between'}>
                <Typography variant='subtitle1'>Shipping Address</Typography>
                <NextLink href={'/checkout/address'} passHref>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <Typography>Elis Antonio Perez</Typography>
              <Typography>123 Main St</Typography>
              <Typography>Stittsville, HLB 234</Typography>
              <Typography>Israel</Typography>
              <Typography>+1 555 5555</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent={'end'}>
                <NextLink href={'/cart'} passHref>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirm Order
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
