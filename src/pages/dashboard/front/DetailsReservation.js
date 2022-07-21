/* eslint-disable prefer-template */
/* eslint-disable react-hooks/exhaustive-deps */
import { capitalCase } from 'change-case';
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
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
import { AddLogs } from '../log/AddLogs';

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

export default function DetailsReservation() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  console.log('================pathname====================');
  console.log(pathname);
  console.log('====================================');

  const { user } = useAuth();
  const { bookingReference } = useParams();

  const { currentTab, onChangeTab } = useTabs('details');
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
    AddLogs('a consulté les details de son logement ayant pour référence ' + bookingReference, user);

    setGalleries(galleriesData.data);
    if (galleriesData.status === 200) {
      setIsGet(true);
    }
    // setTimeout(() => {
    //   setIsGet(true);
    // }, 3000);
  }, []);

  const handleFindFriends = (value) => {
    setFindFriends(value);
  };

  const PROFILE_TABS = [
    {
      value: 'details',
      label: 'Détails',
      icon: <Iconify icon={'eva:info-outline'} width={20} height={20} />,
      component: <IndexBooking program={program} detailRow={book} customer={'true'} />,
    },
    // {
    //   value: 'profile',
    //   icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
    //   component: <Profile myProfile={_userAbout} posts={_userFeeds} />,
    // },
    // {
    //   value: 'friends',
    //   icon: <Iconify icon={'eva:people-fill'} width={20} height={20} />,
    //   component: <ProfileFriends friends={_userFriends} findFriends={findFriends} onFindFriends={handleFindFriends} />,
    // },
    {
      value: 'galerie',
      label: "Etat d'avancement",
      icon: <Iconify icon={'ic:round-perm-media'} width={20} height={20} />,
      component: (
        <ProfileGallery detailRow={book} gallery={galleries} user={user} bookingReference={bookingReference} />
      ),
    },
  ];

  return (
    <Page title="Consulter les details de mon logement">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Details de mon logement"
          links={[
            { name: 'Tableau de bord', href: PATH_DASHBOARD.root },
            { name: 'Listes de mes logements', href: PATH_DASHBOARD.general.reservation },
            { name: 'Détails de mon logement' },
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
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
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
