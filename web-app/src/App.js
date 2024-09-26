import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigationbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Signin from "./pages/SignIn";
import Signup from "./pages/SignUp";
import Products from './pages/Products';
import VendorReviews from './pages/VendorReiews';

function App() {
  const userRole = 'Vendor';
  return (
    <Router>
      <Navigationbar userRole={userRole}/>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/vendor/products" element={<Products />} />
        <Route path="/vendor/reviews" element={<VendorReviews/>}/>
        </Routes>
    </Router>
  );
}

export default App;
