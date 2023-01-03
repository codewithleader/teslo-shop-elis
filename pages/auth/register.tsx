// React
import { useContext, useState } from 'react';
// NextJS
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// next-auth
import { getSession, signIn } from 'next-auth/react';
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
// components
import { AuthLayout } from '../../components/layouts';
// utils
import { validations } from '../../utils';
// context
import { AuthContext } from '../../context';

type FormData = {
  name: string;
  email: string;
  password: string;
};

export const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onRegisterUser = async ({ name, email, password }: FormData) => {
    setIsButtonDisabled(true);
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setErrorMessage(message!); // el signo de admiración "!" es para decirle a typescript que si hay un mensaje.
      setIsButtonDisabled(false);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);

      return;
    }

    // Navegar a...
    // const destination = router.query.page?.toString() || '/';
    // router.replace(destination); // Con "replace" reemplaza la pagina de login para impedir que el usuario regrese a ella con el boton "atrás" del navegador.

    await signIn('credentials', { email, password });
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
              <NextLink
                href={router.query.page ? `/auth/login?page=${router.query.page}` : '/auth/login'}
                passHref
              >
                <Link underline='always'>Sing In</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// ?: Esto verifica si ya hay una session activa. Si la hay redirecciona. Si no hay entonces si permite el ingreso a la pagina de register
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

export default RegisterPage;
