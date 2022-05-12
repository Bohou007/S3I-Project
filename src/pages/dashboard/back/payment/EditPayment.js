import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// _mock_
import { _invoices } from '../../../../_mock';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../../../sections/@dashboard/invoice/new-edit-form';

// ----------------------------------------------------------------------

export default function EditPayment() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <Page title="Modification de versement">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Modification de versemen"
          links={[
            { name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root },
            { name: 'Suivi des versements', href: PATH_DASHBOARD_ADMIN.payments.paymentList },
            { name: currentInvoice?.invoiceNumber || '' },
          ]}
        />

        <InvoiceNewEditForm isEdit currentInvoice={currentInvoice} />
      </Container>
    </Page>
  );
}
