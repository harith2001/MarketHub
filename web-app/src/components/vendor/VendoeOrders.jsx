import React, { useState, useEffect } from 'react';
import { Table, Dropdown, ProgressBar, Badge, Offcanvas, Button, Toast, ToastContainer } from 'react-bootstrap';
import Header from '../Header';
import { getAllOrders, updateOrderStatus } from '../../api/order';
import { useSearch } from '../../SearchContext';

const VendorOrders = ({ vendorId }) => {
  const { searchTerm } = useSearch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch all orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // get orders by vendorId
  useEffect(() => {
    const vendorSpecificOrders = orders
      .map(order => ({
        ...order,
        vendorItems: order.items.filter(item => item.vendorId === vendorId), 
        isMultiVendor: new Set(order.items.map(item => item.vendorId)).size > 1, // check for multi vendors
      }))
      .filter(order => order.vendorItems.length > 0);  

    setFilteredOrders(vendorSpecificOrders);
  }, [orders, vendorId]);

  // Apply search filter based on search term
  useEffect(() => {
    const searchResults = orders.filter(order =>
      order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const vendorSpecificFilteredOrders = searchResults
      .map(order => ({
        ...order,
        vendorItems: order.items.filter(item => item.vendorId === vendorId),
        isMultiVendor: new Set(order.items.map(item => item.vendorId)).size > 1,
      }))
      .filter(order => order.vendorItems.length > 0);

    setFilteredOrders(vendorSpecificFilteredOrders);
  }, [searchTerm, orders, vendorId]);

  // handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus); 
      setOrders(
        orders.map((order) =>
          order.orderID === orderId ? { ...order, status: newStatus } : order
        )
      );
      setToastMessage(`Order status changed to ${newStatus}`);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error updating order status:', error);
      setToastMessage('Failed to change order status.');
      setToastType('danger');
      setShowToast(true);
    }
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
          {filteredOrders.map((order) => (
            <tr key={order.orderID}>
              <td onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
                {order.orderID}
              </td>
              <td>{order.customerId}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
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
              <td>${order.totalPrice.toFixed(2)}</td>
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
          {selectedOrder ? (
            <>
              <Offcanvas.Title>Order #{selectedOrder?.orderID}</Offcanvas.Title>
              {selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    backgroundColor: item.vendorId === vendorId ? '#f1f9ff' : 'transparent',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <strong>{item.productName}</strong>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                  <p>Status: {item.productStatus}</p>
                </div>
              ))}
            </>
          ) : (
            <p>No order selected</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Toast for notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastType === 'success' ? 'success' : 'danger'}>
          <Toast.Header>
            <strong className="me-auto">{toastType === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default VendorOrders;
