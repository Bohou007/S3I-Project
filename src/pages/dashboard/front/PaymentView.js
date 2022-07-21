/* eslint-disable prefer-template */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

// @mui
import { Container, CircularProgress, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
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
import { AddLogs } from '../log/AddLogs';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function PaymentView() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

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

    AddLogs("a consulté la facture d'un de ces versements ayant pour reference " + paymentReference, user);

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
            { name: 'Tableau de bord', href: PATH_DASHBOARD.root },
            {
              name: 'Listes des versements',
              href: PATH_DASHBOARD.general.payment,
            },
            { name: invoice?.payment_reference || '' },
          ]}
        />
        {isGet ? (
          <Invoice invoice={invoice} customer={customer} program={program} user={user} />
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
