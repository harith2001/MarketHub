import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigationbar from './pages/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Navigationbar/>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
        </Routes>
    </Router>
  );
}

export default App;
