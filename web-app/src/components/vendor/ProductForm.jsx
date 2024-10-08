import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { addNewProduct } from "../../api/product";

const ProductForm = ({ onSave }) => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState(true);
  const [productImage, setProductImage] = useState(null); 

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]); 
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData object to create a product
    const formData = new FormData();
    formData.append("id", productId);
    formData.append("name", productName);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("status", status ? 'Active' : 'Inactive');
    formData.append("productImage", productImage); 

    try {
      const response = await addNewProduct(formData); // call API
      console.log("Product added successfully:", response);
      
      // Call onSave prop to reset the form after a successful save 
      onSave(response);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
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
            <Form.Group controlId="formProductImage" className="mt-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>
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
                <Button variant="primary" type="submit" className="btn-md" style={{width: "100px"}}>
                  Save
                </Button>
                <Button variant="outline-primary" className="btn-md" style={{width: "100px"}}>
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
