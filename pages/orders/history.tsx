// NextJS
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
// next-auth
import { getSession } from 'next-auth/react';
// mui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// mui/x-data-grid
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  // GridValueGetterParams,
} from '@mui/x-data-grid';
// instefaces
import { IOrder } from '../../interfaces';
// database
import { dbOrders } from '../../database';
// Custom Components
import { ShopLayout } from '../../components/layouts';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Full Name', width: 300 },
  {
    field: 'paid',
    headerName: 'Paid',
    description: 'Shows information if the order is paid or not',
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid ? (
        <Chip color='success' label='Paid' variant='outlined' />
      ) : (
        <Chip color='error' label='Not paid' variant='outlined' />
      );
    },
  },
  {
    field: 'order',
    headerName: 'Show order',
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
          <Link underline='always'>Show order</Link>
        </NextLink>
      );
    },
  },
];

// _mock
// const row = [
//   { id: 1, paid: true, fullname: 'Elis Antonio Perez' },
//   { id: 2, paid: false, fullname: 'Yamilexy Torres' },
//   { id: 3, paid: true, fullname: 'Darianny Sharisff Perez' },
//   { id: 4, paid: false, fullname: 'Efrain Santiago Perez' },
// ];

interface Props {
  orders: IOrder[];
}

export const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id,
  }));

  return (
    <ShopLayout title={'Orders History'} pageDescription={'Client’s Orders history'}>
      <Typography variant='h1' component='h1'>
        Orders History
      </Typography>

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?page=/orders/history',
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
