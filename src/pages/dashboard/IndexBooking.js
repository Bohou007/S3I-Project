/* eslint-disable radix */
/* eslint-disable import/first */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
// eslint-disable-next-line import/newline-after-import
import moment from 'moment/min/moment-with-locales';
const locale = moment.locale('fr');
// @mui
import { useTheme } from '@mui/material/styles';
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
} from '@mui/material';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Label from '../../components/Label';

// ----------------------------------------------------------------------

IndexBooking.propTypes = {
  program: PropTypes.object,
  detailRow: PropTypes.object,
};

export default function IndexBooking({ program, detailRow }) {
  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  return (
    <Stack spacing={3}>
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
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Lot</Typography>
              <Typography variant="body2">{detailRow.lot}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Sous-Lot</Typography>
              <Typography variant="body2">{detailRow.sub_lot}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Statut</Typography>
              <Label color="info">Non reglé</Label>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <Typography variant="h4" component="div">
        Détails de mon logement
      </Typography>
      <Card sx={{ minWidth: 275 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Code de mon logement</Typography>
              <Typography variant="body2">
                <Label color="primary">{detailRow.booking_reference}</Label>
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Terrain supplémentaire</Typography>
              <Typography variant="body2">{sepMillier(detailRow.additional_land)} m&sup2;</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant du terrain supplémentaire</Typography>
              <Typography variant="body2">
                {sepMillier(detailRow.additional_land_amount)}{' '}
                {parseInt(detailRow.additional_land_amount) === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>

          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant de la clôture supplémentaire</Typography>
              <Typography variant="body2">
                {sepMillier(detailRow.additional_fence_amount)}{' '}
                {parseInt(detailRow.additional_fence_amount) === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Frais de demande</Typography>
              <Typography variant="body2">
                {sepMillier(detailRow.application_fees)} {parseInt(detailRow.application_fees) === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Frais de réservation</Typography>
              <Typography variant="body2">
                {sepMillier(detailRow.booking_fees)} {parseInt(detailRow.booking_fees) === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant versé</Typography>
              <Typography variant="body2">
                {sepMillier(detailRow.amount_paid)} {parseInt(detailRow.amount_paid) === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant total de mon logement</Typography>
              <Typography variant="body2">
                {sepMillier(detailRow.house_amount)} {parseInt(detailRow.house_amount) === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <CardContent sx={{ width: '100%', backgroundColor: '#DFE3E8' }}>
              <Typography sx={{ fontSize: 15 }}>Reste a payer</Typography>
              <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                {sepMillier(detailRow.house_amount - detailRow.amount_paid)}{' '}
                {detailRow.house_amount - detailRow.amount_paid === 0 ? '' : 'FCFA'}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <Typography variant="h4" component="div">
        Detailes de l'echeance
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
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                Date de fin de paiement de la reservation
              </Typography>
              <Typography variant="body2">
                {moment(detailRow.payment_schedule_end_date).format('DD MMM YYYY')}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Nombre d'echeance de paiement</Typography>
              <Typography variant="body2">{detailRow.payment_deadlines_number}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
}
