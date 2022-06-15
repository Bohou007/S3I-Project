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

InvoiceAddressListDialogBooking.propTypes = {
  addressOptions: PropTypes.array,
  customer: PropTypes.object,
  program: PropTypes.object,
  dialogTitle: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
};

export default function InvoiceAddressListDialogBooking({
  open,
  dialogTitle,
  customer,
  program,
  selected,
  onClose,
  onSelect,
  addressOptions,
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

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <Typography variant="h6"> {dialogTitle} </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
        <InvoiceTableToolbarTx filterName={filterName} onFilterName={handleFilterName} />
      </Stack>

      <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
        {dataFiltered.map((booking) => (
          <ListItemButton
            key={booking.id}
            selected={selected(booking.id)}
            onClick={() => handleSelect(booking)}
            sx={{
              p: 1.5,
              borderRadius: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle2">{booking.booking_reference}</Typography>

            <Typography variant="caption" sx={{ color: 'primary.main', my: 0.5, fontWeight: 'fontWeightMedium' }}>
              <b>Lot</b>: {booking.lot}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <b>Sous-lot</b>: {booking.sub_lot}
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
        item.booking_reference.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.lot.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.sub_lot.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return addressOptions;
}
