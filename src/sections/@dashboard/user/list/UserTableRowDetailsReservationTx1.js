/* eslint-disable react/self-closing-comp */
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

UserTableRowDetailsReservationTx1.propTypes = {
  detailRow: PropTypes.object,
  program: PropTypes.object,
  customer: PropTypes.object,
};

export default function UserTableRowDetailsReservationTx1({ detailRow, program, customer }) {
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
        <StyledTableCell align="left">Num??ro du dossier</StyledTableCell>
        <StyledTableCell align="left">{detailRow.booking_reference}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Mode de financement</StyledTableCell>
        <StyledTableCell align="left">{detailRow.financing_method}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Prix de vente de mon logement</StyledTableCell>
        <StyledTableCell align="left">
          {sepMillier(detailRow.purchase_amount)} {parseInt(detailRow.purchase_amount) === 0 ? '' : 'FCFA'}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Frais de dossier</StyledTableCell>
        <StyledTableCell align="left">
          {sepMillier(detailRow.application_fees)} {parseInt(detailRow.application_fees) === 0 ? '' : 'FCFA'}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Prix total du logement hors frais de notaire</StyledTableCell>
        <StyledTableCell align="left">
          {sepMillier(detailRow.house_amount)} {parseInt(detailRow.house_amount) === 0 ? '' : 'FCFA'}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Prix du terrain suppl??mentaire</StyledTableCell>
        <StyledTableCell align="left">
          {sepMillier(detailRow.additional_land_amount)}{' '}
          {parseInt(detailRow.additional_land_amount) === 0 ? '' : 'FCFA'}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow hover>
        <StyledTableCell align="left">Prix de la cl??ture suppl??mentaire</StyledTableCell>
        <StyledTableCell align="left">
          {sepMillier(detailRow.additional_fence_amount)}{' '}
          {parseInt(detailRow.additional_fence_amount) === 0 ? '' : 'FCFA'}
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
