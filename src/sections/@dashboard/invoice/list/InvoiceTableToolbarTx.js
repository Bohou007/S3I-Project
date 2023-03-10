import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

InvoiceTableToolbarTx.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function InvoiceTableToolbarTx({ filterName, onFilterName }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ width: '100%' }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Recherchez par nom, code, tel ou email..."
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
