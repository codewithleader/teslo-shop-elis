import type { NextPage } from 'next';

import { Typography } from '@mui/material';

import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { useProducts } from './hooks';

const HomePage: NextPage = () => {
  const { isError, isLoading, products } = useProducts('/products');

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

      {isLoading ? <h1>Please Wait...</h1> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
