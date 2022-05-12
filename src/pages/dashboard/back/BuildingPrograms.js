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

export default function BuildingPrograms() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Programmes immobiliers">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Programmes immobiliers"
          links={[{ name: 'Tableau de bord', href: PATH_DASHBOARD_ADMIN.root }, { name: 'Programmes immobiliers' }]}
        />

        <h1>Programmes immobiliers</h1>
      </Container>
    </Page>
  );
}
