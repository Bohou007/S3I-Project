// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

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
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Tableau de bord', path: PATH_DASHBOARD.general.booking, icon: ICONS.dashboard },
      { title: 'Consulter mes logements', path: PATH_DASHBOARD.general.reservation, icon: ICONS.banking },
      { title: 'Consulter mes versements', path: PATH_DASHBOARD.general.payment, icon: ICONS.invoice },
      { title: 'Consulter mes échéances', path: PATH_DASHBOARD.general.deadlines, icon: ICONS.analytics },
      { title: 'Gérer mon compte', path: PATH_DASHBOARD.user.account, icon: ICONS.user },
    ],
  },
];

export default navConfig;
