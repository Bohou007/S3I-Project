/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable radix */
/* eslint-disable import/first */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
// eslint-disable-next-line import/newline-after-import
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  Card,
  DialogTitle,
  DialogActions,
  Stack,
  CardContent,
  CardActions,
  Grid,
  Alert,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  tableCellClasses,
} from '@mui/material';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableSelectedActions } from '../../components/table';
import {
  UserTableRowDetailsReservation,
  UserTableRowDetailsReservationTx1,
  UserTableRowDetailsReservationTx2,
} from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#a04428',
    color: '#ffffff',
    boxShadow: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

IndexBooking1.propTypes = {
  program: PropTypes.object,
  detailRow: PropTypes.object,
  customer: PropTypes.bool,
};
const TABLE_HEAD = [
  { id: 'programmeImobillier', label: 'Libellé', align: 'left' },
  { id: 'valeur', label: 'Valeur', align: 'left' },
];

export default function IndexBooking1({ program, detailRow, customer }) {
  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  const isSolde = detailRow.booking_fees_due > 0 ? true : false;
  return (
    <Stack spacing={3}>
      {customer && isSolde ? (
        <Alert severity="error" sx={{ p: 2, fontWeight: 'bold' }}>
          Merci de solder les frais de réservations, passer un délai de 3 mois à compter de votre date de réservation,
          votre logement sera réattribué à une autre personne.
        </Alert>
      ) : (
        ''
      )}

      <Card>
        <Scrollbar sx={{ p: 4 }}>
          <TableContainer sx={{ minWidth: 275 }}>
            <Table
              sx={{
                width: '100%',
              }}
              size={'medium'}
            >
              {/* <TableHeadCustom headLabel={TABLE_HEAD} sx={{ width: '100%' }} /> */}

              <TableHead>
                <TableRow>
                  <StyledTableCell>Libellé</StyledTableCell>
                  <StyledTableCell>Valeur</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <UserTableRowDetailsReservation detailRow={detailRow} program={program} customer={customer} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
      <Card>
        <Scrollbar sx={{ mt: 3, p: 4 }}>
          <Typography variant="h4" component="div" sx={{ mb: 3 }}>
            {' '}
            Détails de mon logement
          </Typography>
          <TableContainer sx={{ minWidth: 275 }}>
            <Table
              sx={{
                width: '100%',
              }}
              size={'medium'}
            >
              {/* <TableHeadCustom headLabel={TABLE_HEAD} sx={{ width: '100%' }} /> */}

              <TableHead>
                <TableRow>
                  <StyledTableCell>Libellé</StyledTableCell>
                  <StyledTableCell>Valeur</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <UserTableRowDetailsReservationTx1 detailRow={detailRow} program={program} customer={customer} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
      {!isSolde ? (
        <Card>
          <Scrollbar sx={{ mt: 3, p: 4 }}>
            <Typography variant="h4" component="div" sx={{ mb: 3 }}>
              Détails de l'échéance
            </Typography>
            <TableContainer sx={{ minWidth: 275 }}>
              <Table
                sx={{
                  width: '100%',
                }}
                size={'medium'}
              >
                {/* <TableHeadCustom headLabel={TABLE_HEAD} sx={{ width: '100%' }} /> */}

                <TableHead>
                  <TableRow>
                    <StyledTableCell>Libellé</StyledTableCell>
                    <StyledTableCell>Valeur</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <UserTableRowDetailsReservationTx2 detailRow={detailRow} program={program} customer={customer} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      ) : (
        ''
      )}
    </Stack>
  );
}
