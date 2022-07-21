/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
/* eslint-disable prefer-template */
import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem, Stack } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import createAvatar from '../../../../utils/createAvatar';
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  handleAddEvent: PropTypes.func,
  handleViewRow: PropTypes.func,
  handleOpeneModalPassword: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({
  row,
  selected,
  handleViewRow,
  handleAddEvent,
  handleOpeneModalPassword,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const name = row?.lastname + ' ' + row?.firstname;

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'left' }}>
        <Avatar alt={name} color={createAvatar(name).color} sx={{ mr: 2 }}>
          {createAvatar(name).name}
        </Avatar>
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography noWrap variant="body2" sx={{ color: 'text.disabled', cursor: 'pointer' }}>
            {row?.customer_reference}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{row.email}</TableCell>

      <TableCell align="left">{row.phone_number}</TableCell>
      <TableCell align="left">{row.marital_status}</TableCell>

      <TableCell align="left">{moment(row.createdAt).format('DD MMM YYYY')}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  handleViewRow();
                }}
              >
                <Iconify icon={'eva:activity-outline'} />
                Historique d'activitée
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  handleAddEvent();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Modifier
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  handleOpeneModalPassword();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:lock-outline'} />
                Changer le mot de passe
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
