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
  Dialog,
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
      openMenu: null,
    };
    this.sepMillier = this.sepMillier.bind(this);
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
  }

  componentDidMount() {}

  sepMillier(number) {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
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
                <MenuItem onClick={this.props.handleAddEvent}>
                  <Iconify icon={'eva:edit-fill'} />
                  Modifier
                </MenuItem>
                {/* <MenuItem
                  onClick={() => {
                    // onDeleteRow();
                    // handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Supprimer
                </MenuItem> */}
              </>
            }
          />
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
  handleAddEvent: PropTypes.func,
  handleCloseModal: PropTypes.func,
  handleSubmitToUpdate: PropTypes.func,
  handleChangeEdit: PropTypes.func,
  detailRow: PropTypes.object,
  isOpenModal: PropTypes.bool,
};

export default UserTableRowAdminTx;
