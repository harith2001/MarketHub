import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button} from 'react-bootstrap';
import Notification from './vendor/Notification';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navigationbar = ({ userRole }) => {
  const navigate = useNavigate();
  return (
    <Navbar expand="lg" className="bg-success bg-opacity-70 px-3">
      <Navbar.Brand onClick={() => navigate('/')} className="text-white">
        MarketHub
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link onClick={() => navigate('/')} className="text-white">
            Home
          </Nav.Link>

          {userRole === 'Vendor' && (
            <>
              <Nav.Link onClick={() => navigate('/vendor/products')} className="text-white">
                Products
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/vendor/orders')} className="text-white">
                Orders
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/vendor/reviews')} className="text-white">
                Reviews
              </Nav.Link>
            </>
          )}

          {userRole === 'Customer' && (
            <Nav.Link onClick={() => navigate('/customer/orders')} className="text-white">
              My Orders
            </Nav.Link>
          )}

          {userRole === 'Administrator' && (
            <>
              <Nav.Link onClick={() => navigate('/admin/dashboard')} className="text-white">
                Admin Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/admin/inventory')} className="text-white">
                Manage Inventory
              </Nav.Link>
            </>
          )}
        </Nav>

        <Nav className="d-flex align-items-center">
          {userRole === 'Vendor' && <Notification />}

          <Nav.Link className="text-white me-3">
            <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
          </Nav.Link>

          <Button variant="outline-light" onClick={() => navigate('/logout')}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigationbar