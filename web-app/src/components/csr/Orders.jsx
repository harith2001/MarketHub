import React, { useState } from "react";
import {
  Table,
  Dropdown,
  Modal,
  Button,
  Badge,
  Offcanvas,
  Form,
  Col,
  Row,
  Card,
  ListGroup,
} from "react-bootstrap";
import Header from "../Header";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      createdTime: "2 min ago",
      customer: "John Doe",
      status: "Pending",
      products: [
        {
          id: "A101",
          name: "Product A",
          image: "imageA.jpg",
          quantity: 2,
          discount: 5,
          total: 90,
        },
        {
          id: "B202",
          name: "Product B",
          image: "imageB.jpg",
          quantity: 1,
          discount: 0,
          total: 50,
        },
      ],
      subtotal: 140,
      shipping: 10,
      discount: 5,
      total: 145,
      note: "Please deliver quickly.",
    },
    {
      id: 2,
      createdTime: "3 min ago",
      customer: "Jane Smith",
      status: "Delivered",
      products: [
        {
          id: "C303",
          name: "Asus Laptop",
          image: "imageC.jpg",
          quantity: 1,
          discount: 10,
          total: 100,
        },
      ],
      subtotal: 100,
      shipping: 0,
      discount: 10,
      total: 90,
      note: "",
    },
    {
      id: 3,
      createdTime: "5 min ago",
      customer: "Rose Perera",
      status: "Delivered",
      products: [
        {
          id: "C303",
          name: "Product C",
          image: "imageC.jpg",
          quantity: 1,
          discount: 10,
          total: 100,
        },
      ],
      subtotal: 100,
      shipping: 0,
      discount: 10,
      total: 90,
      note: "",
    },
    {
      id: 4,
      createdTime: "10 min ago",
      customer: "Anne De Silva",
      status: "Delivered",
      products: [
        {
          id: "C303",
          name: "Product C",
          image: "imageC.jpg",
          quantity: 1,
          discount: 10,
          total: 100,
        },
      ],
      subtotal: 100,
      shipping: 0,
      discount: 10,
      total: 90,
      note: "",
    },
    {
      id: 5,
      createdTime: "20 min ago",
      customer: "Kasun Senanayake",
      status: "Delivered",
      products: [
        {
          id: "C303",
          name: "Product C",
          image: "imageC.jpg",
          quantity: 1,
          discount: 10,
          total: 100,
        },
      ],
      subtotal: 100,
      shipping: 0,
      discount: 10,
      total: 90,
      note: "",
    },
  ]);

  const [showProducts, setShowProducts] = useState(null); // To show products dropdown
  const [showModal, setShowModal] = useState(false); // Modal for cancelling orders
  const [cancelledOrder, setCancelledOrder] = useState(null); // Order being cancelled
  const [note, setNote] = useState(""); // Note for cancelled order

  // Sidebar Overview Data
  const overview = {
    todayOrders: 5,
    pendingOrders: 2,
    deliveredOrders: 2,
    cancelledOrders: 1,
  };

  // Handle status change
  const handleStatusChange = (order, newStatus) => {
    if (newStatus === "Cancelled") {
      setCancelledOrder(order);
      setShowModal(true);
    } else {
      setOrders(
        orders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
    }
  };

  // Confirm cancellation
  const handleConfirmCancel = () => {
    setOrders(
      orders.map((o) =>
        o.id === cancelledOrder.id ? { ...o, status: "Cancelled", note } : o
      )
    );
    setShowModal(false);
    setCancelledOrder(null);
    setNote("");
  };

  // Handle showing products
  const handleShowProducts = (orderId) => {
    setShowProducts(showProducts === orderId ? null : orderId);
  };

  // Change button color based on the status
  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
      case "Cancelled":
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
      case "Pending":
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
      case "Confirmed":
        return {
          backgroundColor: "#d1ecf1",
          color: "#0c5460",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
      default:
        return {
          backgroundColor: "#f8f9fa",
          color: "#6c757d",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
    }
  };

  return (
    <Row className="d-flex" style={{ marginLeft: "200px", padding: "20px" }}>
      {/* Main Content */}
      <Col md={10} className="p-4">
        <Header title="Orders"></Header>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Created Time</th>
              <th>Customer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>{order.id}</td>
                  <td>{order.createdTime}</td>
                  <td>{order.customer}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        style={getStatusButtonStyle(order.status)}
                      >
                        {order.status}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleStatusChange(order, "Pending")}
                        >
                          Pending
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleStatusChange(order, "Confirmed")}
                        >
                          Confirmed
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleStatusChange(order, "Delivered")}
                        >
                          Delivered
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleStatusChange(order, "Cancelled")}
                        >
                          Cancelled
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Button
                      style={{ background: 'none', border: 'none', padding: 0 }}
                      onClick={() => handleShowProducts(order.id)}
                    >
                      {showProducts === order.id ? (
                        <i style={{color: '#a8a9aa'}} className="bi bi-caret-up-square-fill"></i>
                      ) : (
                        <i style={{color: '#a8a9aa'}} className="bi bi-caret-down-square-fill"></i>
                      )}
                    </Button>
                  </td>
                </tr>
                {showProducts === order.id && (
                  <tr>
                    <td colSpan="5">
                      <Table className="table-borderless">
                        <thead className="text-body-secondary">
                          <tr>
                            <th>Image</th>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((product) => (
                            <tr key={product.id}>
                              <td>
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  style={{ width: "50px" }}
                                />
                              </td>
                              <td>{product.id}</td>
                              <td>{product.name}</td>
                              <td>{product.quantity}</td>
                              <td>{product.discount}%</td>
                              <td>${product.total}</td>
                            </tr>
                          ))}
                          {/* Order Summary */}
                          <tr className="fw-bold">
                            <td colSpan="4"></td>
                            <td>Subtotal</td>
                            <td>${order.subtotal}</td>
                          </tr>
                          <tr className="fw-bold">
                            <td colSpan="4"></td>
                            <td>Shipping</td>
                            <td>${order.shipping}</td>
                          </tr>
                          <tr className="fw-bold">
                            <td colSpan="4"></td>
                            <td>Discount</td>
                            <td>${order.discount}</td>
                          </tr>
                          <tr className="fw-bold">
                            <td colSpan="4"></td>
                            <td>Total</td>
                            <td>${order.total}</td>
                          </tr>
                          {order.note && (
                            <tr>
                              <td colSpan="6">
                                <strong>Customer Note:</strong> {order.note}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
        {/* Cancel Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to cancel this order?</p>
            <Form.Group controlId="cancelNote">
              <Form.Label>Note:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={handleConfirmCancel}>
              Confirm Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>

      {/* Sidebar Overview */}
      <Offcanvas
        show={true}
        placement="end"
        backdrop={false}
        style={{ width: "200px", backgroundColor: "#cbe2ff" }}
      >
        <Offcanvas.Header>
          <Offcanvas.Title>Overview</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup variant="flush">
            <ListGroup.Item style={{ backgroundColor: "#cbe2ff" }}>
              Orders Today <br /> <h2>{overview.todayOrders}</h2>
            </ListGroup.Item>
            <ListGroup.Item style={{ backgroundColor: "#cbe2ff" }}>
              Pending <br /> <h2>{overview.pendingOrders}</h2>
            </ListGroup.Item>
            <ListGroup.Item style={{ backgroundColor: "#cbe2ff" }}>
              Delivered <br /> <h2>{overview.deliveredOrders}</h2>
            </ListGroup.Item>
            <ListGroup.Item style={{ backgroundColor: "#cbe2ff" }}>
              Cancelled <br /> <h2>{overview.cancelledOrders}</h2>
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </Row>
  );
};

export default Orders;
