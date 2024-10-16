import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react';
import Products from './components/vendor/Products';
import VendorReviews from './components/vendor/VendorReiews';
import VendorOrders from './components/vendor/VendoeOrders';
import SignupRequestForm from './components/SignupRequestForm';
import ManageUsers from './components/admin/ManageUsers';
import ManageProducts from './components/admin/ManageProducts';
import Accounts from "./components/csr/Accounts";
import Orders from "./components/csr/Orders";
import CustomerSupport from "./components/csr/CustomerSupport";
import Notifications from "./components/csr/Notifications";
import Sidebar from './components/csr/Sidebar';
import AdminDashbaord from './components/admin/AdminDashbaord';
import VendorDashhboard from './components/vendor/VendorDashhboard';
import CsrDashboard from './components/csr/CsrDashboard';
import FirstPage from './pages/FirstPage';
import { UserProvider } from './UserContext';
import { SearchProvider } from './SearchContext';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [user, setUser] = useState(null);

  return (
<SearchProvider>
<UserProvider>
      
    <Router>
      <div className="d-flex">
        {<Sidebar userRole={userRole} />}
        <div className="flex-grow-1">
          {/* <Header user={user} /> */}
        <Routes>
        <Route path="/" element={<FirstPage setUserRole={setUserRole} setVendorId={setVendorId} user={user} setUser={setUser}/>} />
        <Route path="/signup-request" element={<SignupRequestForm/>}/>
        <Route path="/vendor/products" element={<Products />} />
        <Route path="/vendor/reviews" element={<VendorReviews />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/dashboard" element={<VendorDashhboard/>}/>
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/dashboard" element={<AdminDashbaord/>}/>
        <Route path="/csr/dashboard" element={<CsrDashboard />} />
        <Route path="/csr/account-management" element={<Accounts />} />
        <Route path="/csr/order-management" element={<Orders />} />
        <Route path="/csr/customer-support" element={<CustomerSupport />} />
        <Route path="/csr/notifications" element={<Notifications />} />
          </Routes>
          </div>
        </div>
    </Router>
      </UserProvider>
      </SearchProvider>
  );
}

export default App;
