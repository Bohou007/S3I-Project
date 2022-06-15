import PropTypes from 'prop-types';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
import useToggle from '../../../../hooks/useToggle';
// _mock
import { _invoiceAddressFrom, _invoiceAddressTo } from '../../../../_mock';
// components
import Iconify from '../../../../components/Iconify';
//
import InvoiceAddressListDialog from './InvoiceAddressListDialog';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');

  const values = watch();

  const { toggle: openFrom, onOpen: onOpenFrom, onClose: onCloseFrom } = useToggle();

  const { toggle: openTo, onOpen: onOpenTo, onClose: onCloseTo } = useToggle();

  const { invoiceFrom, invoiceTo } = values;

  // console.log('values', values);

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'column' }}
      divider={
        <Divider
          flexItem
          orientation={upMd ? 'horizontal' : 'horizontal'}
          sx={{ borderStyle: 'dashed', borderWidth: 1, borderColor: '#000', opacity: 0.5 }}
        />
      }
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Information du client:
          </Typography>

          <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />} onClick={onOpenFrom}>
            Change
          </Button>

          <InvoiceAddressListDialog
            open={openFrom}
            dialogTitle="Selectionner le client"
            onClose={onCloseFrom}
            selected={(selectedId) => invoiceFrom?.id === selectedId}
            onSelect={(address) => setValue('invoiceFrom', address)}
            addressOptions={_invoiceAddressFrom}
          />
        </Stack>

        {invoiceFrom ? (
          <AddressInfo name={invoiceFrom.name} address={invoiceFrom.address} phone={invoiceFrom.phone} />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {errors.invoiceFrom ? errors.invoiceFrom.message : null}
          </Typography>
        )}
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Information du client:
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon={invoiceTo ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={onOpenTo}
          >
            {invoiceTo ? 'Modifier' : 'Ajouter'}
          </Button>

          <InvoiceAddressListDialog
            open={openTo}
            dialogTitle="Selectionner le client"
            onClose={onCloseTo}
            selected={(selectedId) => invoiceTo?.id === selectedId}
            onSelect={(address) => setValue('invoiceFrom', address)}
            addressOptions={_invoiceAddressFrom}
          />
        </Stack>

        {invoiceFrom ? (
          <AddressInfo name={invoiceFrom.name} address={invoiceFrom.address} phone={invoiceFrom.phone} />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {errors.invoiceFrom ? errors.invoiceFrom.message : null}
          </Typography>
        )}
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Programme Immobiliers
          </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon={invoiceTo ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={onOpenTo}
          >
            {invoiceTo ? 'Modifier' : 'Ajouter'}
          </Button>

          <InvoiceAddressListDialog
            open={openTo}
            dialogTitle="Selectionner le programme"
            onClose={onCloseTo}
            selected={(selectedId) => invoiceTo?.id === selectedId}
            onSelect={(address) => setValue('invoiceTo', address)}
            addressOptions={_invoiceAddressTo}
          />
        </Stack>

        {invoiceTo ? (
          <AddressInfo name={invoiceTo.name} address={invoiceTo.address} phone={invoiceTo.phone} />
        ) : (
          <Typography typography="caption" sx={{ color: 'error.main' }}>
            {errors.invoiceTo ? errors.invoiceTo.message : null}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

AddressInfo.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
};

function AddressInfo({ name, address, phone }) {
  return (
    <>
      <Typography variant="subtitle2">{name}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
        {address}
      </Typography>
      <Typography variant="body2">Phone: {phone}</Typography>
    </>
  );
}
