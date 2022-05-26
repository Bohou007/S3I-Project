/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-const */
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
  TextField,
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
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

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

class UserTableRowAdminTx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailRow: '',
      program: '',
      item: {},
      booking: '',
      nameProgram: [],
      isOpenModal: false,
      openMenu: null,
    };
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.sepMillier = this.sepMillier.bind(this);
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEdit = this.handleChangeEdit.bind(this);
  }

  componentDidMount() {
    this.handleGetProgramme(this.props.row.real_estate_program_reference);
  }

  handleAddEvent = async (value) => {
    this.setState({
      isOpenModal: true,
      detailRow: value,
    });
  };

  handleGetProgramme = async (value) => {
    const response = await axios.get(`/ws-booking-payment/real-estate-program/${value}`);
    const programme = response.data.label + ' ' + response.data.formula;
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

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  handleChangeEdit(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let detailRow = { ...this.state.detailRow };
    detailRow[name] = value;
    this.setState({ detailRow });
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
    const { label, formula, real_estate_program_type, location, createdAt } = this.props.row;

    return (
      <TableRow hover selected={this.props.selected}>
        <TableCell align="left">{label}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {formula}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {real_estate_program_type}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {location}
        </TableCell>

        <TableCell align="left">{moment(createdAt).format('DD MMM YYYY')}</TableCell>

        <TableCell align="right">
          <TableMoreMenu
            open={this.state.openMenu}
            onOpen={this.handleOpenMenu}
            onClose={this.handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    this.handleAddEvent(this.props.row);
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Modifier
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    // onDeleteRow();
                    // handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Supprimer
                </MenuItem>
              </>
            }
          />

          <DialogAnimate open={this.state.isOpenModal} onClose={this.handleCloseModal}>
            <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
              S3I - Bâtisseur du confort
            </DialogTitle>
            {console.log('detailRow', this.state.detailRow)}
            <Stack spacing={3} sx={{ p: 3 }}>
              {/* <Typography variant="h4" component="div">
                Modification du programme {this.state.detailRow.label} {this.state.detailRow.formula}
              </Typography> */}
              <Card sx={{ minWidth: 275 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CardContent sx={{ marginTop: 2 }}>
                      <TextField
                        name="label"
                        // id="outlined-basic"
                        onChange={this.handleChangeEdit}
                        value={this.state.detailRow.label}
                        label="Nom du programme"
                        sx={{ width: '100%' }}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item xs={12}>
                    <CardContent sx={{ marginTop: 0 }}>
                      <TextField
                        id="outlined-basic"
                        value={this.state.detailRow.formula}
                        onChange={this.handleChangeEdit}
                        label="Formule"
                        sx={{ width: '100%' }}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item xs={12}>
                    <CardContent sx={{ marginTop: 0 }}>
                      <TextField
                        id="outlined-basic"
                        value={this.state.detailRow.real_estate_program_type}
                        onChange={this.handleChangeEdit}
                        label="Type d'habitation"
                        sx={{ width: '100%' }}
                      />
                    </CardContent>
                  </Grid>
                  <Grid item xs={12}>
                    <CardContent sx={{ marginTop: 0 }}>
                      <TextField
                        id="outlined-basic"
                        value={this.state.detailRow.location}
                        onChange={this.handleChangeEdit}
                        label="Localisation"
                        sx={{ width: '100%' }}
                      />
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

UserTableRowAdminTx.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default UserTableRowAdminTx;
