// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/tableau-de-bord';
const ROOTS_DASHBOARD_ADMIN = '/tableau-de-bord/admin';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  adminLogin: (role) => path(ROOTS_AUTH, `${role}/login`),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    booking: path(ROOTS_DASHBOARD, '/app'),
    deadlines: path(ROOTS_DASHBOARD, '/consulter-mes-echeances'),
    payment: path(ROOTS_DASHBOARD, '/consulter-mes-versements'),
    reservation: path(ROOTS_DASHBOARD, '/consulter-mes-reservations'),
  },

  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

// ------------------------------ Path Admins ------------------------------
export const PATH_DASHBOARD_ADMIN = {
  root: ROOTS_DASHBOARD_ADMIN,
  general: {
    dashboardAmin: path(ROOTS_DASHBOARD_ADMIN, '/app'),
    buildingPrograms: path(ROOTS_DASHBOARD_ADMIN, '/programmes-immobiliers'),
    userLists: path(ROOTS_DASHBOARD_ADMIN, '/listes-des-utilisateurs'),
    customerReservation: path(ROOTS_DASHBOARD_ADMIN, '/reservations'),
    // paymentList: path(ROOTS_DASHBOARD_ADMIN, '/suivi-des-versements'),
    // paymentAdd: path(ROOTS_DASHBOARD_ADMIN, '/suivi-des-versements/new'),
    // paymentView: (id) => path(ROOTS_DASHBOARD_ADMIN, `/suivi-des-versements/${id}`),
    // paymentEdit: (id) => path(ROOTS_DASHBOARD_ADMIN, `/suivi-des-versements/${id}/edit`),
  },
  payments: {
    root: path(ROOTS_DASHBOARD_ADMIN, '/payments'),
    paymentList: path(ROOTS_DASHBOARD_ADMIN, '/payments/suivi-des-versements'),
    // paymentAdd: path(ROOTS_DASHBOARD_ADMIN, '/payments/nouveau-versement'),
    paymentView: (id) => path(ROOTS_DASHBOARD_ADMIN, `/payments/${id}`),
    paymentEdit: (id) => path(ROOTS_DASHBOARD_ADMIN, `/payments/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD_ADMIN, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD_ADMIN, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },

  user: {
    root: path(ROOTS_DASHBOARD_ADMIN, '/user'),
    new: path(ROOTS_DASHBOARD_ADMIN, '/user/new'),
    list: path(ROOTS_DASHBOARD_ADMIN, '/user/list'),
    cards: path(ROOTS_DASHBOARD_ADMIN, '/user/cards'),
    profile: path(ROOTS_DASHBOARD_ADMIN, '/user/profile'),
    account: path(ROOTS_DASHBOARD_ADMIN, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD_ADMIN, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD_ADMIN, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD_ADMIN, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD_ADMIN, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD_ADMIN, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD_ADMIN, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD_ADMIN, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD_ADMIN, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD_ADMIN, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD_ADMIN, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD_ADMIN, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD_ADMIN, '/blog'),
    posts: path(ROOTS_DASHBOARD_ADMIN, '/blog/posts'),
    new: path(ROOTS_DASHBOARD_ADMIN, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD_ADMIN, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD_ADMIN, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
