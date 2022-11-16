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

export const RegisterPage = () => {
  return (
    <AuthLayout title={'Create Account'}>
      <Box sx={{ width: 350, padding: '10px 20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h1' component='h1'>
              Create Account
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField label='Full Name' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField label='Email' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField label='Password' type='password' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12}>
            <Button color='secondary' className='circular-btn' size='large' fullWidth>
              Register
            </Button>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='end'>
            <NextLink href='/auth/login' passHref>
              <Link underline='always'>Sing In</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
