/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
/* eslint-disable prefer-template */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import numeral from 'numeral';
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');

// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem, Stack } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Avatar from '../../../../components/Avatar';

import { TableMoreMenu } from '../../../../components/table';
import createAvatar from '../../../../utils/createAvatar';
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

UserTableRowAdminReserv.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  handleAddEvent: PropTypes.func,
  handleCloseModal: PropTypes.func,
  handleSubmitToUpdate: PropTypes.func,
  handleChangeEdit: PropTypes.func,
  detailRow: PropTypes.object,
  isOpenModal: PropTypes.bool,
};

export default function UserTableRowAdminReserv({ row, selected, onSelectRow, handleAddEvent }) {
  const theme = useTheme();
  const { avatarUrl, company, role, isVerified, status } = row;

  const [openMenu, setOpenMenuActions] = useState(null);
  const [customer, setCustomer] = useState({});
  const [program, setProgram] = useState('');

  useEffect(() => {
    handleCustomer(row.customer_reference);
    handleGetProgramme(row.real_estate_programe_reference);
  }, []);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleCustomer = async (customerCode) => {
    const response = await axios.get(`/ws-booking-payment/customer/${customerCode}`);
    setCustomer(response.data);
  };

  const handleGetProgramme = async (value) => {
    const response = await axios.get(`/ws-booking-payment/real-estate-program/${value}`);
    const programme = response.data.label + ' ' + response.data.formula;
    setProgram(programme);
  };

  const name = customer?.lastname + ' ' + customer?.firstname;
  console.log('customer', customer);

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    // console.log(Primenumeral);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} color={createAvatar(name).color} sx={{ mr: 2 }}>
          {createAvatar(name).name}
        </Avatar>
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography noWrap variant="body2" sx={{ color: 'text.disabled', cursor: 'pointer' }}>
            {customer?.customer_reference}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{program}</TableCell>
      <TableCell align="left">{sepMillier(row.house_amount)} FCFA</TableCell>
      <TableCell align="left">{sepMillier(row.amount_paid)} FCFA</TableCell>

      <TableCell align="left">{moment(row.payment_schedule_end_date).format('DD MMM YYYY')}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  handleAddEvent();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Modifier
              </MenuItem>
              {/* <MenuItem
                onClick={() => {
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Supprimer
              </MenuItem> */}
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
