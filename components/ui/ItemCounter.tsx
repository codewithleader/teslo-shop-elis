// import { Box, IconButton, Typography } from '@mui/material'; // No usar asi porque es mas lento en dev.
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

interface Props {}

export const ItemCounter: React.FC<Props> = () => {
  return (
    <Box display={'flex'} alignItems={'center'}>
      <IconButton>
        <RemoveCircleOutlineOutlinedIcon />
      </IconButton>

      <Typography sx={{ width: 40, textAlign: 'center' }}>1</Typography>

      <IconButton>
        <AddCircleOutlineOutlinedIcon />
      </IconButton>
    </Box>
  );
};
