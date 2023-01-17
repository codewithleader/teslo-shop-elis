// react
import { useContext } from 'react';
// next
import NextLink from 'next/link';
// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
// context
import { CartContext } from '../../context';
// interfaces
import { ICartProduct, IOrderItem } from '../../interfaces';
// custom components
import { ItemCounter } from '../ui';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: React.FC<Props> = ({ editable = false, products }) => {
  // Get products from State
  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

  const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  };

  const productsToShow = products ? products : cart;

  return (
    <>
      {productsToShow.map(product => (
        <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
          <Grid item xs={3}>
            {/* TODO: Llevar a la pagina del producto */}
            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
              <Link>
                <CardActionArea>
                  <CardMedia
                    // props
                    image={`/products/${product.image}`}
                    component='img'
                    sx={{ borderRadius: '5px' }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display={'flex'} flexDirection='column'>
              <Typography variant='body1'>{product.title}</Typography>
              <Typography variant='body1'>
                Size: <strong>{product.size}</strong>
              </Typography>

              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={10}
                  updatedQuantity={value => onNewCartQuantityValue(product as ICartProduct, value)}
                />
              ) : (
                <Typography variant='h5'>
                  {product.quantity} {product.quantity > 1 ? 'products' : 'product'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={2} display='flex' flexDirection='column' alignItems='center'>
            <Typography variant='subtitle1'>{`$${product.price}`}</Typography>

            {editable && (
              <Button
                variant='text'
                color='secondary'
                onClick={() => removeCartProduct(product as ICartProduct)}
              >
                Remove
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
