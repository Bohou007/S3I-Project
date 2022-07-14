/* eslint-disable import/first */
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

class UserTableRowPaiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailRow: '',
      isOpenModal: false,
      program: '',
      listPro: '',
      openMenu: null,
    };
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.sepMillier = this.sepMillier.bind(this);
    this.handleGetProgramme = this.handleGetProgramme.bind(this);
  }

  componentDidMount() {
    this.handleGetProgramme(this.props.row.real_estate_program_reference);
  }

  // eslint-disable-next-line class-methods-use-this
  handleAddEvent = async (value) => {
    const response = await axios.get(`/ws-booking-payment/real-estate-program/${value.real_estate_program_reference}`);
    this.setState({
      isOpenModal: true,
      detailRow: value,
      program: response.data,
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
        <TableCell align="left" sx={{ textTransform: 'none' }}>
          {this.state.listPro}
        </TableCell>

        <TableCell align="left">{this.sepMillier(row.amount)} FCFA</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {row.input_payment_reference}
        </TableCell>

        <TableCell align="center">{row.payment_method}</TableCell>

        <TableCell align="center">{row.bank}</TableCell>
        <TableCell align="center"> {moment(row.payment_date).format('DD MMM YYYY')}</TableCell>

        <TableCell align="right">
          <TableMoreMenu
            open={this.state.openMenu}
            onOpen={this.handleOpenMenu}
            onClose={this.handleCloseMenu}
            actions={
              <>
                <MenuItem onClick={() => this.handleAddEvent(this.props.row)} sx={{}}>
                  <Iconify icon={'eva:eye-outline'} />
                  Voir le detail
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    this.props.onViewRow();
                    // handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:corner-down-right-outline'} />
                  Votre facture
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
              <Typography variant="h4" component="div">
                Détails du versements
              </Typography>
              <Card sx={{ minWidth: 275 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Mode de paiement</Typography>
                      <Typography variant="body2">{this.state.detailRow.payment_method}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Banque</Typography>
                      <Typography variant="body2">{this.state.detailRow.bank}</Typography>
                    </CardContent>
                  </Grid>

                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Référence du paiement</Typography>
                      <Typography variant="body2">{this.state.detailRow.input_payment_reference}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Code de mon logement</Typography>
                      <Typography variant="body2">{this.state.detailRow.booking_reference}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Date de paiement</Typography>
                      <Typography variant="body2">
                        {moment(this.state.detailRow.payment_date).format('DD MMM YYYY')}{' '}
                      </Typography>
                    </CardContent>
                  </Grid>
                  {/* <Grid item xs={6} md={4}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Nombre d'echeance</Typography>
                      <Typography variant="body2">
                        {this.sepMillier(this.state.detailRow.amount_paid)}{' '}
                        {this.state.detailRow.amount_paid === 0 ? '' : 'FCFA'}
                      </Typography>
                    </CardContent>
                  </Grid> */}
                  <Grid item xs={12}>
                    <CardContent sx={{ width: '100%', backgroundColor: '#DFE3E8' }}>
                      <Typography sx={{ fontSize: 15 }}>Montant du versement</Typography>
                      <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                        {this.sepMillier(this.state.detailRow.amount)} {this.state.detailRow.amount === 0 ? '' : 'FCFA'}
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
        </TableCell>
      </TableRow>
    );
  }
}

UserTableRowPaiment.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
};

export default UserTableRowPaiment;
