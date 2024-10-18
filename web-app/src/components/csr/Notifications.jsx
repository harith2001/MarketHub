import React, { useState, useEffect } from "react";
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
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Header from "../Header";
import { getAllNotifications } from "../../api/notification";
import { updateOrderStatus } from "../../api/order";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("cancelled"); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifiData = await getAllNotifications(); // fetch all notifications from API
        setNotifications(notifiData);
      } catch (error) {
        console.error("Error fetching all notifications:", error);
      }
    };

    fetchNotifications();
  }, []); 

  // Filter order cancelled notifications
  const cancelledNotifications = notifications.filter(
    (notification) => notification.type === "Order Cancellation"
  );

  // Filter order delivered notifications
  const deliveredNotifications = notifications.filter(
    (notification) => notification.type === "Order Delivered"
  );

  // Handle clicking on cancel button
  const handleCancelOrder = (notification) => {
    setSelectedNotification(notification);
    setShowCancelModal(true);
  };

  // Confirm cancellation action
  const confirmCancelOrder = async () => {
    try {
      await updateOrderStatus(selectedNotification.orderId, false); // update order status as cancelled

      setNotifications(
        notifications.map((notification) =>
          notification.id === selectedNotification.id
            ? { ...notification, status: "Cancelled" }
            : notification
        )
      );
      setShowToast(true);
      setToastMessage("Order cancelled successfully!");
      setToastType("success");
      setShowCancelModal(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error("Error occured when cancelling the order:", error);
      setShowToast(true);
      setToastMessage("Failed to cancel the order.");
      setToastType("warning");
    }
  };

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
                        <Card.Text>
                          <strong>Description:</strong> {notification.content}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <Card.Text>
                            <strong>Date:</strong> {new Date(notification.createdDate).toLocaleDateString()}
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
                        <Card.Text>
                          <strong>Description:</strong> {notification.content}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <Card.Text>
                            <strong>Date:</strong> {new Date(notification.createdDate).toLocaleDateString()}
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

      {/* Toast for notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastType === 'success' ? 'success' : 'warning'}>
          <Toast.Header>
            <strong className="me-auto">{toastType === 'success' ? 'Order Cancellation Done' : 'Order Cancellation Error'}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Notifications;
