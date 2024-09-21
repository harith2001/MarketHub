import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const Navigationbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">MarketHub</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Link className="nav-link" to="/">Dashboard</Link>
          <Link className="nav-link" to="/products">Products</Link>
          <Link className="nav-link" to="/orders">Orders</Link>
          <Link className="nav-link" to="/users">Users</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigationbar