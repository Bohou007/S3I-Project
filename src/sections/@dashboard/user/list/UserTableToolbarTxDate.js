import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Input } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

// components

import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

UserTableToolbarTxDate.propTypes = {
  filterDate: PropTypes.any,
  onFilterDate: PropTypes.func,
};

export default function UserTableToolbarTxDate({ filterDate, onFilterDate }) {
  return (
    <DatePicker
      label="Date Echeance"
      value={filterDate}
      onChange={(newValue) => {
        onFilterDate(newValue);
      }}
      renderInput={(params) => <TextField fullWidth {...params} />}
    />
  );
}
