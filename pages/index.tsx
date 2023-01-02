// NextJS
import type { NextPage } from 'next';
// mui
import Typography from '@mui/material/Typography';
// components
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
// custom hooks
import { useProducts } from '../hooks';

const HomePage: NextPage = () => {
  const { isLoading, products } = useProducts('/products');

  return (
    <ShopLayout
      title={'TesloShop Elis | Home'}
      pageDescription={'Find the best Teslo products here'}
    >
      <Typography variant='h1' component='h1'>
        Shop
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        All products
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
