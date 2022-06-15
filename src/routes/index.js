import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation, use } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
import LoadingScreen from '../components/LoadingScreen';

// config
import { PATH_AFTER_LOGIN, PATH_AFTER_LOGIN_ADMIN } from '../config';

// import '../utils/ensureBasename';

// components
// --------
console.log(localStorage.getItem('accessToken'));
// --------
const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/tableau-de-bord')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="auth/login" replace />,
    },
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'admin/login', element: <LoginAdmin /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes USER
    {
      path: 'tableau-de-bord',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'app',
          element: <Dashboard />,
        },
        { path: 'consulter-mes-echeances', element: <Deadlines /> },
        {
          path: 'consulter-mes-versements',
          children: [
            { element: <Navigate to="/tableau-de-bord/consulter-mes-versements/listes" replace />, index: true },
            { path: 'listes', element: <Payment /> },
            { path: ':paymentReference', element: <PaymentView /> },
          ],
        },

        { path: 'consulter-mes-logements', element: <Reservation /> },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/account" replace />, index: true },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':name/edit', element: <UserCreate /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceList /> },
            { path: ':id', element: <InvoiceDetails /> },
            { path: ':id/edit', element: <InvoiceEdit /> },
            { path: 'new', element: <InvoiceCreate /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:title', element: <BlogPost /> },
            { path: 'new', element: <BlogNewPost /> },
          ],
        },
      ],
    },

    // Dashboard Routes ADMIN
    {
      path: 'tableau-de-bord/admin',
      element: (
        <AuthGuard>
          {/* <RoleBasedGuard> */}
          <DashboardLayout />
          {/* </RoleBasedGuard> */}
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN_ADMIN} replace />, index: true },
        {
          path: 'app',
          element: (
            // <RoleBasedGuard accessibleRoles={['admin']}>
            <DashboardAdmin />
            // </RoleBasedGuard>
          ),
        },
        { path: 'programmes-immobiliers', element: <BuildingPrograms /> },
        { path: 'listes-des-utilisateurs', element: <UserLists /> },
        { path: 'reservations', element: <CustomerReservations /> },
        // { path: 'suivi-des-versements', element: <PaymentList /> },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="tableau-de-bord/admin/user/account" replace />, index: true },
            { path: 'account', element: <UserAccount /> },
            { path: 'new', element: <AddClient /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="tableau-de-bord/admin/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: ':name/edit', element: <UserCreate /> },
          ],
        },
        {
          path: 'payments',
          children: [
            { element: <Navigate to="tableau-de-bord/admin/payments/suivi-des-versements" replace />, index: true },
            { path: 'suivi-des-versements', element: <PaymentList /> },
            { path: ':paymentReference', element: <PaymentAdminView /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="tableau-de-bord/admin/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:title', element: <BlogPost /> },
            { path: 'new', element: <BlogNewPost /> },
          ],
        },
      ],
    },

    // Public Routes

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const LoginAdmin = Loadable(lazy(() => import('../pages/auth/LoginAdmin')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// DASHBOARD

// GENERAL USER
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/front/Dashboard')));
const Deadlines = Loadable(lazy(() => import('../pages/dashboard/front/Deadlines')));
const Payment = Loadable(lazy(() => import('../pages/dashboard/front/Payment')));
const PaymentView = Loadable(lazy(() => import('../pages/dashboard/front/PaymentView')));
const Reservation = Loadable(lazy(() => import('../pages/dashboard/front/Reservation')));

// GENERAL ADMIN
const DashboardAdmin = Loadable(lazy(() => import('../pages/dashboard/back/DashboardAdmin')));
const UserLists = Loadable(lazy(() => import('../pages/dashboard/back/UserList')));
const BuildingPrograms = Loadable(lazy(() => import('../pages/dashboard/back/BuildingPrograms')));
const AddClient = Loadable(lazy(() => import('../pages/dashboard/back/users/AddClient')));
const CustomerReservations = Loadable(lazy(() => import('../pages/dashboard/back/CustomerReservations')));
const PaymentList = Loadable(lazy(() => import('../pages/dashboard/back/PaymentList')));
const PaymentAdminView = Loadable(lazy(() => import('../pages/dashboard/back/PaymentView')));

const AddPayment = Loadable(lazy(() => import('../pages/dashboard/back/payment/AddPayment')));
const EditPayment = Loadable(lazy(() => import('../pages/dashboard/back/payment/EditPayment')));

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// BLOG
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));

// USER
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// APP
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));

// MAIN
// const HomePage = Loadable(lazy(() => import('../pages/Home')));
// const About = Loadable(lazy(() => import('../pages/About')));
// const Contact = Loadable(lazy(() => import('../pages/Contact')));
// const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
