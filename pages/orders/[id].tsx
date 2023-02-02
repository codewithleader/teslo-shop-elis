// NextJS
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
// next-auth
import { getSession } from 'next-auth/react';
// database
import { dbOrders } from '../../database';
// Paypal buttons
import { PayPalButtons } from '@paypal/react-paypal-js';
// mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined';
// Custom Components
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
// Interfaces
import { IOrder } from '../../interfaces';
// api
import { tesloApi } from '../../api';

interface Props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED';
};

export const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();

  const { shippingAddress } = order;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('No hay pago en PayPal');
    }

    try {
      const { data } = await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      console.log('Error desde frontend - orders/[id].tsx:', error);
      alert('Error');
    }
  };

  return (
    <ShopLayout title='Order Summary' pageDescription='Order Summary'>
      <Typography variant='h1' component='h1'>
        Order: {order._id}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label='order has already been paid'
          variant='outlined'
          color='success'
          icon={<CreditScoreOutlinedIcon />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label='Pending payment'
          variant='outlined'
          color='error'
          icon={<CreditCardOffOutlinedIcon />}
        />
      )}

      <Grid container className='fadeIn' sx={{ p: 1 }}>
        <Grid item xs={12} md={7}>
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} md={5}>
          <Card className='summary-card' sx={{ p: 2 }}>
            <CardContent>
              <Typography variant='h2'>
                Review ({order.numberOfItems} {order.numberOfItems > 1 ? 'products' : 'product'})
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent={'space-between'}>
                <Typography variant='subtitle1'>Shipping Address</Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address}{' '}
                {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}
              </Typography>
              <Typography>
                {shippingAddress.city}, {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                orderValues={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  tax: order.tax,
                  total: order.total,
                }}
              />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                {/* todo */}
                <Box display='flex' justifyContent='center' className='fadeIn'>
                  <CircularProgress />
                </Box>
                {order.isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label='order has already been paid'
                    variant='outlined'
                    color='success'
                    icon={<CreditScoreOutlinedIcon />}
                  />
                ) : (
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: `${order.total}`,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order!.capture();
                      onOrderCompleted(details);
                    }}
                  />
                )}
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
