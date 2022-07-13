/* eslint-disable no-nested-ternary */
/* eslint-disable object-shorthand */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  ButtonGroup,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import userAvartar from '../../../assets/images/userAvatar.png';
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

UserNewEditFormPassword.propTypes = {
  currentUser: PropTypes.object,
  onSubmit: PropTypes.func,
  handleCloseModal: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default function UserNewEditFormPassword({ isEdit, onSubmit, currentUser, handleCloseModal, isLoading }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [showPasswordField1, setShowPasswordField1] = useState(false);
  const [showPasswordField2, setShowPasswordField2] = useState(false);

  const NewUserSchema = Yup.object().shape({
    password: Yup.string().required('Le mot de passe est obligatoire'),
    password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre'),
  });

  const defaultValues = useMemo(
    () => ({
      password: '',
      password_confirmation: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

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

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  const py = 7;
  // const py = true ? 11 : 7;
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: py, px: 3 }}>
            <Image src={userAvartar} alt="avatar" />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
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
              <RHFTextField
                name="password_confirmation"
                label="Confirmation du mot de passe"
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
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 20 }}>
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
                {/* </Grid> */}
                {/* <Grid item xs={6} md={4}> */}
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={() => {
                    // event ? handleSubmitToCreate() : handleSubmitToUpdate();
                  }}
                >
                  {isLoading ? (
                    <>
                      Changement du mot de passe de l'utilisateur...
                      <CircularProgress
                        size={14}
                        sx={{
                          color: '#fff',
                          marginLeft: 2,
                        }}
                      />
                    </>
                  ) : (
                    "Changer le mot de passe de l'utilisateur"
                  )}
                </Button>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
