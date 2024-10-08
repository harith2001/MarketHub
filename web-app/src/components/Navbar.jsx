import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button} from 'react-bootstrap';
import Notification from './vendor/Notification';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navigationbar = () => {
  const navigate = useNavigate();
  return (
     <Navbar expand="lg" className="px-3" style={{ position: 'fixed', top: 0, width: '100%' }}>
      <Navbar.Brand onClick={() => navigate('/')} className="text-white">
        MarketHub
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto d-flex align-items-center"> {/* Aligning the items to the right */}
          <Notification />
          <Nav.Link className="text-white me-3">
            <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigationbar