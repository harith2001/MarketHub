import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Modal,
  Card,
  Container,
  Col,
  Row,
  ListGroup,
  Offcanvas,
} from "react-bootstrap";
import Header from "../Header";

const Notifications = () => {
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      orderId: "#12345",
      customer: "John Doe",
      type: "Order Cancellation",
      date: "2024-09-14",
      status: "Cancelled",
    },
    {
      id: 2,
      orderId: "#12545",
      customer: "Jane Smith",
      type: "Order Delivered",
      date: "2024-09-15",
      status: "Delivered",
    },
    {
      id: 3,
      orderId: "#73345",
      customer: "Michael Brown",
      type: "Order Cancellation",
      date: "2024-09-16",
      status: "Cancelled",
    },
  ]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("cancelled"); // Track active tab
  const [showSidebar, setShowSidebar] = useState(false); // Sidebar visibility

  // Handle clicking on cancel button
  const handleCancelOrder = (notification) => {
    setSelectedNotification(notification);
    setShowCancelModal(true);
  };

  // Confirm cancellation action
  const confirmCancelOrder = () => {
    // Logic to cancel the order
    setShowCancelModal(false);
    setSelectedNotification(null);
  };

  // Filter cancelled and delivered notifications
  const cancelledNotifications = notifications.filter(
    (notification) => notification.status === "Cancelled"
  );
  const deliveredNotifications = notifications.filter(
    (notification) => notification.status === "Delivered"
  );

  // Handle clearing a notification
  const handleClearNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };
  return (
    <Container style={{ marginLeft: "200px", padding: "20px" }}>
      <Header title="Notifications"></Header>
      <Row>
        <Col md={12}>

          {/* Tabs for Cancelled and Delivered notifications */}
          <Tabs
            id="notification-tabs"
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-3"
          >
            <Tab eventKey="cancelled" title="Cancelled Orders">
              <div className="mt-4">
                {/* Cancelled notifications list */}
                {cancelledNotifications.length === 0 ? (
                  <p>No cancelled orders.</p>
                ) : (
                  cancelledNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className="mb-3 bg-light shadow-sm"
                    >
                      <Card.Body>
                        <Card.Title>{notification.orderId}</Card.Title>
                        <Card.Text>
                          <strong>Type:</strong> {notification.type}
                        </Card.Text>
                        {/* Flex layout for date and buttons */}
                        <div className="d-flex justify-content-between align-items-center">
                          <Card.Text>
                            <strong>Date:</strong> {notification.date}
                          </Card.Text>
                          <div>
                            <Button
                              variant="danger"
                              onClick={() => handleCancelOrder(notification)}
                              className="me-2"
                              style={{
                                width: "140px",
                              }}
                            >
                              Cancel Order
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                handleClearNotification(notification.id)
                              }
                              style={{
                                width: "100px",
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Tab>

            <Tab eventKey="delivered" title="Delivered Orders">
              <div className="mt-4">
                {/* Delivered notifications list */}
                {deliveredNotifications.length === 0 ? (
                  <p>No delivered orders.</p>
                ) : (
                  deliveredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className="mb-3 bg-light shadow-sm"
                    >
                      <Card.Body>
                        <Card.Title>{notification.orderId}</Card.Title>
                        <Card.Text>
                          <strong>Type:</strong> {notification.type}
                        </Card.Text>
                        {/* Flex layout for date and buttons */}
                        <div className="d-flex justify-content-between align-items-center">
                          <Card.Text>
                            <strong>Date:</strong> {notification.date}
                          </Card.Text>
                          <div>
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                handleClearNotification(notification.id)
                              }
                              style={{
                                width: "100px",
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Modal for confirming cancellation */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel the order from{" "}
          {selectedNotification?.orderId}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmCancelOrder}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Notifications;
