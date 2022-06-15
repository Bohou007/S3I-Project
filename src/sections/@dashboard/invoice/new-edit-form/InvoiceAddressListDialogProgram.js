/* eslint-disable prefer-template */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// @mui
import { Dialog, ListItemButton, Stack, Typography, Button } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
import { InvoiceTableToolbarTx } from '../list';

// ----------------------------------------------------------------------

InvoiceAddressListDialogProgram.propTypes = {
  addressOptions: PropTypes.array,
  dialogTitle: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  customer: PropTypes.object,
  selected: PropTypes.func,
};

export default function InvoiceAddressListDialogProgram({
  open,
  dialogTitle,
  selected,
  onClose,
  onSelect,
  addressOptions,
  customer,
}) {
  const handleSelect = (address) => {
    onSelect(address);
    onClose();
  };

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState(addressOptions);
  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const dataFiltered = applySortFilter({
    addressOptions,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  console.log('addressOptions', addressOptions);

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> {dialogTitle} </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <InvoiceTableToolbarTx filterName={filterName} onFilterName={handleFilterName} />
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {dataFiltered.map((program) => (
          <ListItemButton
            key={program.id}
            selected={selected(program.id)}
            onClick={() => handleSelect(program)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle2">{program.label + ' ' + program.formula}</Typography>
            {console.log('program.real_estate_program_type', program.real_estate_program_type)}
            <Typography variant="caption" sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}>
              <b>Type d'habitation</b>: {program.real_estate_program_type}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <b>Localisation</b>: {program.location}
            </Typography>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}

function applySortFilter({ addressOptions, comparator, filterName }) {
  const stabilizedThis = addressOptions.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  addressOptions = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    addressOptions = addressOptions.filter(
      (item) =>
        item.label.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.formula.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.real_estate_program_type.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.location.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      // item.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return addressOptions;
}
