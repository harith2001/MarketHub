import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigationbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Signin from "./pages/SignIn";
import Signup from "./pages/SignUp";

function App() {
  return (
    <Router>
      <Navigationbar/>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        </Routes>
    </Router>
  );
}

export default App;
