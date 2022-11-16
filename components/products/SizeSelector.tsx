// import { Box, Button } from '@mui/material'; // No usar así porque es lento en dev.
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { ISize } from '../../interfaces';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
}

export const SizeSelector: React.FC<Props> = ({ selectedSize, sizes }) => {
  return (
    <Box>
      {sizes.map(size => (
        <Button key={size} size='small' color={selectedSize === size ? 'primary' : 'info'}>
          {size}
        </Button>
      ))}
    </Box>
  );
};
