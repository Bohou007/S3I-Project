import PropTypes from 'prop-types';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../../../sections/@dashboard/invoice/new-edit-form';

// ----------------------------------------------------------------------
AddPayment.propTypes = {
  handleCloseModal: PropTypes.func,
};

export default function AddPayment({ handleCloseModal }) {
  const { themeStretch } = useSettings();

  return (
    <Page title="Nouveau versement">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Nouveau versement"
          links={[
            { name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root },
            { name: 'Suivi des versements', href: PATH_DASHBOARD_ADMIN.payments.paymentList },
            { name: 'Nouveau versement' },
          ]}
        />

        <InvoiceNewEditForm handleCloseModal={handleCloseModal} />
      </Container>
    </Page>
  );
}
