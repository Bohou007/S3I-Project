import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { AddLogs } from '../../../pages/dashboard/log/AddLogs';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    login_id: Yup.string().required("L'adresse Mail ou le numéro de téléphone est requis."),
    password: Yup.string().required('Le mot de passe est requis.'),
  });

  const defaultValues = {
    login_id: '',
    password: '',
    remember: false,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await login(data.login_id, data.password);
      console.log('====================================');
      console.log('response', response.data.customer);
      console.log('====================================');
      const user = await {
        firstName: response.data.customer.firstname,
        id: response.data.customer.id,
        lastName: response.data.customer.lastname,
        role: 'CUSTOMER',
      };

      console.log('=================user===================');
      console.log('response', user);
      console.log('====================================');
      AddLogs("s'est connecté.", user);
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', {
          ...error,
          message: "L'adresse e-mail ou le numéro de téléphone et le mot de passe ne sont pas valides.",
        });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="login_id" label="Adresse email / Numéro de téléphone." />

        <RHFTextField
          name="password"
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Se souvenir de moi" />
        {/* <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Mot de passe oublié ?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Se connecter
      </LoadingButton>
    </FormProvider>
  );
}
