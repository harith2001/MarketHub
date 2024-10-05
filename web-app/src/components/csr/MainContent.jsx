import React, { useState } from "react";
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

const MainContent = () => {
  // Example state for Account Requests, Orders, and Notifications
  const [accountRequests, setAccountRequests] = useState([
    { id: 1, name: "John Doe", status: "Pending Activation" },
    { id: 2, name: "Jane Smith", status: "Pending Activation" },
  ]);

  const [orders, setOrders] = useState([
    { id: 101, customer: "John Doe", status: "Processing", total: 150.0, date: '02-03-2023' },
    { id: 102, customer: "Jane Smith", status: "Delivered", total: 200.0, date: '02-03-2023' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Order cancellation request from John Doe." },
    { id: 2, message: "Inquiry from Jane Smith about her order." },
  ]);

  const handleApproveAccount = (id) => {
    // Handle approving the account (remove from requests)
    setAccountRequests(accountRequests.filter((req) => req.id !== id));
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
    if (!filterDate) return true; // Show all if no date is selected
    return order.date === filterDate; // Return orders that match the selected date
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
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accountRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.name}</td>
                    <td>
                      <Badge bg="warning">{request.status}</Badge>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        style={{
                          width: "100px",
                        }}
                        size="sm"
                        onClick={() => handleApproveAccount(request.id)}
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
        {/* Order Overview Section (Light Info for Header, Dark for Border) */}
        <Card className="mb-4 border border-info position-relative">
          <Card.Header className="bg-info bg-opacity-10 text-info d-flex justify-content-between align-items-center">
            <span>Order Overview</span>

            {/* Clickable Calendar Icon */}
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
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>
                        <Badge
                          bg={order.status === "Delivered" ? "success" : "info"}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td>{order.total.toFixed(2)}</td>
                      <td>{order.date}</td>
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

export default MainContent;
