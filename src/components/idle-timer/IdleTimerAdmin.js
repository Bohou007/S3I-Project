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
import { useIdleTimer } from 'react-idle-timer';
import { PATH_AUTH } from '../../routes/paths';
import Image from '../Image';
import lockpass from '../../assets/images/session.png';
import { setSession } from '../../utils/jwt';

import useAuth from '../../hooks/useAuth';

export default function ReactTimerAdmin() {
  const { user, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const timeout = 3 * 60 * 1000;
  const [remaining, setRemaining] = useState(timeout);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOnIdle = () => {
    // SHOW YOUR MODAL HERE AND LoGOUT
    setIsOpenModal(true);
    console.log('The user has been logged out...');
    handleLogout();
  };

  const { getRemainingTime } = useIdleTimer({
    timeout,
    onIdle: handleOnIdle,
  });

  useEffect(() => {
    if (user !== null) {
      setRemaining(getRemainingTime());
      setInterval(() => {
        setRemaining(getRemainingTime());
      }, 1000);
    }
  }, []);

  const handleCloseModal = () => {
    setIsOpenModal(true);
  };

  const handleLogout = async () => {
    setSession(null);
    window.localStorage.clear();
  };

  const handleRedirect = async () => {
    setIsLoading(true);
    try {
      await logout();
      if (isOpenModal) {
        setIsOpenModal(false);
      }
      navigate(PATH_AUTH.adminLogin, { replace: true });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <Dialog open={isOpenModal} onClose={handleCloseModal} fullWidth="true" maxWidth="sm">
        <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
          S3I - Bâtisseur du confort
        </DialogTitle>
        <Stack spacing={1} sx={{ p: 3 }}>
          <Card
            sx={{
              minWidth: 275,
              pb: 7,
              pt: 2,
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ flexGrow: 1 }} />
            <Image src={lockpass} alt="lock" sx={{ height: 220, width: 200, alignItems: 'center' }} />
            <CardContent sx={{ marginTop: 0 }}>Votre session a expiré</CardContent>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleRedirect();
              }}
            >
              Retourner a la page d'accueil
            </Button>
          </Card>
        </Stack>
      </Dialog>
    </>
  );
}
