import type { NextPage } from 'next';

import { Typography } from '@mui/material';

import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';

import useSWR from 'swr';
const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())

const HomePage: NextPage = () => {
  const { data, error } = useSWR('/api/products', fetcher);

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>


  return (
    <ShopLayout
      title={'TesloShop Elis | Home'}
      pageDescription={'Find the best Teslo products here'}
    >
      <Typography variant='h1' component='h1'>
        Shop
      </Typography>
      <Typography
        variant='h2'
        sx={{
          mb: 1, // marginBottom
        }}
      >
        All products
      </Typography>

      <ProductList
        products={data}
      />
    </ShopLayout>
  );
};

export default HomePage;
