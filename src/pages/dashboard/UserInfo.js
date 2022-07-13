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

UserInfo.propTypes = {
  customer: PropTypes.object,
};

export default function UserInfo({ customer }) {
  return (
    <Stack spacing={3}>
      <Card sx={{ minWidth: 275 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Nom de famille</Typography>
              <Typography variant="body2">{customer.lastname}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Prénoms</Typography>
              <Typography variant="body2">{customer.firstname}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Code de reference</Typography>
              <Typography variant="body2">
                <Label color="primary">{customer.customer_reference}</Label>
              </Typography>
            </CardContent>
          </Grid>

          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Email</Typography>
              <Typography variant="body2">{customer.email}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Numéro de téléphone</Typography>
              <Typography variant="body2">{customer.phone_number}</Typography>
            </CardContent>
          </Grid>

          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Genre</Typography>
              <Typography variant="body2">{customer.sexe === 'M' ? 'MASCULIN' : 'FEMININ'}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Status matrimonial</Typography>
              <Typography variant="body2">{customer.marital_status}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6} md={4}>
            <CardContent sx={{}}>
              <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Date de creation du compte</Typography>
              <Typography variant="body2">{moment(customer.createdAt).format('DD MMM YYYY')}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
}
