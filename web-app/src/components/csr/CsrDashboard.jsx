import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Badge,
  Modal,
  InputGroup,
  Form,
  ListGroup,
} from "react-bootstrap";
import Header from "../Header";
import { getUsers, updateUserStatus } from "../../api/user";
import { getAllOrders } from "../../api/order";

const CsrDashboard = () => {
  // Example state for Account Requests, Orders, and Notifications
  const [accountRequests, setAccountRequests] = useState([]);
  const [orders, setOrders] = useState([]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Order cancellation request from John Doe." },
    { id: 2, message: "Inquiry from Jane Smith about her order." },
  ]);

  useEffect(() => {
    const fetchPendingCustomers = async () => {
      try {
        const users = await getUsers(); // Fetch all users from API
        const pendingCustomers = users.filter(user => user.role === 'Customer' && !user.isActive); // customers who are not active
        setAccountRequests(pendingCustomers); 
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchPendingCustomers();
  }, []);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getAllOrders(); // Fetch all orders
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleApproveAccount = async (userId) => {
    try {
      // update user staus as active
      await updateUserStatus(userId, true);
      // reove activated users
      setAccountRequests(accountRequests.filter((req) => req.user_ID !== userId));
    } catch (error) {
      console.error('Error approving account: ', error);
    }
  };

  const [showCalendar, setShowCalendar] = useState(false); // State to control modal visibility
  const [filterDate, setFilterDate] = useState(""); // State to track selected filter date

  // Toggle the Calendar Modal
  const handleShowCalendar = () => setShowCalendar(true);
  const handleCloseCalendar = () => setShowCalendar(false);

  // Handle date selection
  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
    handleCloseCalendar(); // Close the modal after selecting a date
  };

  // Filter orders based on the selected date
  const filteredOrders = orders.filter((order) => {
    if (!filterDate) return true;
    return new Date(order.orderDate).toLocaleDateString() === new Date(filterDate).toLocaleDateString();
  });

  return (
    <div style={{ marginLeft: "200px", padding: "20px" }}>
      <Header title="Dashboard"></Header>
      {/* Account Requests Section */}
      <Card className="mb-4 border border-danger">
        <Card.Header className="bg-danger bg-opacity-10 text-danger">
          Pending Account Requests
        </Card.Header>
        <Card.Body>
          {accountRequests.length === 0 ? (
            <p>No pending account requests.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accountRequests.map((request) => (
                  <tr key={request.user_ID}>
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                    <td>
                      <Badge bg="warning">Pending Activation</Badge>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        style={{
                          width: "100px",
                        }}
                        size="sm"
                        onClick={() => handleApproveAccount(request.user_ID)}
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Order Overview Section */}
      <div>
        <Card className="mb-4 border border-info position-relative">
          <Card.Header className="bg-info bg-opacity-10 text-info d-flex justify-content-between align-items-center">
            <span>Order Overview</span>

            <i
              className="bi bi-calendar-fill"
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={handleShowCalendar}
            ></i>
          </Card.Header>
          <Card.Body>
            {filteredOrders.length === 0 ? (
              <p>No orders available for the selected date.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total ($)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.orderID}>
                      <td>{order.orderID}</td>
                      <td>{order.customerID}</td>
                      <td>
                        <Badge
                          bg={order.status === "Delivered" ? "success" : "info"}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td>{order.totalPrice}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Calendar Modal */}
        <Modal show={showCalendar} onHide={handleCloseCalendar}>
          <Modal.Header closeButton>
            <Modal.Title>Select a Date to Filter Orders</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Date Picker */}
            <Form.Group controlId="formDate">
              <Form.Label>Select Date</Form.Label>
              <Form.Control
                type="date"
                value={filterDate}
                onChange={handleDateChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCalendar}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Notifications Section */}
      <Card className="border border-warning">
        <Card.Header className="bg-warning bg-opacity-10 text-warning">
          Notifications
        </Card.Header>
        <Card.Body>
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            <ListGroup>
              {notifications.map((notification) => (
                <ListGroup.Item key={notification.id}>
                  {notification.message}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CsrDashboard;
