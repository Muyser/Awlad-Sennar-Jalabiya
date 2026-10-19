import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import SiteLayout from '@/components/site/SiteLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import CategoriesPage from '@/pages/CategoriesPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetail from '@/pages/ProductDetail';
import TailoringOrder from '@/pages/TailoringOrder';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Dashboard from '@/pages/admin/Dashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import ProductForm from '@/pages/admin/ProductForm';
import AdminCategories from '@/pages/admin/AdminCategories';
import POS from '@/pages/admin/POS';
import Orders from '@/pages/admin/Orders';
import OrderDetail from '@/pages/admin/OrderDetail';
import Tailoring from '@/pages/admin/Tailoring';
import TailoringDetail from '@/pages/admin/TailoringDetail';
import Customers from '@/pages/admin/Customers';
import CustomerDetail from '@/pages/admin/CustomerDetail';
import Inventory from '@/pages/admin/Inventory';
import Expenses from '@/pages/admin/Expenses';
import Offers from '@/pages/admin/Offers';
import AdminBranches from '@/pages/admin/AdminBranches';
import Deposits from '@/pages/admin/Deposits'; 
import Profile from '@/pages/admin/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AdminLogin from '@/pages/AdminLogin';
import AdminRoute from '@/components/AdminRoute';
import Settings from "@/pages/admin/Settings";

const AuthenticatedApp = () => {
  const isMockAdmin = localStorage.getItem("muyser_admin_logged") === "true";
  const hasToken = !!localStorage.getItem("admin_token");
  const auth = useAuth() || {};
  const { isLoadingAuth, authError } = auth;

  if (!isMockAdmin && !hasToken && isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FFFFFF]">
        <div className="w-8 h-8 border-4 border-[#1a2c6b]/15 border-t-[#f28c28] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isMockAdmin && authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Customer site */}
      <Route path="/" element={<Home />} />
      <Route element={<SiteLayout />}>
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/tailoring-order" element={<TailoringOrder />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Route>

      {/* Admin panel */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/:id/edit" element={<ProductForm />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/pos" element={<POS />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
          <Route path="/admin/tailoring" element={<Tailoring />} />
          <Route path="/admin/tailoring/:id" element={<TailoringDetail />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/customers/:id" element={<CustomerDetail />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/expenses" element={<Expenses />} />
          <Route path="/admin/offers" element={<Offers />} />
          <Route path="/admin/branches" element={<AdminBranches />} />
          <Route path="/admin/staff" element={<Deposits />} /> 
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;