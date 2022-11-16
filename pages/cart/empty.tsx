import NextLink from 'next/link';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';

export const EmptyPage = () => {
  return (
    <ShopLayout title={'Empty Cart'} pageDescription={'There are no items in the cart'}>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <RemoveShoppingCartOutlinedIcon sx={{fontSize: 100}} />
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Typography marginLeft={2}>Your cart is empty</Typography>

          <NextLink href='/' passHref>
            <Link typography={'h6'} color={'secondary'}>Continue Shopping</Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
