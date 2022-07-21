/* eslint-disable prefer-template */
/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
// @mui
import { Grid, Container, Stack, Button, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

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
import { SkeletonStat } from '../../../components/skeleton';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { AddLogs } from '../log/AddLogs';

// ----------------------------------------------------------------------

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = `${user.firstName} ${user.lastName}`;
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [countReservation, setCountReservation] = useState(0);
  const [countNoPayReservation, setCountNoPayReservation] = useState(0);
  const [countPayReservation, setCountPayReservation] = useState(0);
  const [totalReservationAmount, setTotalReservationAmount] = useState(0);
  const [totalAmountPay, setTotalAmountPay] = useState(0);
  const [isGet, setIsGet] = useState(false);

  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/booking/customer/${user?.customer_reference}`);
    const noPay = await axios.get(
      `/ws-booking-payment/booking/customer/${user?.customer_reference}/status/not-sold-out`
    );
    const pay = await axios.get(`/ws-booking-payment/booking/customer/${user?.customer_reference}/status/sold-out`);

    const totalAmountPayData = await axios.get(
      `/ws-booking-payment/booking/customer/${user?.customer_reference}/total_amount_paid`
    );
    const totalReservationAmountData = await axios.get(
      `/ws-booking-payment/booking/customer/${user?.customer_reference}/total_house_amount`
    );
    AddLogs('a consulté son tableau de bord', user);

    setCountReservation(response.data.length <= 9 ? '0' + response.data.length : response.data.length);
    setCountNoPayReservation(formatNumber(noPay.data.length));
    setCountPayReservation(formatNumber(pay.data.length));
    setReservation(response.data);
    setTotalReservationAmount(totalReservationAmountData.data);
    setTotalAmountPay(totalAmountPayData.data);
  }, []);

  const formatNumber = (number) => {
    const fmt = parseInt(number) <= 9 ? '0' + number : '0' + number;
    return fmt;
  };

  const statisticsAmount = (total, partial) => {
    // Calculate the percentage
    const percent = (partial / total) * 100;
    const percentRounded = Math.round(percent);
    return percentRounded > 0 ? percentRounded : 0;
  };

  setTimeout(() => {
    setIsGet(true);
  }, 1000);

  const allNavigate = (path) => {
    navigate(path);
  };
  const navidateLogement = () => {
    navigate(PATH_DASHBOARD.general.reservation);
  };
  const navidateVersement = () => {
    navigate(PATH_DASHBOARD.general.payment);
  };
  const navidateDeadline = () => {
    navigate(PATH_DASHBOARD.general.deadlines);
  };

  return (
    <Page title="Tableau de bord">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={displayName} />
          </Grid>

          {/* <Grid item xs={12} md={5}>
            <Stack spacing={1}>
              <AppWidget
                title="Montant versé"
                total={totalAmountPay}
                icon={'eva:credit-card-ffill'}
                color="warning"
                chartData={statisticsAmount(totalReservationAmount, totalAmountPay)}
                isGet={isGet}
              />
              <AppWidget
                title="Montant restant "
                total={totalReservationAmount - totalAmountPay}
                icon={'eva:person-ffill'}
                chartData={statisticsAmount(totalReservationAmount, totalReservationAmount - totalAmountPay)}
                isGet={isGet}
              />
            </Stack>
          </Grid> */}

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => allNavigate(PATH_DASHBOARD.general.reservation)}
            >
              <BookingWidgetSummary title="Logements totales" total={countReservation} icon={<BookingIllustration />} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => allNavigate(PATH_DASHBOARD.general.payment)}
            >
              <BookingWidgetSummary
                title="Logements soldées"
                total={countPayReservation}
                icon={<CheckInIllustration />}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => allNavigate(PATH_DASHBOARD.general.deadlines)}
            >
              <BookingWidgetSummary
                title="Logements non soldées"
                total={countNoPayReservation}
                icon={<CheckOutIllustration />}
              />
            </Box>
          </Grid>

          {/* <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Versements />
              </Grid>

              <Grid item xs={12} md={12}>
                <Echeances />
              </Grid>
            </Grid>
          </Grid> */}

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
