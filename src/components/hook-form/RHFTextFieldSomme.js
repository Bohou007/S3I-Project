import PropTypes from 'prop-types';
import numeral from 'numeral';

// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextFieldSomme.propTypes = {
  name: PropTypes.string,
  isSomme: PropTypes.bool,
};

export default function RHFTextFieldSomme({ name, isSomme, ...other }) {
  const { control } = useFormContext();
  const sepMillier = (number) => {
    const Primenumeral = numeral(number).format(+0, 0);
    return Primenumeral.replace(/[,]+/g, ' ');
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          ref={field.ref}
          value={isSomme && field.value ? sepMillier(field.value) : field.value}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
