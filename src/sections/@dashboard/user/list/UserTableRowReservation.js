/* eslint-disable import/first */
/* eslint-disable no-unused-vars */
/* eslint-disable import/newline-after-import */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable prefer-template */
/* eslint-disable react/no-unused-state */
/* eslint-disable radix */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
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
  MenuItem,
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

import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../calendar';

class UserTableRowReservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailRow: '',
      isOpenModal: false,
      program: '',
      listPro: '',
    };
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.sepMillier = this.sepMillier.bind(this);
    this.handleGetProgramme = this.handleGetProgramme.bind(this);
  }

  componentDidMount() {
    this.handleGetProgramme(this.props.row.real_estate_programe_reference);
  }

  // eslint-disable-next-line class-methods-use-this
  handleAddEvent = async (value) => {
    const response = await axios.get(`/ws-booking-payment/real-estate-program/${value.real_estate_programe_reference}`);
    this.setState({
      isOpenModal: true,
      detailRow: value,
      program: response.data,
      openMenu: null,
    });
  };

  handleGetProgramme = async (value) => {
    const response = await axios.get(`/ws-booking-payment/real-estate-program/${value}`);
    // console.log('response', response);

    const programme = response.data.label + ' ' + response.data.formula + ' ' + response.data.real_estate_program_type;
    this.setState({
      listPro: programme,
    });
    return programme;
  };

  // eslint-disable-next-line class-methods-use-this
  // eslint-disable-next-line react/sort-comp
  sepMillier(number) {
    const Primenumeral = numeral(number).format(+0, 0);
    // console.log(Primenumeral);
    return Primenumeral.replace(/[,]+/g, ' ');
  }

  handleCloseModal() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      isOpenModal: false,
    });
  }

  handleOpenMenu = (event) => {
    this.setState({
      openMenu: event.currentTarget,
    });
  };

  handleCloseMenu = () => {
    this.setState({
      openMenu: null,
    });
  };

  render() {
    const { row } = this.props;
    console.log('Program', this.state.program);

    return (
      <TableRow hover>
        <TableCell align="left">{this.state.listPro}</TableCell>

        <TableCell align="left">{row.lot}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row.sub_lot}
        </TableCell>

        <TableCell align="right">{this.sepMillier(row.house_amount)} FCFA</TableCell>
        <TableCell align="left">{this.sepMillier(row.amount_paid)} FCFA</TableCell>
        <TableCell align="left">{this.sepMillier(row.balance_due)} FCFA</TableCell>

        <TableCell align="left"> {moment(row.payment_schedule_end_date).format('DD MMM YYYY')}</TableCell>

        <TableCell align="left">
          {/* <Button
            variant="outlined"
            color={'primary'}
            onClick={() => {
              this.props.onViewRow();
            }}
            startIcon={<VisibilityIcon />}
          >
            Détails
          </Button> */}

          <TableMoreMenu
            open={this.state.openMenu}
            onOpen={this.handleOpenMenu}
            onClose={this.handleCloseMenu}
            actions={
              <>
                <MenuItem
                  variant="outlined"
                  color={'primary'}
                  onClick={() => {
                    this.props.onViewRow();
                  }}
                >
                  <Iconify icon={'eva:eye-outline'} />
                  Voir détails
                </MenuItem>
                <MenuItem
                  variant="outlined"
                  color={'primary'}
                  onClick={() => {
                    this.props.onViewRowSituation();
                  }}
                >
                  <Iconify icon={'eva:corner-down-right-outline'} />
                  Voir ma situation
                </MenuItem>
              </>
            }
          />

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
              {/* <Typography variant="h4" component="div">
                Programme imobillier
              </Typography> */}
              <Card sx={{ minWidth: 275 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Lot</Typography>
                      <Typography variant="body2">{this.state.detailRow.lot}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>ILot</Typography>
                      <Typography variant="body2">{this.state.detailRow.sub_lot}</Typography>
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
                        <Label color="primary">{this.state.detailRow.booking_reference}</Label>
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Terrain supplémentaire</Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.additional_land)} m&sup2;
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                        Montant du terrain supplémentaire
                      </Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.additional_land_amount)}{' '}
                        {parseInt(this.state.detailRow.additional_land_amount) === 0 ? '' : 'FCFA'}
                      </Typography>
                    </CardContent>
                  </Grid>

                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                        Montant de la clôture supplémentaire
                      </Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.additional_fence_amount)}{' '}
                        {parseInt(this.state.detailRow.additional_fence_amount) === 0 ? '' : 'FCFA'}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Frais de demande</Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.application_fees)}{' '}
                        {parseInt(this.state.detailRow.application_fees) === 0 ? '' : 'FCFA'}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Frais de réservation</Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.booking_fees)}{' '}
                        {parseInt(this.state.detailRow.booking_fees) === 0 ? '' : 'FCFA'}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant versé</Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.amount_paid)}{' '}
                        {parseInt(this.state.detailRow.amount_paid) === 0 ? '' : 'FCFA'}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant total de mon logement</Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.house_amount)}{' '}
                        {parseInt(this.state.detailRow.house_amount) === 0 ? '' : 'FCFA'}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={12}>
                    <CardContent sx={{ width: '100%', backgroundColor: '#DFE3E8' }}>
                      <Typography sx={{ fontSize: 15 }}>Reste a payer</Typography>
                      <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                        {this.sepMillier(this.state.detailRow.house_amount - this.state.detailRow.amount_paid)}{' '}
                        {this.state.detailRow.house_amount - this.state.detailRow.amount_paid === 0 ? '' : 'FCFA'}
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
                        {moment(this.state.detailRow.payment_schedule_start_date).format('DD MMM YYYY')}{' '}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
                        Date de fin de paiement du logement
                      </Typography>
                      <Typography variant="body2">
                        {moment(this.state.detailRow.payment_schedule_end_date).format('DD MMM YYYY')}
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Nombre d'echeance de paiement</Typography>
                      <Typography variant="body2">{this.state.detailRow.payment_deadlines_number}</Typography>
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
        </TableCell>
      </TableRow>
    );
  }
}

UserTableRowReservation.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
  onViewRowSituation: PropTypes.func,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default UserTableRowReservation;
