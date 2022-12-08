import { useState } from 'react';
import NextLink from 'next/link';

import { useForm } from 'react-hook-form';

// import { Box, Button, Divider, Grid, Link, TextField, Typography } from '@mui/material'; // No usar asi porque es mas lento en dev.

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';

import ErrorOutline from '@mui/icons-material/ErrorOutline';

import { AuthLayout } from '../../components/layouts';
import { tesloApi } from '../../api';
import { validations } from '../../utils';

type FormData = {
  name: string;
  email: string;
  password: string;
};

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onRegisterUser = async ({ name, email, password }: FormData) => {
    setIsButtonDisabled(true);
    setShowError(false);

    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      console.log('data:', { token, user });
      setIsButtonDisabled(false);
    } catch (error) {
      console.log('Error en las credenciales', error);
      setIsButtonDisabled(false);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };
  return (
    <AuthLayout title={'Create Account'}>
      <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Create Account
              </Typography>
              <Chip
                label='Registered User'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Full Name'
                variant='filled'
                fullWidth
                {...register('name', {
                  required: 'This field is required',
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type='email'
                label='Email'
                variant='filled'
                fullWidth
                {...register('email', {
                  required: 'This field is required',
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Password'
                type='password'
                variant='filled'
                fullWidth
                {...register('password', {
                  required: 'This field is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type='submit'
                color='secondary'
                className='circular-btn'
                size='large'
                fullWidth
                disabled={isButtonDisabled}
              >
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
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
