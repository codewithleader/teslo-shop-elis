// NextJS
import { GetServerSideProps, NextPage } from 'next';
// database
import { dbOrders } from '../../../database';
// mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined';
// mui icon
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
// Custom Components
import { AdminLayout } from '../../../components/layouts';
import { CartList, OrderSummary } from '../../../components/cart';
// Interfaces
import { IOrder } from '../../../interfaces';

interface Props {
  order: IOrder;
}

export const OrderPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress } = order;

  return (
    <AdminLayout
      title='Order Summary'
      subTitle={`Orden ID: ${order._id}`}
      icon={<ConfirmationNumberOutlinedIcon />}
    >
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
                <Box display='flex' flexDirection='column'>
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2, flex: 1 }}
                      label='order has already been paid'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlinedIcon />}
                    />
                  ) : (
                    <Chip
                      sx={{ my: 2, flex: 1 }}
                      label='Pending payment'
                      variant='outlined'
                      color='error'
                      icon={<CreditCardOffOutlinedIcon />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      notFound: true, // Mantiene el path pero muestra la pagina 404 🤯
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
