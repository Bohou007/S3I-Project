/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment';
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

import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../calendar';

class UserTableRowTx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      detailRow: '',
      // eslint-disable-next-line react/no-unused-state
      isOpenModal: false,
    };
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.sepMillier = this.sepMillier.bind(this);
  }

  componentDidMount() {}

  // eslint-disable-next-line class-methods-use-this
  handleAddEvent(value) {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      isOpenModal: true,
      // eslint-disable-next-line react/no-unused-state
      detailRow: value,
    });
  }

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

  render() {
    const { name, lot, iLot, montant, deadlineAt, program } = this.props.row;

    return (
      <TableRow hover selected={this.props.selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={this.props.selected} onClick={this.props.onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Avatar alt={name} src=""} sx={{ mr: 2 }} /> */}
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell align="left">{lot}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {iLot}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {this.sepMillier(montant)}
        </TableCell>

        <TableCell align="center">
          {/* <Iconify
          icon={'eva:checkmark-circle-fill'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...{ color: 'warning.main' },
          }}['filled', 'outlined', 'ghost']
        /> */}
          {deadlineAt}
        </TableCell>

        <TableCell align="left">
          <Label variant={'ghost'} color={'success'} sx={{ textTransform: 'capitalize' }}>
            {program}
          </Label>
        </TableCell>

        <TableCell align="right">
          <Button
            variant="outlined"
            color={'primary'}
            onClick={() => this.handleAddEvent(this.props.row)}
            startIcon={<VisibilityIcon />}
          >
            Details
          </Button>

          <DialogAnimate open={this.state.isOpenModal} onClose={this.handleCloseModal} sx={{ width: '50%' }}>
            <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
              S3I - Bâtisseur du confort
            </DialogTitle>
            {console.log('detailRow', this.state.detailRow)}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Card sx={{ minWidth: 275, backgroundColor: '#D7B94D' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <CardContent sx={{}}>
                      <Label color={'dark'} sx={{ backgroundColor: 'inherit', fontSize: 15, fontWeight: 'bold' }}>
                        Lot:
                      </Label>
                      <Label color={'dark'} sx={{ backgroundColor: 'inherit', fontSize: 15, fontWeight: '200' }}>
                        {this.state.detailRow.lot}
                      </Label>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6}>
                    <CardContent sx={{}}>
                      <Label color={'dark'} sx={{ backgroundColor: 'inherit', fontSize: 15, fontWeight: 'bold' }}>
                        I Lot:
                      </Label>
                      <Label color={'dark'} sx={{ backgroundColor: 'inherit', fontSize: 15, fontWeight: '200' }}>
                        {this.state.detailRow.iLot}
                      </Label>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
              <Typography variant="h4" component="div">
                Datails de l'echeance
              </Typography>
              <Card sx={{ minWidth: 275 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Montant versé</Typography>
                      <Typography variant="body2">{this.sepMillier(this.state.detailRow.montant)}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6}>
                    <CardContent>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Programme souscrit</Typography>
                      <Typography variant="body2">{this.state.detailRow.program}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6}>
                    <CardContent sx={{}}>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Date d'echance</Typography>
                      {/* <Typography variant="body2">{moment(detailRow.deadlineAt).format('D MMMM YYYY')}</Typography> */}
                      <Typography variant="body2">{this.state.detailRow.deadlineAt}</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6}>
                    <CardContent>
                      <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>Statut</Typography>
                      <Label color="info">Non reglé</Label>
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
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default UserTableRowTx;
