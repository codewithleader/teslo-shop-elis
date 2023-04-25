import { NextPage } from 'next';
import { AdminLayout } from 'components/layouts';
// mui
import Grid from '@mui/material/Grid';
// material/icons
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';
import CancelPresentationOutlined from '@mui/icons-material/CancelPresentationOutlined';
import ProductionQuantityLimitsOutlined from '@mui/icons-material/ProductionQuantityLimitsOutlined';
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
        <SummaryTile
          title={'numberOfOrders'}
          subTitle='Ordenes totales'
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={'paidOrders'}
          subTitle='Ordenes pagadas'
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={'notPaidOrders'}
          subTitle='Ordenes pendientes'
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={'numberOfClients'}
          subTitle='Clientes'
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={'numberOfProducts'}
          subTitle='Productos'
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={'productsWithNoInventory'}
          subTitle='Sin existencias'
          icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={'lowInventory'}
          subTitle='Bajo inventario'
          icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={'refreshIn'}
          subTitle='Actualización en:'
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
