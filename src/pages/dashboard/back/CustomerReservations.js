// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { BlogNewPostForm } from '../../../sections/@dashboard/blog';

// ----------------------------------------------------------------------

export default function CustomerReservations() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Reservations">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Reservations"
          links={[{ name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root }, { name: 'Reservations' }]}
        />

        <h1>Reservations</h1>
      </Container>
    </Page>
  );
}
