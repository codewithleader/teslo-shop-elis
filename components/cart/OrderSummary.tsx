// react
import { useContext } from 'react';
// mui/materials
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// mui/icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// context
import { CartContext } from '../../context';
// utils
import { currency } from '../../utils';

interface Props {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  };
}

export const OrderSummary: React.FC<Props> = ({ orderValues }) => {
  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

  const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, tax, total };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Product N.</Typography>
        {/* Shipping */}
        {/* Sales Tax (with ℹ information icon) */}
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>
          {summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'items' : 'item'}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{currency.format(summaryValues.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          Sales Tax ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
          <IconButton>
            <InfoOutlinedIcon />
          </IconButton>
        </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{currency.format(summaryValues.tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>{currency.format(summaryValues.total)}</Typography>
      </Grid>
    </Grid>
  );
};
