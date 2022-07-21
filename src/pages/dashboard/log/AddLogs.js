/* eslint-disable prefer-template */
/* eslint-disable object-shorthand */
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import React, { useState, useEffect } from 'react';

import axios from '../../../utils/axios';

export function AddLogs(message, user) {
  const messagesLogs = user?.lastName + ' ' + user?.firstName + ' ' + message;
  console.log('============Log res.data========================');
  console.log(user);
  console.log('====================================');
  const item = {
    message: messagesLogs,
    user_id: user.id,
    user_type: user.role.toUpperCase(),
  };
  axios
    .post(`/ws-booking-payment/log`, item)
    .then((res) => {
      console.log('============Log res.data========================');
      console.log(res.data);
      console.log('====================================');
    })
    .catch((error) => {
      console.log('=================Log error.message===================');
      console.log(error.message);
      console.log('====================================');
    });
}
