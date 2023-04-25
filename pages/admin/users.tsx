import { useEffect, useState } from 'react';
// SWR
import useSWR from 'swr';
// Layouts
import { AdminLayout } from 'components/layouts';
// mui
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// mui/x-data-grid
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  // GridValueGetterParams, // ya no se usa esta sinó "GridRenderCellParams"
} from '@mui/x-data-grid';
// types
import { IUser } from 'interfaces';
import { tesloApi } from 'api';

export const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) {
    return <></>; // todo: mostrar LoadingComponent (spinner)
  }

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previousUsers = users.map(user => ({ ...user }));
    const updatedUsers = users.map(user => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));

    setUsers(updatedUsers);

    try {
      await tesloApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      console.error(error);
      setUsers(previousUsers);
      alert('No se pudo actualizar el rol del usuario');
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            //
            value={row.role}
            label='Rol'
            onChange={e => onRoleUpdated(row.id, e.target.value)}
            sx={{ width: 300 }}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='client'>Client</MenuItem>
            <MenuItem value='super-user'>Super User</MenuItem>
            <MenuItem value='CEO'>CEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout title='Usuarios' subTitle='Mantenimiento de usuarios'>
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
