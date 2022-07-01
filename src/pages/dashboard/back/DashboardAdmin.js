/* eslint-disable import/order */
/* eslint-disable react-hooks/exhaustive-deps */
// @mui
import { Grid, Container, Stack } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
import { useEffect, useState } from 'react';

// components
import Page from '../../../components/Page';
// sections
import {
  VersementsAdmin,
  BookingAdmin,
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

export default function DashboardAdmin() {
  const { user } = useAuth();
  const displayName = `${user.firstName} ${user.lastName}`;
  const { themeStretch } = useSettings();

  const [bookings, setBookings] = useState([]);

  const [totalBooked, setTotalBooked] = useState(0);
  const [totalCheckIn, setTotalCheckIn] = useState(0);
  const [totalCheckOut, setTotalCheckOut] = useState(0);

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/booking`);
    const responseCheckIN = await axios.get(`/ws-booking-payment/booking/status/not-sold-out`);
    const responseCheckOUT = await axios.get(`/ws-booking-payment/booking/status/sold-out`);

    setTotalBooked(response.data.length);
    setTotalCheckIn(responseCheckIN.data.length);
    setTotalCheckOut(responseCheckOUT.data.length);
  }, []);

  return (
    <Page title="Tableau de bord">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={displayName} />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <AppWidget title="Montant verser" total={38566} chartData={48} />
              <AppWidget title="Montant restant" total={55566} color="warning" chartData={75} />
            </Stack>
          </Grid> */}

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Réservations totales" total={totalBooked} icon={<BookingIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Réservations soldées" total={totalCheckOut} icon={<CheckInIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Réservations non soldées"
              total={totalCheckIn}
              icon={<CheckOutIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <BookingAdmin />
              </Grid>

              <Grid item xs={12} md={12}>
                <VersementsAdmin />
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
