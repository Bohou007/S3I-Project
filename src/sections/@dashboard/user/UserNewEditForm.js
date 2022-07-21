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

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  onSubmit: PropTypes.func,
  handleCloseModal: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default function UserNewEditForm({ isEdit, onSubmit, currentUser, handleCloseModal, isLoading }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [showPasswordField, setShowPasswordField] = useState(false);

  const NewUserSchema = Yup.object().shape({
    lastname: Yup.string().required('le nom de famille est obligatoire'),
    firstname: Yup.string().required('le prénom est obligatoire'),
    email: Yup.string().required("L'Email est obligatoire").email(),
    phone_number: Yup.string().required('Le numero de téléphone est obligatoire'),
    password: Yup.string().required('Le mot de passe est obligatoire'),
    password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre'),
    sexe: Yup.string().required('Le genre est obligatoire'),
    marital_status: Yup.string().required('Le status matrimonial est obligatoire'),
  });

  const defaultValues = useMemo(
    () => ({
      lastname: currentUser?.lastname || '',
      firstname: currentUser?.firstname || '',
      email: currentUser?.email || '',
      phone_number: currentUser?.phone_number || '',
      // customer_reference: currentUser?.customer_reference || '',
      password: currentUser?.password || '',
      password_confirmation: currentUser?.password || '',
      sexe: currentUser?.sexe || '',
      marital_status: currentUser?.marital_status || '',
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
    console.log('isEdit', isEdit);

    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

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
  const py = isEdit ? 11 : 7;
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
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="lastname" label="Nom de famille" />
              <RHFTextField name="firstname" label="Prenom(s)" />
              <RHFTextField name="phone_number" label="Numero de téléphone" />
              {/* <RHFTextField name="customer_reference" disabled label="Reference client" /> */}
              <RHFTextField name="email" label="Adresse Email" />

              {isEdit ? (
                <>
                  <RHFTextField
                    name="password"
                    label="Mot de passe"
                    type={showPasswordField ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPasswordField(!showPasswordField)} edge="end">
                            <Iconify icon={showPasswordField ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <RHFTextField
                    name="password_confirmation"
                    label="Confirmation du mot de passe"
                    type={showPasswordField ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPasswordField(!showPasswordField)} edge="end">
                            <Iconify icon={showPasswordField ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              ) : (
                ''
              )}

              <RHFSelect name="sexe" label="sexe" placeholder="sexe">
                <option value="" />
                <option value="M">MUSCULIN</option>
                <option value="F">FEMININ</option>
              </RHFSelect>

              <RHFSelect name="marital_status" label="Status matrimonial" placeholder="Status matrimonial">
                <option value="" />
                <option value="CELIBATAIRE">CELIBATAIRE</option>
                <option value="MARIE">MARIE</option>
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
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
                  disabled={isLoading}
                  onClick={() => {
                    // event ? handleSubmitToCreate() : handleSubmitToUpdate();
                  }}
                >
                  {isLoading ? (
                    <>
                      {isEdit ? " Création de l'utilisateur..." : 'Modification du de compte...'}
                      <CircularProgress
                        size={14}
                        sx={{
                          color: '#fff',
                          marginLeft: 2,
                        }}
                      />
                    </>
                  ) : isEdit ? (
                    "Creer l'utilisateur"
                  ) : (
                    ' Enregistrer les modifications'
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
