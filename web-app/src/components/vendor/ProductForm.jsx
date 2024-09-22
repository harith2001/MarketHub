import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const ProductForm = ({ onSave }) => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    // product object to be sent to API
    const productData = {
      id: productId,
      name: productName,
      category: category,
      description: description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      status: status,
    };

    // prop to pass the product data 
    onSave(productData);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            {/* Product ID */}
            <Form.Group controlId="formProductId" className="mt-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              />
            </Form.Group>

            {/* Product Name */}
            <Form.Group controlId="formProductName" className="mt-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Category */}
            <Form.Group controlId="formCategory" className="mt-3">
              <Form.Label>Category</Form.Label>
              <div className="position-relative">
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Electronics">Electronics</option>
                </Form.Control>
                <i
                  className="bi bi-caret-down-fill"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    pointerEvents: "none",
                    transform: "translateY(-50%)",
                  }}
                ></i>
              </div>
            </Form.Group>

            {/* Price */}
            <Form.Group controlId="formPrice" className="mt-3">
              <Form.Label>Price (Rs.)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            {/* Description */}
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            {/* Stock */}
            <Form.Group controlId="formStock" className="mt-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </Form.Group>

            {/* Status */}
            <Form.Group controlId="formStatus" className="mt-3">
              <Form.Label>Status</Form.Label>
              <div className="d-flex">
                <Form.Check
                  type="radio"
                  label="Active"
                  name="status"
                  value="Active"
                  checked={status === true}
                  onChange={() => setStatus(true)}
                  className="me-3"
                />
                <Form.Check
                  type="radio"
                  label="Inactive"
                  name="status"
                  value="Inactive"
                  checked={status === false}
                  onChange={() => setStatus(false)}
                />
              </div>
            </Form.Group>

            <Row className="mt-4">
              <Col className="d-flex flex-row-reverse gap-4">
                <Button variant="primary" type="submit" className="btn-md">
                  Save
                </Button>
                <Button variant="outline-primary" className="btn-md">
                  Cancel
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProductForm;
