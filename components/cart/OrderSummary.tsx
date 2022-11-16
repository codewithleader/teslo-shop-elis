// import { Grid, IconButton, Typography } from '@mui/material'; // No usar asi porque es lento en dev.
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const OrderSummary = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Product N.</Typography>
        {/* Shipping */}
        {/* Sales Tax (with ℹ information icon) */}
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>3 items</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{`$${155.32}`}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Sales Tax
          <IconButton>
            <InfoOutlinedIcon />
          </IconButton>
        </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{`$${35.34}`}</Typography>
      </Grid>

      <Grid item xs={6} sx={{mt: 2}}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end' sx={{mt: 2}}>
        <Typography variant='subtitle1'>{`$${185.34}`}</Typography>
      </Grid>
    </Grid>
  );
};
