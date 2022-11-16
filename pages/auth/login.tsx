import NextLink from 'next/link';

// import { Box, Button, Divider, Grid, Link, TextField, Typography } from '@mui/material'; // No usar asi porque es mas lento en dev.
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';


import { AuthLayout } from '../../components/layouts';

export const LoginPage = () => {
  return (
    <AuthLayout title={'Sign In'}>
      <Box sx={{ width: 350, padding: '10px 20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h1' component='h1'>
              Welcome
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField label='Email' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField label='Password' type='password' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12}>
            <Button color='secondary' className='circular-btn' size='large' fullWidth>
              Sign In
            </Button>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='end'>
            <NextLink href='/auth/register' passHref>
              <Link underline='always'>Create Account</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
