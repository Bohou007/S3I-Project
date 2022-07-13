/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-template */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import numeral from 'numeral';
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

InvoiceTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  handleAddEvent: PropTypes.func,
  selected: PropTypes.bool,
  hide: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function InvoiceTableRow({
  row,
  selected,
  hide,
  handleAddEvent,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const theme = useTheme();

  const { sent, invoiceNumber, createDate, dueDate, status, invoiceTo, totalPrice } = row;

  const [openMenu, setOpenMenuActions] = useState(null);
  const [customer, setCustomer] = useState({});
  const [program, setProgram] = useState('');

  useEffect(() => {
    handleCustomer(row.customer_reference);
    handleGetProgramme(row.real_estate_program_reference);
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

      <TableCell align="left">{sepMillier(row.amount)}</TableCell>

      <TableCell align="left">{row.payment_method}</TableCell>

      <TableCell align="left">{row.bank}</TableCell>

      <TableCell align="left">{moment(row.payment_date).format('DD MMM YYYY')}</TableCell>
      {!hide ? (
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                {/* <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  handleAddEvent();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Modifier

              </MenuItem> */}
                <MenuItem
                  onClick={() => {
                    onViewRow();
                    // handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:corner-down-right-outline'} />
                  Votre facture
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
      ) : (
        ''
      )}
    </TableRow>
  );
}
