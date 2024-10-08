import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import Header from '../../components/Header';
import { getAllProducts } from '../../api/product';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false); 

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Activate/Deactivate product
  const toggleProductStatus = (productId) => {
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, status: product.status === 'Active' ? 'Inactive' : 'Active' }
        : product
    );
    setProducts(updatedProducts);
  };

  // Handle product removal
  const handleRemoveProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
  };

  // Open modal to edit product details
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Save product edits
  const handleSaveEdit = () => {
    const updatedProducts = products.map(product =>
      product.id === editingProduct.id ? editingProduct : product
    );
    setProducts(updatedProducts);
    setShowEditModal(false);
  };

  // Handle input change for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  return (
    <Container style={{ marginLeft: "200px", padding: "20px" }}>
      <Header title="Products"></Header>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <Table striped hover responsive className="table-borderless">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price ($)</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  {product.status === 'Active' ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="secondary">Inactive</Badge>
                  )}
                </td>
                <td>
                    <Button
                    className='me-2'
                    onClick={() => handleEditProduct(product)}
                    style={{
                      backgroundColor: '#066cdb',
                        width: "100px",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                    variant={product.status === 'Active' ? 'warning' : 'success'}
                    className='me-2'
                      onClick={() => toggleProductStatus(product.id)}
                      style={{
                        width: "100px",
                      }}
                    >
                      {product.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                    variant="danger"
                    className='me-2'
                    onClick={() => handleRemoveProduct(product.id)}
                    style={{
                        width: "100px",
                      }}
                    >
                      Remove
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingProduct && (
            <Form>
              <Form.Group controlId="formProductName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formProductCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formProductPrice" className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formProductStock" className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={editingProduct.stock}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageProducts;
