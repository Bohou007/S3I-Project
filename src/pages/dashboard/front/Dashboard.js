/* eslint-disable prefer-template */
/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
// @mui
import { Grid, Container, Stack } from '@mui/material';
import { useState, useEffect } from 'react';

// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
// sections
import {
  BookingDetails,
  Versements,
  Echeances,
  BookingBookedRoom,
  BookingTotalIncomes,
  BookingRoomAvailable,
  BookingNewestBooking,
  BookingWidgetSummary,
  BookingCheckInWidgets,
  BookingCustomerReviews,
  BookingReservationStats,
} from '../../../sections/@dashboard/general/booking';
// assets
import { BookingIllustration, CheckInIllustration, CheckOutIllustration } from '../../../assets';
import { AppFeatured, AppWelcome, AppWidget } from '../../../sections/@dashboard/general/app';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = `${user.firstName} ${user.lastName}`;
  const { themeStretch } = useSettings();

  const [reservation, setReservation] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [countReservation, setCountReservation] = useState(0);
  const [countNoPayReservation, setCountNoPayReservation] = useState(0);
  const [countPayReservation, setCountPayReservation] = useState(0);

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/booking/customer/${user?.customer_reference}`);

    const noPay = await axios.get(
      `/ws-booking-payment/booking/customer/${user?.customer_reference}/status/not-sold-out`
    );
    const pay = await axios.get(`/ws-booking-payment/booking/customer/${user?.customer_reference}/status/sold-out`);
    setCountReservation(response.data.length <= 9 ? '0' + response.data.length : response.data.length);
    setCountNoPayReservation(formatNumber(noPay.data.length));
    setCountPayReservation(formatNumber(pay.data.length));
    setReservation(response.data);
  }, []);

  const formatNumber = (number) => {
    const fmt = parseInt(number) <= 9 ? '0' + number : '0' + number;
    return fmt;
  };

  return (
    <Page title="Tableau de bord">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={displayName} />
          </Grid>

          {/* <Grid item xs={12} md={4}> */}
          {/* <Stack spacing={1}>
              <AppWidget
                title="Montant verser"
                total={55566}
                icon={'eva:credit-card-fill'}
                color="warning"
                chartData={75}
              />
              <AppWidget
                title="Montant restant "
                total={38566}
                icon={'eva:person-ffill'} $``
                chartData={48}
              />
            </Stack> */}
          {/* <BookingCheckInWidgets /> */}
          {/* <AppFeatured /> */}
          {/* </Grid> */}

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Réservations totales"
              total={countReservation}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Réservations soldées"
              total={countPayReservation}
              icon={<CheckInIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Réservations non soldées"
              total={countNoPayReservation}
              icon={<CheckOutIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Versements />
              </Grid>

              <Grid item xs={12} md={12}>
                <Echeances />
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <BookingRoomAvailable />
          </Grid> */}

          {/* <Grid item xs={12} md={8}>
            <BookingReservationStats />
          </Grid> */}

          {/* <Grid item xs={12} md={4}>
            <BookingCustomerReviews />
          </Grid> */}

          {/* <Grid item xs={12}>
            <BookingNewestBooking />
          </Grid> */}
          {/* 
          <Grid item xs={12}>
            <BookingDetails />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
