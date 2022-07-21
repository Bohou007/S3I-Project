/* eslint-disable import/named */
/* eslint-disable no-unneeded-ternary */
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
import numeral from 'numeral';

// @mui
import { DatePicker, LoadingButton } from '@mui/lab';
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
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFTextFieldSomme } from '../../../components/hook-form';
import userAvartar from '../../../assets/images/userAvatar.png';
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

BookingNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  booking: PropTypes.object,
  onSubmit: PropTypes.func,
  handleEndDate: PropTypes.func,
  handleStartDate: PropTypes.func,
  handleCloseModal: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  isLoading: PropTypes.bool,
};

export default function BookingNewEditForm({
  isEdit,
  onSubmit,
  booking,
  handleStartDate,
  startDate,
  endDate,
  handleEndDate,
  handleCloseModal,
  isLoading,
}) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    lot: Yup.string().required('Le lot est obligatoire'),
    sub_lot: Yup.string().required('Le Ilot est obligatoire'),
    financing_method: Yup.string().required('Le mode de financement est obligatoire'),
    additional_land: Yup.string(),
    additional_land_amount: Yup.string(),
    additional_fence: Yup.string(),
    additional_fence_amount: Yup.string(),
    purchase_amount: Yup.string().required('Le prix de vente du logement est obligatoire'),
    initial_contribution: Yup.string().required("L'apport initial est obligatoire"),
    application_fees: Yup.string().required('Les frais de dossier sont obligatoire'),
    booking_fees: Yup.string().required('Les frais de réservation sont obligatoire'),
    booking_fees_paid: Yup.string(),
  });

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  const defaultValues = useMemo(
    () => ({
      lot: booking?.lot || '',
      sub_lot: booking?.sub_lot || '',
      financing_method: booking?.financing_method || '',
      additional_land: booking?.additional_land >= 0 ? booking?.additional_land : '',
      additional_land_amount: booking.additional_land_amount ? sepMillier(booking.additional_land_amount) : '',
      additional_fence: booking?.additional_fence >= 0 ? booking?.additional_fence : '',
      additional_fence_amount: booking.additional_fence_amount ? sepMillier(booking.additional_fence_amount) : '',
      purchase_amount: booking.purchase_amount ? sepMillier(booking.purchase_amount) : '',
      initial_contribution: booking.initial_contribution ? sepMillier(booking.initial_contribution) : '',
      application_fees: booking.application_fees ? sepMillier(booking.application_fees) : '',
      booking_fees: booking.booking_fees ? sepMillier(booking.booking_fees) : '',
      booking_fees_paid:
        booking.booking_fees - booking.booking_fees_due >= 0
          ? sepMillier(booking.booking_fees - booking.booking_fees_due)
          : '',
    }),
    [booking]
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

    if (isEdit && booking) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, booking]);

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
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="lot" label="Lot" />
              <RHFTextField name="sub_lot" label="ILot" />
              <RHFTextField name="financing_method" label="Mode de financement" />
              <RHFTextFieldSomme name="purchase_amount" isSomme={'true'} label="Prix de vente du logement" />

              <RHFTextFieldSomme name="initial_contribution" isSomme={'true'} label="Apport initial" />

              <RHFTextFieldSomme name="application_fees" isSomme={'true'} label="Frais de dossier" />

              <RHFTextField name="additional_land" label="Terrain supplémentaires (m²)" />
              <RHFTextFieldSomme
                name="additional_land_amount"
                isSomme={'true'}
                label="Coût du terrain supplémentaire"
              />

              <RHFTextField name="additional_fence" label="Clôture supplémentaire (m²)" />
              <RHFTextFieldSomme
                name="additional_fence_amount"
                isSomme={'true'}
                label="Coût de la clôture supplémentaire"
              />

              <RHFTextFieldSomme name="booking_fees" isSomme={'true'} label="Frais de réservation" />
              <RHFTextFieldSomme name="booking_fees_paid" isSomme={'true'} label="Frais de réservation payé" />

              {/* <RHFTextField name="house_amount" label="Montant total de la maison" /> */}
              {/* <RHFTextField name="balance_due" label="Solde dû" /> */}

              <DatePicker
                label="Date de début de paiement"
                value={startDate ? startDate : ''}
                onChange={(newValue) => {
                  handleStartDate(newValue);
                }}
                renderInput={(params) => <RHFTextField fullWidth {...params} />}
              />
              <DatePicker
                label="Date de fin de paiement"
                value={endDate ? endDate : ''}
                onChange={(newValue) => {
                  handleEndDate(newValue);
                }}
                renderInput={(params) => <RHFTextField fullWidth {...params} />}
              />
              {/* <DatePicker
                label="Date de début de paiement"
                value={startDate ? startDate : ''}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => <RHFTextField fullWidth {...params} />}
              />
              <DatePicker
                label="Date de fin de paiement"
                value={endDate ? endDate : ''}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                renderInput={(params) => <RHFTextField fullWidth {...params} />}
              /> */}
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
                      {isEdit ? ' Enregistrement de la reservation...' : 'Modification de la reservation...'}
                      <CircularProgress
                        size={14}
                        sx={{
                          color: '#fff',
                          marginLeft: 2,
                        }}
                      />
                    </>
                  ) : isEdit ? (
                    'Enregistrer la reservation'
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
