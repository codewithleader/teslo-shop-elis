import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

import { UiContext } from '../../context';

export const Navbar = () => {
  const router = useRouter(); //asPath, push...

  const { toggleSideMenu } = useContext(UiContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;

    router.push(`/search/${searchTerm}`);
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href={'/'} passHref>
          <Link display='flex' alignItems='center'>
            <Typography variant='h6'>Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}>
          <NextLink href={'/category/men'} passHref>
            <Link>
              <Button color={router.asPath === '/category/men' ? 'primary' : 'info'}>Men</Button>
            </Link>
          </NextLink>
          <NextLink href={'/category/women'} passHref>
            <Link>
              <Button color={router.asPath === '/category/women' ? 'primary' : 'info'}>
                Women
              </Button>
            </Link>
          </NextLink>
          <NextLink href={'/category/kids'} passHref>
            <Link>
              <Button color={router.asPath === '/category/kids' ? 'primary' : 'info'}>Kids</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        {/* Search Icon BIG Screen */}
        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            autoFocus
            className='fadeIn'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={e => (e.key === 'Enter' ? onSearchTerm() : null)}
            type='text'
            placeholder='Search...'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }} className='fadeIn' onClick={() => setIsSearchVisible(true)}>
            <SearchOutlined />
          </IconButton>
        )}

        {/* Search Icon SMALL Screen */}
        <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={() => {toggleSideMenu(); setIsSearchVisible(false);}}>
          <SearchOutlined />
        </IconButton>

        {/* Cart Icon */}
        <NextLink href={'/cart'} passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={2} color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={() => {toggleSideMenu(); setIsSearchVisible(false);}}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
