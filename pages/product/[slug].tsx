import { NextPage, GetServerSideProps } from 'next';

import { Button, Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ShopLayout } from '../../components/layouts';
import { ItemCounter } from '../../components/ui';
import { IProduct } from '../../interfaces';
import { dbProducts } from '../../database';

interface Props {
  product: IProduct;
}

export const ProductPage: NextPage<Props> = ({ product }) => {
  // Se comentó esto porque no se va a usar asi. Sino con SSR.
  // const router = useRouter();
  // console.log(router);
  // const { products: product, isLoading } = useProducts(`/products/${router.query.slug}`);

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* Title */}
            <Typography variant='h1' component='h1'>
              {product.title}
            </Typography>
            <Typography variant='subtitle1' component='h2'>{`$${product.price}`}</Typography>

            {/* Quantity */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Quantity</Typography>

              <ItemCounter />

              <SizeSelector
                // selectedSize={product.sizes[0]}
                sizes={product.sizes}
              />
            </Box>

            {/* Add to Cart */}
            <Button color='secondary' className='circular-btn'>
              Add to Cart
            </Button>

            {/* <Chip label={'Unavailable'} color='error' variant='outlined' /> */}

            {/* Description */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Description</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false, // False: Permite la posibilidad de volver a buscar el mismo slug.
      }
    }
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductPage;
