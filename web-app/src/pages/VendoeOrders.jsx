import React, { useState } from 'react';
import { Table, Dropdown, ProgressBar, Badge, Offcanvas, Button } from 'react-bootstrap';

const VendorOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: 'John Doe',
      date: '2024-09-15',
      status: 'Processing',
      total: 150.0,
      vendorProducts: [{ product: 'Product A', status: 'Processing' }],
      isMultiVendor: false,
    },
    {
      id: 2,
      customer: 'Jane Smith',
      date: '2024-09-14',
      status: 'Partially Delivered',
      total: 200.0,
      vendorProducts: [
        { product: 'Product B', status: 'Shipped' },
        { product: 'Product C', status: 'Processing' },
      ],
      isMultiVendor: true,
    },
  ]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Get progress based on status
  const getProgress = (status) => {
    switch (status) {
      case 'Processing':
        return 25;
      case 'Shipped':
        return 50;
      case 'Partially Delivered':
        return 75;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  // Show Offcanvas 
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOffcanvas(true);
  };

  // Close the Offcanvas
  const handleClose = () => {
    setShowOffcanvas(false);
    setSelectedOrder(null);
  };

  return (
    <div className="mt-4 mx-4">
      <h2>Manage Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th style={{ width: '12%' }}>Status</th>
            <th>Total Amount ($)</th>
            <th style={{ width: '25%' }}>Progress & Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
                {order.id}
              </td>
              <td>{order.customer}</td>
              <td>{order.date}</td>
              <td>
                {order.status}{' '}
                {order.isMultiVendor && <Badge bg="info">Multi-Vendor</Badge>}
              </td>
              <td>{order.total}</td>
              <td>
                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ProgressBar
                    now={getProgress(order.status)}
                    label={`${getProgress(order.status)}%`}
                    variant="success opacity-75"
                    className="me-2 flex-grow-1"
                  />
                  {/* Dropdown Button */}
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Status
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Processing')}>
                        Processing
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Shipped')}>
                        Shipped
                      </Dropdown.Item>
                      {order.isMultiVendor && (
                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Partially Delivered')}>
                          Partially Delivered
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Delivered')}>
                        Delivered
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Order #{selectedOrder?.id} Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedOrder?.isMultiVendor ? (
            <>
              <h5>Multi-Vendor Products for this Vendor</h5>
              {selectedOrder.vendorProducts.map((product, index) => (
                <div key={index}>
                  <strong>{product.product}:</strong> {product.status}
                </div>
              ))}
            </>
          ) : (
            <>
              <h5>Products for this Order</h5>
              {selectedOrder?.vendorProducts.map((product, index) => (
                <div key={index}>
                  <strong>{product.product}:</strong> {product.status}
                </div>
              ))}
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default VendorOrders;
