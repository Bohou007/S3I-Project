/* eslint-disable prefer-template */
import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { Dialog, ListItemButton, Stack, Typography, Button } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
import { InvoiceTableToolbarTx } from '../list';

// ----------------------------------------------------------------------

InvoiceAddressListDialog.propTypes = {
  addressOptions: PropTypes.array,
  dialogTitle: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
};

export default function InvoiceAddressListDialog({ open, dialogTitle, selected, onClose, onSelect, addressOptions }) {
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
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> {dialogTitle} </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <InvoiceTableToolbarTx filterName={filterName} onFilterName={handleFilterName} />
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {dataFiltered.map((address) => (
          <ListItemButton
            key={address.id}
            selected={selected(address.id)}
            onClick={() => handleSelect(address)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle2">{address.lastname + ' ' + address.firstname}</Typography>

            <Typography variant="caption" sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}>
              {address.customer_reference}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {address.email}
            </Typography>
          </ListItemButton>
        ))}
      </Scrollbar>
    </Dialog>
  );
}

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.customer_reference.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.firstname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.lastname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.phone_number.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return tableData;
}
