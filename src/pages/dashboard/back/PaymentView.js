/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

// @mui
import { Container, CircularProgress, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
// _mock_
import { _invoices } from '../../../_mock';
import axios from '../../../utils/axios';

// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../../sections/@dashboard/invoice/details';

// ----------------------------------------------------------------------

export default function PaymentView() {
  const { themeStretch } = useSettings();

  const { paymentReference } = useParams();

  const [invoice, setInvoice] = useState('');
  const [customer, setCustomer] = useState('');
  const [program, setProgram] = useState('');
  const [isGet, setIsGet] = useState(false);

  // useEffect react
  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/payment/${paymentReference}`);
    const authData = await axios.get(`/ws-booking-payment/customer/${response.data.customer_reference}`);
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/${response.data.real_estate_program_reference}`
    );

    setProgram(programData.data);
    setCustomer(authData.data);
    setInvoice(response.data);
    // if (response.status === 200) {
    //   setIsGet(true);
    // }

    setTimeout(() => {
      setIsGet(true);
    }, 3000);
  }, []);

  // const invoicehh = _invoices.find((invoice) => invoice.id === id);

  return (
    <Page title="Facture">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Détails de la facture"
          links={[
            { name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root },
            {
              name: 'Suivi des versements',
              href: PATH_DASHBOARD_ADMIN.payments.paymentList,
            },
            { name: invoice?.payment_reference || '' },
          ]}
        />
        {isGet ? (
          <Invoice invoice={invoice} customer={customer} program={program} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              direction: 'row',
              minHeight: '60vh',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Page>
  );
}
