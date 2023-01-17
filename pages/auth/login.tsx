// React
import { useEffect, useState } from 'react';
// NextJS
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// next-auth
import { getProviders, getSession, signIn } from 'next-auth/react';
// Form
import { useForm } from 'react-hook-form';
// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import Divider from '@mui/material/Divider';
// components
import { AuthLayout } from '../../components/layouts';
// utils
import { validations } from '../../utils';

type FormData = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  // console.log('errores:', { errors });

  const [showError, setShowError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then(providers => {
      // console.log({ providers }); // objeto con los providers credentials and github.
      setProviders(providers);
    });
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    setIsButtonDisabled(true);
    setShowError(false);

    // Login mediante NextAuth
    await signIn('credentials', { email, password });
  };

  return (
    <AuthLayout title={'Sign In'}>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Welcome
              </Typography>
              <Chip
                label='Invalid email / password'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
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
                Sign In
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink
                href={
                  router.query.page ? `/auth/register?page=${router.query.page}` : '/auth/register'
                }
                passHref
                legacyBehavior
              >
                <Link underline='always'>Create Account</Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials') {
                  return (<div key='credentials'></div>)
                }
                return (
                  <Button
                    key={provider.id}
                    variant='outlined'
                    fullWidth
                    color='primary'
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// ?: Esto verifica si ya hay una session activa. Si la hay redirecciona. Si no hay entonces si permite el ingreso a la pagina de login
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const { page = '/' } = query;

  if (session) {
    return {
      redirect: {
        destination: page.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
