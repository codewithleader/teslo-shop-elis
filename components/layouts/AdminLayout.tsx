import { SideMenu } from '../ui';
import { AdminNavbar } from 'components/admin';
// mui/material
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  title: string;
  subTitle: string;
  icon?: JSX.Element;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({ children, title, subTitle, icon }) => {
  return (
    <>
      <nav>
        <AdminNavbar />
      </nav>

      <SideMenu />

      <main
        style={{
          margin: '80px auto',
          maxWidth: '1440px',
          padding: '0 30px',
        }}
      >
        <Box display='flex' flexDirection='column'>
          <Typography variant='h1' component='h1'>
            {icon}
            {title}
          </Typography>
          <Typography variant='h2' sx={{ mb: 1 }}>
            {subTitle}
          </Typography>
        </Box>

        <Box className='fadeIn'>{children}</Box>
      </main>
    </>
  );
};
