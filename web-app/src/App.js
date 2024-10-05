import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigationbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Signin from "./pages/SignIn";
import Signup from "./pages/SignUp";
import Products from './pages/Products';
import VendorReviews from './pages/VendorReiews';
import VendorOrders from './pages/VendoeOrders';
import SignupRequestForm from './components/SignupRequestForm';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';
import CSRDashboard from "./pages/csr/CsrDashboard";
import Accounts from "./components/csr/Accounts";
import Orders from "./components/csr/Orders";
import CustomerSupport from "./components/csr/CustomerSupport";
import Notifications from "./components/csr/Notifications";
import Sidebar from './components/csr/Sidebar';
import AdminDashbaord from './pages/admin/AdminDashbaord';
import VendorDashhboard from './pages/vendor/VendorDashhboard';
import Header from './components/Header';
import MainContent from './components/csr/MainContent';

function App() {
  const userRole = "CSR";
  return (
    <Router>
      <Sidebar userRole={userRole}/>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/signup-request" element={<SignupRequestForm/>}/>
        <Route path="/vendor/products" element={<Products />} />
        <Route path="/vendor/reviews" element={<VendorReviews />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/dashboard" element={<VendorDashhboard/>}/>
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/dashboard" element={<AdminDashbaord/>}/>
        <Route path="/csr/dashboard" element={<MainContent />} />
        <Route path="/csr/account-management" element={<Accounts />} />
        <Route path="/csr/order-management" element={<Orders />} />
        <Route path="/csr/customer-support" element={<CustomerSupport />} />
        <Route path="/csr/notifications" element={<Notifications />} />
        </Routes>
    </Router>
  );
}

export default App;
