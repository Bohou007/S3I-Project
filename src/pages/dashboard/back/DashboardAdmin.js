// @mui
import { Grid, Container, Stack } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
// sections
import {
  BookingDetails,
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

// ----------------------------------------------------------------------

export default function DashboardAdmin() {
  const { user } = useAuth();
  const displayName = `${user.firstName} ${user.lastName}`;
  const { themeStretch } = useSettings();

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
            <BookingWidgetSummary title="Réservations totales" total={710} icon={<BookingIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Réservations soldées" total={210} icon={<CheckInIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Réservations non soldées" total={300} icon={<CheckOutIllustration />} />
          </Grid>

          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <BookingDetails />
              </Grid>

              <Grid item xs={12} md={12}>
                <BookingDetails />
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
