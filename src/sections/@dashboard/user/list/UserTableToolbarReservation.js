import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Input } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

// components

import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

UserTableToolbarReservation.propTypes = {
  filterName: PropTypes.string,
  filterProgramme: PropTypes.string,
  filterDate: PropTypes.any,
  onFilterName: PropTypes.func,
  onFilterProgramme: PropTypes.func,
  onFilterDate: PropTypes.func,
  optionsProgrmme: PropTypes.arrayOf(PropTypes.string),
};

export default function UserTableToolbarReservation({
  filterName,
  filterProgramme,
  filterDate,
  onFilterName,
  onFilterProgramme,
  onFilterDate,
  optionsProgrmme,
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label="Programmes"
        value={filterProgramme}
        onChange={onFilterProgramme}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          // maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        <MenuItem
          value={'all'}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
          }}
        >
          All
        </MenuItem>
        {optionsProgrmme.map((option) => (
          <MenuItem
            key={option.real_estate_program_reference}
            value={option.real_estate_program_reference}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label} {option.formula}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label="Recherchez par date de fin de paiement."
        value={filterDate}
        onChange={(newValue) => {
          onFilterDate(newValue);
        }}
        renderInput={(params) => <TextField fullWidth {...params} />}
      />

      {/* <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Recherche le client..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      /> */}
    </Stack>
  );
}
