import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Input } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

// components

import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

UserTableToolbarAdminTx.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserTableToolbarAdminTx({ filterName, onFilterName }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Recherche le programme..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
