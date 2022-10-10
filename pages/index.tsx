import type { NextPage } from 'next';

import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';

import { ShopLayout } from '../components/layouts';
import { initialData } from '../database/products';



const HomePage: NextPage = () => {
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

      <Grid container spacing={4}>
        {
          initialData.products.map(product => (
            <Grid item xs={6} sm={4} key={product.slug}>
              <Card>
                <CardActionArea>
                  <CardMedia
                    component='img'
                    image={`products/${product.images[0]}`}
                    alt={product.title}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))
        }
      </Grid>

    </ShopLayout>
  );
};

export default HomePage;
