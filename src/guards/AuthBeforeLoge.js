import PropTypes from 'prop-types';
import {
  Container,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  Stack,
  Card,
  CardContent,
  DialogActions,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { PATH_AUTH, PATH_DASHBOARD } from '../routes/paths';
import axios from '../utils/axios';

import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../components/hook-form';
import lockpass from '../assets/images/lockpass.png';
import Image from '../components/Image';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------
import useAuth from '../hooks/useAuth';

AuthBeforeLoge.propTypes = {
  children: PropTypes.node,
};

export default function AuthBeforeLoge({ children }) {
  const { user, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthoriseLoge, setIsAuthoriseLoge] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(true);
  const [showPasswordField1, setShowPasswordField1] = useState(false);

  const NewUserSchema = Yup.object().shape({
    password: Yup.string().required('Le mot de passe est obligatoire.'),
  });

  const defaultValues = useMemo(() => ({
    password: '',
  }));

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleCloseModal = () => {
    setIsOpenModal(false);
    navigateBack();
  };

  const navigateBack = () => {
    navigate(PATH_DASHBOARD.root, { replace: true });
  };

  const handleGetAuth = async (data) => {
    setIsLoading(true);

    console.log('================pass====================');
    console.log(data);
    console.log('====================================');

    const item = {
      login_id: user.email,
      password: data.password,
    };

    axios
      .post(`/ws-booking-payment/customer/login`, item)
      .then((res) => {
        setIsAuthoriseLoge(true);
        console.log(res.data);
        setTimeout(() => {
          setIsOpenModal(false);
          setIsLoading(false);
          enqueueSnackbar('Accès validé', { variant: 'success' });
        }, 1000);
      })
      .catch((error) => {
        navigateBack();
        setIsAuthoriseLoge(false);
        setIsOpenModal(false);
        setIsLoading(false);
        enqueueSnackbar('Accès refusé !', { variant: 'error' });
      });
  };

  return (
    <>
      {isAuthoriseLoge ? children : ''}
      <Dialog open={isOpenModal} onClose={handleCloseModal} fullWidth="true" maxWidth="md">
        <DialogTitle sx={{ width: '100%', backgroundColor: '#D7B94D', paddingBottom: 2 }}>
          S3I - Bâtisseur du confort
        </DialogTitle>
        <Stack spacing={1} sx={{ p: 3 }}>
          <Card sx={{ minWidth: 275 }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(handleGetAuth)}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ py: 2, px: 4 }}>
                    <Image src={lockpass} alt="lock" />
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'colum',
                        mt: 3,
                        columnGap: 2,
                        rowGap: 3,
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                      }}
                    >
                      <RHFTextField
                        name="password"
                        label="Mot de passe"
                        type={showPasswordField1 ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPasswordField1(!showPasswordField1)} edge="end">
                                <Iconify icon={showPasswordField1 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Stack alignItems="flex-end" sx={{ mt: 9 }}>
                      <Box
                        sx={{
                          display: 'flex',
                        }}
                      >
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            handleCloseModal();
                          }}
                          sx={{ mr: 2 }}
                        >
                          Fermer
                        </Button>
                        <Button disabled={isLoading} variant="contained" type="submit" color="primary">
                          {isLoading ? (
                            <>
                              Validation de vos access...
                              <CircularProgress
                                size={14}
                                sx={{
                                  color: '#fff',
                                  marginLeft: 2,
                                }}
                              />
                            </>
                          ) : (
                            'Valider vos access'
                          )}
                        </Button>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </FormProvider>
          </Card>
        </Stack>
      </Dialog>
    </>
  );

  // if () {
  //   return (
  //     <Container>
  //       <Alert severity="error">
  //         <AlertTitle>Permission Denied</AlertTitle>
  //         You do not have permission to access this page
  //       </Alert>
  //     </Container>
  //   );
  // }

  // return <>{children}</>;
}
