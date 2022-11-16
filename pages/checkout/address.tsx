// import {
//   Box,
//   Button,
//   FormControl,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from '@mui/material'; // No usar asi porque es mas lento en dev.

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ShopLayout } from '../../components/layouts';

export const AddressPage = () => {
  return (
    <ShopLayout title={'Shipping'} pageDescription={'Confirm destination address'}>
      <Typography variant='h1' component='h1'>
        Address
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField label='First Name' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField label='Last Name' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField label='Address' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField label='Addres 2 (optional)' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField label='Zip Code' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField label='City' variant='filled' fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Select variant='filled' label='Country' value={1}>
              <MenuItem value={1}>Israel</MenuItem>
              <MenuItem value={2}>Venezuela</MenuItem>
              <MenuItem value={3}>Colombia</MenuItem>
              <MenuItem value={4}>United States</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField label='Phone Number' variant='filled' fullWidth />
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
        <Button color='secondary' className='circular-btn' size='large'>
          Review Order
        </Button>
      </Box>
    </ShopLayout>
  );
};

export default AddressPage;
