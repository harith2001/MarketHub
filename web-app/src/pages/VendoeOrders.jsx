import React, { useState } from 'react';
import { Table, Dropdown, ProgressBar, Badge, Offcanvas, Button } from 'react-bootstrap';
import Header from '../components/Header';

const VendorOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: 'John Doe',
      date: '05-10-2024',
      status: 'Processing',
      total: 150.0,
      vendorProducts: [{ product: 'Asus Laptop', quantity: '1' }],
      isMultiVendor: false,
    },
    {
      id: 2,
      customer: 'Jane Smith',
      date: '05-10-2024',
      status: 'Partially',
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
      case 'Partially':
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
    <div style={{ marginLeft: '200px', padding: '20px' }}>
      <Header title="Orders"></Header>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th style={{ width: '15%' }}>Status</th>
            <th style={{ width: '12%' }}>Total Amount ($)</th>
            <th style={{ width: '30%' }}>Progress</th>
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
                <Button
                            style={{
                              backgroundColor:
                                order.status === 'Delivered' ? '#d4edda' :
                                order.status === 'Processing' ? '#fff3cd' :
                          order.status === 'Shipped' ? '#d1ecf1' : 
                                order.status === 'Partially' ? '#e5d1f1' : '#fff3cd',
                              color:
                                order.status === 'Delivered' ? '#155724' :
                                order.status === 'Processing' ? '#856404' :
                                    order.status === 'Shipped' ? '#0c5460' :
                                    order.status === 'Partially' ? '#7a18b5' : '#fff3cd',
                              border: 'none',
                              borderRadius: '20px',
                              width: '120px',
                            }}
                          >
                            {order.status}
                          </Button>
                {order.isMultiVendor && <Badge bg="info" className='ms-4'>Multi-Vendor</Badge>}
              </td>
              <td>{order.total}</td>
              <td>
                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <ProgressBar
                    now={getProgress(order.status)}
                    label={`${getProgress(order.status)}%`}
                    style={{backgroundColor: "066cdb", width: "60%" }}
                    className="flex-grow-1"
                  />
                  {/* Dropdown Button */}
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" style={{backgroundColor: "#066cdb"}} className='btn-sm'>
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
                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Partially')}>
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

      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end" style={{width: "250px"}}>
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedOrder?.isMultiVendor ? (
            <>
            <Offcanvas.Title>Order #{selectedOrder?.id} <Badge bg="info">Multi-Vendor</Badge></Offcanvas.Title>
              {selectedOrder.vendorProducts.map((product, index) => (
                <div key={index}>
                  <strong>{product.product}:</strong> {product.quantity}
                </div>
              ))}
            </>
          ) : (
            <>
              <Offcanvas.Title>Order #{selectedOrder?.id} </Offcanvas.Title>
              {selectedOrder?.vendorProducts.map((product, index) => (
                <div key={index}>
                  <strong>{product.product}:</strong>
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
