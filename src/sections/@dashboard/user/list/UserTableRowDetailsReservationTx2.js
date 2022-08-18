/* eslint-disable no-unneeded-ternary */
/* eslint-disable radix */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
/* eslint-disable prefer-template */
import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');
import numeral from 'numeral';

// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Checkbox, Typography, MenuItem, Stack, tableCellClasses, TableCell, TableRow } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import createAvatar from '../../../../utils/createAvatar';
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

UserTableRowDetailsReservationTx2.propTypes = {
  detailRow: PropTypes.object,
  program: PropTypes.object,
  customer: PropTypes.object,
};

export default function UserTableRowDetailsReservationTx2({ detailRow, program, customer }) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const name = detailRow?.lastname + ' ' + detailRow?.firstname;
  const isSolde = detailRow.booking_fees_due > 0 ? true : false;
  return (
    <>
      {!isSolde ? (
        <>
          <StyledTableRow hover>
            <StyledTableCell align="left">Date de début de l'échéancier de paiement</StyledTableCell>
            <StyledTableCell align="left">
              {moment(detailRow.payment_schedule_start_date).format('DD MMM YYYY')}{' '}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow hover>
            <StyledTableCell align="left">Date de fin de paiement du logement</StyledTableCell>
            <StyledTableCell align="left">
              {moment(detailRow.payment_schedule_end_date).format('DD MMM YYYY')}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow hover>
            <StyledTableCell align="left">Nombre d'échéance de paiement</StyledTableCell>
            <StyledTableCell align="left">{detailRow.payment_deadlines_number}</StyledTableCell>
          </StyledTableRow>
        </>
      ) : (
        ''
      )}
    </>
  );
}
