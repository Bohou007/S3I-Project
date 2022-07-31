// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_ADMIN } from '../../../routes/paths';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// get another icon
const getIcon2 = (name) => <Iconify icon={name} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  userLists: getIcon('ic_lists_users'),
};

const navConfigAdmin = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'Tableau de bord',
        path: PATH_DASHBOARD_ADMIN.general.dashboardAmin,
        icon: ICONS.dashboard,
      },
      {
        title: 'Programmes immobiliers',
        path: PATH_DASHBOARD_ADMIN.general.buildingPrograms,
        icon: ICONS.kanban,
      },
      {
        title: 'Logements',
        path: PATH_DASHBOARD_ADMIN.general.customerReservation,
        icon: ICONS.banking,
      },
      {
        title: 'Suivi des versements',
        path: PATH_DASHBOARD_ADMIN.payments.paymentList,
        icon: ICONS.invoice,
      },
      {
        title: 'Listes des clients',
        path: PATH_DASHBOARD_ADMIN.general.userLists,
        icon: ICONS.userLists,
      },
      {
        title: 'Gérer mon compte',
        path: PATH_DASHBOARD_ADMIN.user.account,
        icon: ICONS.user,
      },
    ],
  },
];

export default navConfigAdmin;
