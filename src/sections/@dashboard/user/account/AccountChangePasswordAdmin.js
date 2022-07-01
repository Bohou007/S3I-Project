import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';

import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Card } from '@mui/material';

import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { HOST_API } from '../../../../config';
import useAuth from '../../../../hooks/useAuth';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

export default function AccountChangePasswordAdmin() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [showPasswordField1, setShowPasswordField1] = useState(false);
  const [showPasswordField2, setShowPasswordField2] = useState(false);
  const [showPasswordField3, setShowPasswordField3] = useState(false);

  const ChangePassWordSchema = Yup.object().shape({
    old_password: Yup.string().required('Le mot de passe actuel est requis'),
    new_password: Yup.string()
      .min(6, 'Le mot de passe doit comporter au moins 6 caractères')
      .required('Le nouveau mot de passe est nécessaire'),
    confirm_password: Yup.string().oneOf([Yup.ref('new_password'), null], 'Les mots de passe doivent correspondre'),
  });

  const defaultValues = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log('data', data);

    try {
      await axios
        .put(`${HOST_API}/ws-booking-payment/customer/update-password/${user?.customer_reference}`, data)
        .then((res) => {
          enqueueSnackbar('Votre mot de password ont été mise à jour', { variant: 'success' });
          setTimeout(() => {
            window.location.reload(true);
          }, 1500);
          reset();
        })
        .catch((error) => {
          enqueueSnackbar('Une erreur est survenue', { variant: 'error' });
        });
    } catch (error) {
      console.log('err', error.message);
      enqueueSnackbar('Une erreur est survenue', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField
            name="old_password"
            label="Mot de passe actuel *"
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

          <RHFTextField
            name="new_password"
            label="Nouveau mot de passe *"
            type={showPasswordField2 ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPasswordField2(!showPasswordField2)} edge="end">
                    <Iconify icon={showPasswordField2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirm_password"
            label="Confirmez le nouveau mot de passe *"
            type={showPasswordField3 ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPasswordField3(!showPasswordField3)} edge="end">
                    <Iconify icon={showPasswordField3 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton type="submit" disabled variant="contained" loading={isSubmitting}>
            Modifier mon mot de passe
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
