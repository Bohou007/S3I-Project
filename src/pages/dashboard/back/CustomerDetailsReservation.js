/* eslint-disable react-hooks/exhaustive-deps */
import { capitalCase } from 'change-case';
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
// _mock_
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../../_mock';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
// import { Profile, ProfileCover, ProfileFriends, ProfileFollowers } from '../../../sections/@dashboard/user/profile';
import IndexBooking from '../IndexBooking';
import ProfileGallery from '../ProfileGallery';
import axios from '../../../utils/axios';
import UserInfo from '../UserInfo';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(3),
    // paddingBottom: theme.spacing(3),
    // paddingTop: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

export default function CustomerDetailsReservation() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  console.log('================pathname====================');
  console.log(pathname);
  console.log('====================================');

  const { user } = useAuth();
  const { bookingReference } = useParams();

  const { currentTab, onChangeTab } = useTabs('profile');
  const [customer, setCustomer] = useState({});

  const [program, setProgram] = useState({});
  const [book, setBook] = useState({});
  const [galleries, setGalleries] = useState([]);

  const [isGet, setIsGet] = useState(false);

  const [findFriends, setFindFriends] = useState('');

  // useEffect react
  useEffect(async () => {
    const response = await axios.get(`/ws-booking-payment/booking/${bookingReference}`);
    setBook(response.data);
    const programData = await axios.get(
      `/ws-booking-payment/real-estate-program/${response.data.real_estate_programe_reference}`
    );
    setProgram(programData.data);

    const galleriesData = await axios.get(`ws-booking-payment/image/booking/${bookingReference}`);

    setGalleries(galleriesData.data);
    if (galleriesData.status === 200) {
      setIsGet(true);
    }

    const user = await axios.get(`/ws-booking-payment/customer/${response.data.customer_reference}`);
    setCustomer(user.data);
    // setTimeout(() => {
    //   setIsGet(true);
    // }, 3000);
  }, []);

  const handleFindFriends = (value) => {
    setFindFriends(value);
  };

  const PROFILE_TABS = [
    {
      value: 'profile',
      icon: <Iconify icon={'eva:person-outline'} width={20} height={20} />,
      component: <UserInfo customer={customer} />,
    },
    {
      value: 'details de la reservation',
      icon: <Iconify icon={'eva:info-outline'} width={20} height={20} />,
      component: <IndexBooking program={program} detailRow={book} />,
    },
    {
      value: 'galerie',
      icon: <Iconify icon={'ic:round-perm-media'} width={20} height={20} />,
      component: <ProfileGallery gallery={galleries} user={user} isGet={isGet} detailRow={book} />,
    },
  ];

  return (
    <Page title="Détails de la réservation">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Détails de la réservation"
          links={[
            { name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root },
            { name: 'Listes des reservation', href: PATH_DASHBOARD_ADMIN.general.customerReservation },
            { name: 'Détails de la réservation' },
          ]}
        />
        <Card
          sx={{
            mb: 2,
            height: 60,
            position: 'relative',
          }}
        >
          {/* <ProfileCover myProfile={_userAbout} /> */}

          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
