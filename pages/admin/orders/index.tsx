import useSWR from 'swr';
// mui
import Grid from '@mui/material/Grid';
// mui icons
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
// mui/x-data-grid
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  // GridValueGetterParams, // ya no se usa esta sinó "GridRenderCellParams"
} from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
// layouts
import { AdminLayout } from 'components/layouts';
import { IOrder, IUser } from 'interfaces';

/* --------------------------------------------------- */

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre completo', width: 300 },
  { field: 'total', headerName: 'Monto Total', width: 300 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ? (
        <Chip variant='outlined' label='Pagada' color='success' />
      ) : (
        <Chip variant='outlined' label='Pendiente' color='error' />
      );
    },
  },
  { field: 'noProducts', headerName: 'Nro Productos disponibles', align: 'center', width: 150 },
  {
    field: 'check',
    headerName: 'Ver orden',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
          Ver Orden
        </a>
      );
    },
  },
  { field: 'createdAt', headerName: 'Creada en', width: 300 },
];

export const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) {
    return <></>;
  }

  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      //
      title='Ordenes'
      subTitle='Mantenimiento de ordenes'
      icon={<ConfirmationNumberOutlinedIcon />}
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
