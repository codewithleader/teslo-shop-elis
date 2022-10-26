import { Box, CircularProgress, Typography } from '@mui/material';

export const FullScreenLoading = () => {
  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
      height='calc(100vh - 200px)'
      justifyContent='center'
    >
      <Typography sx={{ mb: 3 }} variant='h2' fontWeight={200} fontSize={30} >Please Wait...</Typography>
      <CircularProgress thickness={2} />
    </Box>
  );
};
