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
  TableHead,
  TableBody,
  tableCellClasses,
} from '@mui/material';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Label from '../../components/Label';
import { UserTableRowDetailsReservationTx1 } from '../../sections/@dashboard/user/list';
import Scrollbar from '../../components/Scrollbar';

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
// ----------------------------------------------------------------------

IndexBooking.propTypes = {
  program: PropTypes.object,
  detailRow: PropTypes.object,
  customer: PropTypes.bool,
};

export default function IndexBooking({ program, detailRow, customer }) {
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

      <Card sx={{ minWidth: 275, backgroundColor: '#D7B94D' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Nom du programme</Typography>
              <Typography variant="body2">{program.label} </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={3}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Formule</Typography>
              <Typography variant="body2">{program.formula}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={3}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Localisation</Typography>
              <Typography variant="body2">{program.location}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={3}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Type d'habitation</Typography>
              <Typography variant="body2">{program.real_estate_program_type}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      {/* <Typography variant="h4" component="div">
                Programme imobillier
              </Typography> */}
      <Card sx={{ minWidth: 275 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Lot</Typography>
              <Typography variant="body2">{detailRow.lot > 0 ? detailRow.lot : 0}</Typography>
            </CardContent>
          </Grid>

          <Grid item xs={6} md={3}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>ILot</Typography>
              <Typography variant="body2">{detailRow.sub_lot > 0 ? detailRow.sub_lot : 0}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={3}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Superficie du lot</Typography>
              <Typography variant="body2">{detailRow.area > 0 ? detailRow.area : 0} m&sup2;</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={3}>
            <CardContent>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Statut</Typography>
              {parseInt(detailRow.balance_due) === 0 ? (
                <Label variant={'ghost'} color={'success'}>
                  Acquis
                </Label>
              ) : (
                <Label variant={'ghost'} color={'error'}>
                  En cours d'aquisition
                </Label>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <Typography variant="h4" component="div">
        Détails de mon logement
      </Typography>
      <Card sx={{ minWidth: 275 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <CardContent sx={{}}>
              <Scrollbar>
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
            </CardContent>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ backgroundColor: '#F7EFED' }}>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15 }}>Frais de réservation</Typography>
              <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                {sepMillier(detailRow.booking_fees)} {detailRow.booking_fees === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15 }}>Montant de frais de réservation payé</Typography>
              <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                {sepMillier(detailRow.booking_fees - detailRow.booking_fees_due)}{' '}
                {detailRow.booking_fees - detailRow.booking_fees_due === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15 }}>Reste à payer frais de réservation</Typography>
              <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold', color: '#A04428' }}>
                {parseInt(detailRow.booking_fees_due) === 0
                  ? sepMillier(detailRow.booking_fees_due) + ' FCFA'
                  : sepMillier(detailRow.booking_fees_due) + ' FCFA'}
                {/* {sepMillier(detailRow.booking_fees_due)} {detailRow.booking_fees_due === 0 ? '' : 'FCFA'} */}
              </Typography>
            </CardContent>
          </Grid>

          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15 }}>Montant total du logement</Typography>
              <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                {sepMillier(detailRow.house_global_amount)} {detailRow.house_global_amount === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15 }}>Somme versée</Typography>
              <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                {sepMillier(detailRow.amount_paid)} {detailRow.amount_paid === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15 }}>Reste à payer du montant total du logement</Typography>
              <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold', color: '#A04428' }}>
                {parseInt(detailRow.balance_due) === 0
                  ? sepMillier(detailRow.balance_due) + ' FCFA'
                  : sepMillier(detailRow.balance_due) + ' FCFA'}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      {!isSolde ? (
        <>
          <Typography variant="h4" component="div">
            Détails de l'échéance
          </Typography>
          <Card sx={{ minWidth: 275 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <CardContent sx={{}}>
                  <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                    Date de début de l'échéancier de paiement
                  </Typography>
                  <Typography variant="body2">
                    {moment(detailRow.payment_schedule_start_date).format('DD MMM YYYY')}{' '}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={6} md={4}>
                <CardContent sx={{}}>
                  <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Date de fin de paiement du logement</Typography>
                  <Typography variant="body2">
                    {moment(detailRow.payment_schedule_end_date).format('DD MMM YYYY')}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={6} md={4}>
                <CardContent sx={{}}>
                  <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Nombre d'échéance de paiement</Typography>
                  <Typography variant="body2">{detailRow.payment_deadlines_number}</Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </>
      ) : (
        ''
      )}
    </Stack>
  );
}
