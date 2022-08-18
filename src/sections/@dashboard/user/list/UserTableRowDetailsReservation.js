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

UserTableRowDetailsReservation.propTypes = {
  detailRow: PropTypes.object,
  program: PropTypes.object,
  customer: PropTypes.object,
};

export default function UserTableRowDetailsReservation({ detailRow, program, customer }) {
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
      <StyledTableRow hover>
        <StyledTableCell align="left">Nom du programme</StyledTableCell>
        <StyledTableCell align="left">{program.label}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Formule</StyledTableCell>
        <StyledTableCell align="left">{program.formula}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Localisation</StyledTableCell>
        <StyledTableCell align="left">{program.location}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Type d'habitation</StyledTableCell>
        <StyledTableCell align="left">{program.real_estate_program_type}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Lot</StyledTableCell>
        <StyledTableCell align="left">{detailRow.lot > 0 ? detailRow.lot : 0}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">ILot</StyledTableCell>
        <StyledTableCell align="left">{detailRow.sub_lot > 0 ? detailRow.sub_lot : 0}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Superficie du lot</StyledTableCell>
        <StyledTableCell align="left">{detailRow.area > 0 ? detailRow.area : 0} m&sup2;</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Statut</StyledTableCell>
        <StyledTableCell align="left">
          {parseInt(detailRow.balance_due) === 0 ? (
            <Label variant={'ghost'} color={'success'}>
              Acquis
            </Label>
          ) : (
            <Label variant={'ghost'} color={'error'}>
              En cours d'aquisition
            </Label>
          )}
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
