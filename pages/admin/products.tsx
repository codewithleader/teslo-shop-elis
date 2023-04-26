import useSWR from 'swr';
import NextLink from 'next/link';
// mui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
// mui icons
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
// mui/x-data-grid
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  // GridValueGetterParams, // ya no se usa esta sinó "GridRenderCellParams"
} from '@mui/x-data-grid';
// layouts
import { AdminLayout } from 'components/layouts';
import { IProduct } from 'interfaces';
import { CardMedia } from '@mui/material';

/* --------------------------------------------------- */

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
          <CardMedia
            //
            component={'img'}
            className='fadeIn'
            alt={row.title}
            image={`/products/${row.img}`}
          />
        </a>
      );
    },
  },
  {
    field: 'title',
    headerName: 'Título',
    width: 250,
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <Link component={NextLink} href={`/admin/products/${row.slug}`} underline='always'>
          {row.title}
        </Link>
      );
    },
  },
  { field: 'gender', headerName: 'Género' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 },
];

export const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) {
    return <></>;
  }

  // Lo que se define aquí se puede usar en "renderCell"
  const rows = data!.map(product => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }));

  return (
    <AdminLayout
      //
      title={`Productos (${data?.length})`}
      subTitle='Mantenimiento de productos'
      icon={<CategoryOutlinedIcon />}
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
