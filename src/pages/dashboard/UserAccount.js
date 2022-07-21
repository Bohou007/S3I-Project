/* eslint-disable import/named */
import { capitalCase } from 'change-case';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountNotifications,
  AccountChangePassword,
} from '../../sections/@dashboard/user/account';
import { AnalyticsOrderTimeline, AnalyticsNewsUpdate } from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('mon_profil');

  const ACCOUNT_TABS = [
    {
      value: 'mon_profil',
      label: 'Mon profil',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: 'mon_mot_de_passe',
      label: 'Mon mot de passe',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
    // {
    //   value: 'log_activity',
    //   label: "Historique d'activité",
    //   icon: <Iconify icon={'eva:activity-outline'} width={20} height={20} />,
    //   component: <AnalyticsOrderTimeline roles={'CUSTOMER'} />,
    // },
  ];

  return (
    <Page title="Mon compte">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Mon compte"
          links={[{ name: 'Tableau de bord', href: PATH_DASHBOARD.root }, { name: 'Mon compte' }]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
