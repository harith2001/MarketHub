import React from "react";
import { useNavigate } from 'react-router-dom';
import { Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const renderLinks = () => {
    switch (userRole) {
      case "CSR":
        return (
          <>
            <Nav.Item className="mb-3">
              <Link to="/csr/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === '/csr/dashboard' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-grid-fill me-2 ${location.pathname === '/csr/dashboard' ? 'text-primary' : 'text-white'}`}></i>
                Dashboard
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/csr/account-management" className={`nav-link ${location.pathname === '/csr/account-management' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-people-fill me-2 ${location.pathname === '/csr/account-management' ? 'text-primary' : 'text-white'}`}></i>
                Users
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/csr/order-management" className={`nav-link ${location.pathname === '/csr/order-management' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-cart-fill me-2 ${location.pathname === '/csr/order-management' ? 'text-primary' : 'text-white'}`}></i>
                Orders
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/csr/notifications" className={`nav-link ${location.pathname === '/csr/notifications' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-bell-fill me-2 ${location.pathname === '/csr/notifications' ? 'text-primary' : 'text-white'}`}></i>
                Notifications
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/csr/customer-support" className={`nav-link ${location.pathname === '/csr/customer-support' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-file-earmark-spreadsheet-fill me-2 ${location.pathname === '/csr/customer-support' ? 'text-primary' : 'text-white'}`}></i>
                Inquiries
              </Link>
            </Nav.Item>
          </>
        );
      case "Vendor":
        return (
          <>
            <Nav.Item className="mb-3">
              <Link to="/vendor/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === '/vendor/dashboard' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-grid-fill me-2 ${location.pathname === '/vendor/dashboard' ? 'text-primary' : 'text-white'}`}></i>
                Dashboard
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/vendor/products" className={`nav-link ${location.pathname === '/vendor/products' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-bag-fill me-2 ${location.pathname === '/vendor/products' ? 'text-primary' : 'text-white'}`}></i>
                Products
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/vendor/orders" className={`nav-link ${location.pathname === '/vendor/orders' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-cart-fill me-2 ${location.pathname === '/vendor/orders' ? 'text-primary' : 'text-white'}`}></i>
                Orders
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/vendor/reviews" className={`nav-link ${location.pathname === '/vendor/reviews' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-file-earmark-spreadsheet-fill me-2 ${location.pathname === '/vendor/reviews' ? 'text-primary' : 'text-white'}`}></i>
                Reviews
              </Link>
            </Nav.Item>
          </>
        );
      case "Admin":
        return (
          <>
            <Nav.Item className="mb-3">
              <Link to="/admin/dashboard" className={`nav-link d-flex align-items-center ${location.pathname === '/admin/dashboard' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-grid-fill me-2 ${location.pathname === '/admin/dashboard' ? 'text-primary' : 'text-white'}`}></i>
                Dashboard
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/admin/users" className={`nav-link d-flex align-items-center ${location.pathname === '/admin/users' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-people-fill me-2 ${location.pathname === '/admin/users' ? 'text-primary' : 'text-white'}`}></i>
                Users
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/admin/products" className={`nav-link d-flex align-items-center ${location.pathname === '/admin/products' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-bag-fill me-2 ${location.pathname === '/admin/products' ? 'text-primary' : 'text-white'}`}></i>
                Products
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link to="/csr/order-management" className={`nav-link d-flex align-items-center ${location.pathname === '/csr/order-management' ? 'active bg-white text-primary' : 'text-white'}`}>
                <i className={`bi bi-cart-fill me-2 ${location.pathname === '/csr/order-management' ? 'text-primary' : 'text-white'}`}></i>
                Orders
              </Link>
            </Nav.Item>
          </>
        );
      default:
        return <p>No sidebar available for this role.</p>;
    }
  };

  return (
    <div className="text-white vh-100 p-3 d-flex flex-column justify-content-start" style={{ backgroundColor: '#066cdb', width: '200px', position: 'fixed', left: 0, top: 0 }}>
      <Nav className="flex-column">
        <Navbar.Brand onClick={() => navigate('/')} className="text-white fw-bold fs-4 p-3">
        MarketHub
        </Navbar.Brand>
        <Nav className="flex-column">

        {renderLinks()}
        </Nav>
      </Nav>
    </div>
  );
};

export default Sidebar;
