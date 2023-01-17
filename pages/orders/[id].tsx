// NextJS
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
// next-auth
import { getSession } from 'next-auth/react';
// database
import { dbOrders } from '../../database';
// mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined'; // todo si se usará cuando muestre que la orden no ha sido pagada.
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
// Custom Components
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { IOrder } from '../../interfaces';

interface Props {
  order: IOrder;
}

export const OrderPage: NextPage<Props> = ({ order }) => {
  console.log({ order });

  return (
    <ShopLayout title={'Order Summary ABC123123123'} pageDescription={'Order Summary'}>
      <Typography variant='h1' component='h1'>
        Order: ABC123123123
      </Typography>

      {/* <Chip
        sx={{ my: 2 }}
        label='Pending payment'
        variant='outlined'
        color='error'
        icon={<CreditCardOffOutlinedIcon />}
      /> */}

      <Chip
        sx={{ my: 2 }}
        label='order has already been paid'
        variant='outlined'
        color='success'
        icon={<CreditScoreOutlinedIcon />}
      />

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
                <NextLink href={'/checkout/address'} passHref legacyBehavior>
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
                <NextLink href={'/cart'} passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                {/* TODO: */}
                <h1>Pay</h1>

                <Chip
                  sx={{ my: 2 }}
                  label='order has already been paid'
                  variant='outlined'
                  color='success'
                  icon={<CreditScoreOutlinedIcon />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  // Si el usuario quiere ver la orden de otro usuario se redirecciona
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
