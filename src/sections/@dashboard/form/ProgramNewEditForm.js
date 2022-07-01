/* eslint-disable no-nested-ternary */
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
import onCreateEdit from '../../../assets/images/onCreateEdit.png';
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

ProgramNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  program: PropTypes.object,
  onSubmit: PropTypes.func,
  handleCloseModal: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default function ProgramNewEditForm({ isEdit, onSubmit, handleCloseModal, isLoading, program }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [showPasswordField, setShowPasswordField] = useState(false);

  const NewUserSchema = Yup.object().shape({
    label: Yup.string().required('Le nom du programme est obligatoire'),
    real_estate_program_type: Yup.string().required("Le type d'habitation est obligatoire"),
    formula: Yup.string().required('La formule est obligatoire'),
    location: Yup.string().required('La localisation est obligatoire'),
  });

  const defaultValues = useMemo(
    () => ({
      label: program?.label || '',
      real_estate_program_type: program?.real_estate_program_type || '',
      formula: program?.formula || '',
      location: program?.location || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [program]
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
    if (isEdit && program) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, program]);

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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Image src={onCreateEdit} alt="avatar" />
          </Card>
        </Grid> */}

        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'table-row',
                columnGap: 1,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="label" label="Nom du programme" sx={{ mb: 2 }} />
              <RHFTextField name="formula" label="Formule" sx={{ mb: 2 }} />
              <RHFTextField name="real_estate_program_type" label="Type d'habitation" sx={{ mb: 2 }} />
              <RHFTextField name="location" label="Localisation" sx={{ mb: 1 }} />
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
                  onClick={() => {
                    // event ? handleSubmitToCreate() : handleSubmitToUpdate();
                  }}
                >
                  {isLoading ? (
                    <>
                      {isEdit ? ' Enregistrement du programme...' : 'Modification du programme...'}
                      <CircularProgress
                        size={14}
                        sx={{
                          color: '#fff',
                          marginLeft: 2,
                        }}
                      />
                    </>
                  ) : isEdit ? (
                    'Enregistrer le programme immobilier'
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
