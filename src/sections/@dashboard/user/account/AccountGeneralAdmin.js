/* eslint-disable no-unneeded-ternary */
import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import Image from '../../../../components/Image';
import userAvartar from '../../../../assets/images/userAvatar.png';
import { HOST_API } from '../../../../config';
// ----------------------------------------------------------------------
const initialState = {
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { user } = action.payload;
    console.log('state', user);
    return {
      ...state,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    user: null,
  }),
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

export default function AccountGeneralAdmin() {
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { user } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    firstname: Yup.string().required('Votre nom est requis'),
    lastname: Yup.string().required('Vos prenoms sont requisent'),
  });

  const defaultValues = {
    firstname: user?.firstName || '',
    lastname: user?.lastName || '',
    email: user?.email || '',
    // phoneNumber: user?.phoneNumber || '',
    role: user?.role || '',
    // isPublic: user?.isPublic || false,
  };

  const userId = user?.id;

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axios
        .put(`${HOST_API}/ws-booking-payment/customer/${user?.customer_reference}`, data)
        .then((res) => {
          // dispatch({ type: 'LOGOUT' });
          const user = {
            id: userId,
            email: data.email,
            lastName: data.lastname,
            firstName: data.firstname,
            role: data.role,
            // phoneNumber: data.phoneNumber,
          };

          dispatch({
            type: 'INITIALIZE',
            payload: {
              user,
            },
          });
          enqueueSnackbar('Vos informations ont été mise à jour', { variant: 'success' });
          setTimeout(() => {
            window.location.reload(true);
          }, 1500);
        })
        .catch((err) => {
          console.log('err', err.message);
          enqueueSnackbar('Une erreur est survenue', { variant: 'error' });
        });

      // console.log(data);
      // enqueueSnackbar('Update success!');
    } catch (error) {
      console.log('err', error.message);
      enqueueSnackbar('Une erreur est survenue', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider
      methods={methods}
      // onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 3, px: 3, textAlign: 'center', height: 324 }}>
            <Image src={userAvartar} alt="avatar" />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="firstname" label="Nom" />
              <RHFTextField name="lastname" label="Prenoms" />
              <RHFTextField name="email" label="Adresse Email" disabled sx={{ backgroundColor: '#f9f9f9' }} />
              {/* <RHFTextField
                name="phoneNumber"
                label="Numero de telephone"
                disabled={user.phoneNumber == null ? false : true}
                sx={{ backgroundColor: '#f9f9f9' }}
              /> */}
              <RHFTextField name="role" label="Role" disabled sx={{ backgroundColor: '#f9f9f9' }} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 13 }}>
              <LoadingButton type="submit" variant="contained" disabled loading={isSubmitting}>
                Modifier mon compte
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
