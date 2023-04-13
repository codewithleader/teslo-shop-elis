import { NextPage } from 'next';
import { AdminLayout } from 'components/layouts';
// mui
import Grid from '@mui/material/Grid';
// material/icons
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';
// components
import { SummaryTile } from 'components/admin';

export const DashboardPage: NextPage = () => {
  return (
    <AdminLayout
      //
      title='Dashboard'
      subTitle='Estadisticas generales'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        {[...Array(4)].map((_, index) => (
          <SummaryTile
            key={index}
            title={`0${index + 1}`}
            subTitle={'Ordenes Totales'}
            icon={<CreditCardOffOutlined color='secondary' />}
          />
        ))}
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
