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
  TextField,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import {
  FormProvider,
  RHFSelect12,
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFTextFieldSomme,
} from '../../../components/hook-form';
import userAvartar from '../../../assets/images/userAvatar.png';
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

VersementNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  paid: PropTypes.object,
  onSubmit: PropTypes.func,
  handleCloseModal: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default function VersementNewEditForm({ isEdit, onSubmit, paid, handleCloseModal, isLoading }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    payment_method: Yup.string().required('Le lot est obligatoire'),
    bank: Yup.string().required('Le Ilot est obligatoire'),
    input_payment_reference: Yup.string().required('Le mode de financement est obligatoire'),
    amount: Yup.string().required('Le prix de vente du logement est obligatoire'),
    payment_goal: Yup.string().required('Le prix de vente du logement est obligatoire'),
  });

  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };

  const defaultValues = useMemo(
    () => ({
      payment_method: paid?.payment_method || '',
      bank: paid?.bank || '',
      input_payment_reference: paid?.input_payment_reference || '',
      amount: paid.amount ? sepMillier(paid.amount) : '',
      payment_goal: paid?.payment_goal || '',
    }),
    [paid]
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

    if (isEdit && paid) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, paid]);

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
  const handleClick = (data) => {
    const content = data.target.value;
    if (content === 'ESPECE') {
      setMode(false);
    } else {
      setMode(true);
    }
  };
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
              <RHFTextField name="payment_method" label="Methode de paiement" />
              <RHFSelect12
                name="payment_method"
                label="Methode de paiement"
                placeholder="Methode de paiement"
                handleClick={handleClick}
              >
                <option value="" />
                <option value="CHEQUE">CHEQUE</option>
                <option value="VIREMENT">VIREMENT</option>
                <option value="ESPECE">ESPECE</option>
              </RHFSelect12>

              {mode === true ? <RHFTextField name="bank" label="Banque" /> : ''}
              <RHFTextFieldSomme name="amount" isSomme={'true'} label="Montant payer" />
              <RHFTextField name="input_payment_reference" label="Reference de paiement" />

              <RHFSelect name="payment_goal" label="Type de paiement" placeholder="Type de paiement">
                <option value="" />
                <option value="BOOKING-SCHEDULE">Paiement d'échéance</option>
                <option value="BOOKING-FEES">Frais de réservation</option>
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

                <Button variant="contained" disabled={isLoading} type="submit" color="primary">
                  {isLoading ? (
                    <>
                      {isEdit ? ' Enregistrement du versement...' : 'Modification du versement...'}
                      <CircularProgress
                        size={14}
                        sx={{
                          color: '#fff',
                          marginLeft: 2,
                        }}
                      />
                    </>
                  ) : isEdit ? (
                    'Enregistrer le versement'
                  ) : (
                    ' Enregistrer le versement'
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
