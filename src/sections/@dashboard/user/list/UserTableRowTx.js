/* eslint-disable import/first */
/* eslint-disable no-unused-vars */
/* eslint-disable import/newline-after-import */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable prefer-template */
/* eslint-disable react/no-unused-state */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment/min/moment-with-locales';
moment.locale('fr');
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

// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { useDispatch, useSelector } from '../../../../redux/store';
import { DialogAnimate } from '../../../../components/animate';
import {
  getEvents,
  openModal,
  closeModal,
  updateEvent,
  selectEvent,
  selectRange,
} from '../../../../redux/slices/calendar';
import axios from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';

import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../calendar';
import { AddLogs } from '../../../../pages/dashboard/log/AddLogs';

// const { user } = useAuth();

class UserTableRowTx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailRow: '',
      program: '',
      booking: '',
      nameProgram: [],
      isOpenModal: false,
    };
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.sepMillier = this.sepMillier.bind(this);
  }

  componentDidMount() {
    this.handleGetProgramme(this.props.row.real_estate_program_reference);
  }

  handleAddEvent = async (value) => {
    const program = await axios.get(`/ws-booking-payment/real-estate-program/${value.real_estate_program_reference}`);
    const booking = await axios.get(`/ws-booking-payment/booking/${value.booking_reference}`);

    this.setState({
      isOpenModal: true,
      detailRow: value,
      program: program.data,
      booking: booking.data,
    });

    AddLogs(
      "a consulté les details d'une de ces échéances pour la reservation de référence " + value.booking_reference,
      this.props.user
    );
  };

  handleGetProgramme = async (value) => {
    const response = await axios.get(`/ws-booking-payment/real-estate-program/${value}`);
    const programme = response.data.label + ' ' + response.data.formula + ' ' + response.data.real_estate_program_type;
    this.setState({
      nameProgram: programme,
    });
    return programme;
  };

  sepMillier(number) {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  }

  handleCloseModal() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      isOpenModal: false,
    });
  }

  render() {
    const { booking_reference, amount_to_be_paid, due_date, amount_paid } = this.props.row;

    return (
      <TableRow hover selected={this.props.selected}>
        <TableCell align="left">{booking_reference}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {this.state.nameProgram}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {this.sepMillier(amount_to_be_paid)} FCFA
        </TableCell>

        <TableCell align="left">
          {/* <Iconify
          icon={'eva:checkmark-circle-fill'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...{ color: 'warning.main' },
          }}['filled', 'outlined', 'ghost']
        /> */}
          {moment(due_date).format('DD MMM YYYY')}
        </TableCell>

        <TableCell align="left">
          {parseInt(amount_paid) !== 0 ? (
            parseInt(amount_to_be_paid) === parseInt(amount_paid) ? (
              <Label variant={'ghost'} color={'success'}>
                Reglé
              </Label>
            ) : (
              <Label variant={'ghost'} color={'info'}>
                Reglé partielement
              </Label>
            )
          ) : (
            <Label variant={'ghost'} color={'error'}>
              Non reglé
            </Label>
          )}
        </TableCell>

        <TableCell align="right">
          <Button
            variant="outlined"
            color={'primary'}
            onClick={() => this.handleAddEvent(this.props.row)}
            startIcon={<VisibilityIcon />}
          >
            Détails
          </Button>

          <DialogAnimate open={this.state.isOpenModal} onClose={this.handleCloseModal} maxWidth={'md'}>
            <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
              S3I - Bâtisseur du confort
            </DialogTitle>
            {console.log('detailRow', this.state.detailRow)}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Card sx={{ minWidth: 275, backgroundColor: '#D7B94D' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Nom du programme</Typography>
                      <Typography variant="body2">{this.state.program.label} </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Formule</Typography>
                      <Typography variant="body2">{this.state.program.formula}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Localisation</Typography>
                      <Typography variant="body2">{this.state.program.location}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Type d'habitation</Typography>
                      <Typography variant="body2">{this.state.program.real_estate_program_type}</Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
              <Card sx={{ minWidth: 275 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Code du logement</Typography>
                      <Typography variant="body2">{this.state.booking.booking_reference}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Lot</Typography>
                      <Typography variant="body2">{this.state.booking.lot}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Ilot</Typography>
                      <Typography variant="body2">{this.state.booking.sub_lot}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <CardContent>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Statut</Typography>
                      {parseInt(this.state.detailRow.amount_paid) !== 0 ? (
                        parseInt(this.state.detailRow.amount_to_be_paid) ===
                        parseInt(this.state.detailRow.amount_paid) ? (
                          <Label variant={'ghost'} color={'success'}>
                            Reglé
                          </Label>
                        ) : (
                          <Label variant={'ghost'} color={'info'}>
                            Reglé partielement
                          </Label>
                        )
                      ) : (
                        <Label variant={'ghost'} color={'error'}>
                          Non reglé
                        </Label>
                      )}
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
              <Typography variant="h4" component="div">
                Détails de l'échéance
              </Typography>
              <Card sx={{ minWidth: 275 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant à verser</Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.amount_to_be_paid)} FCFA
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant déja versé </Typography>
                      <Typography variant="body2">{this.sepMillier(this.state.detailRow.amount_paid)} FCFA</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Date de l'échéance</Typography>
                      {/* <Typography variant="body2">{moment(detailRow.deadlineAt).format('D MMMM YYYY')}</Typography> */}
                      <Typography variant="body2">
                        {moment(this.state.detailRow.due_date).format('DD MMMM YYYY')}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={12}>
                    <CardContent sx={{ width: '100%', backgroundColor: '#DFE3E8' }}>
                      <Typography sx={{ fontSize: 15 }}>Reste à payer</Typography>
                      <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                        {this.sepMillier(this.state.detailRow.amount_to_be_paid - this.state.detailRow.amount_paid)}
                        {parseInt(this.state.detailRow.amount_to_be_paid) -
                          parseInt(this.state.detailRow.amount_paid) ===
                        0
                          ? ''
                          : ' FCFA'}
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Stack>
            <DialogActions>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" color="inherit" onClick={this.handleCloseModal}>
                Fermer
              </Button>
            </DialogActions>
          </DialogAnimate>
          {/* <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        /> */}
        </TableCell>
      </TableRow>
    );
  }
}

UserTableRowTx.propTypes = {
  row: PropTypes.object,
  user: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default UserTableRowTx;
