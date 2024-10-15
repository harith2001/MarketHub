import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import Header from '../../components/Header';
import { getAllProducts, updateProduct, deleteProduct } from '../../api/product';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

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
  const toggleProductStatus = async (productId, isActive) => {
    try {
      const updatedProduct = await updateProduct(productId, { isActive: !isActive }); // Update the product status
      const updatedProducts = products.map(product =>
        product.productId === productId ? { ...product, isActive: updatedProduct.isActive } : product
      );
      setProducts(updatedProducts);

      //toast messages
      setToastMessage(updatedProduct.isActive ? 'Product activated successfully!' : 'Product deactivated successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  // Handle product removal
  const handleRemoveProduct = async (productId) => {
    try {
      await deleteProduct(productId); // Call the function to delete the product
      const updatedProducts = products.filter(product => product.productId !== productId);
      setProducts(updatedProducts); // Update the state to remove the product

      // toast message
      setToastMessage('Product removed successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to remove product:', error);
    }
  };

  // Open modal to edit product details
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Save product edits
  const handleSaveEdit = async () => {
    try {
      const updatedProduct = await updateProduct(editingProduct.productId, editingProduct); // Call the function to update the product
      const updatedProducts = products.map(product =>
        product.productId === updatedProduct.productId ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setShowEditModal(false);

      // toast message
      setToastMessage('Product updated successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to save product edits:', error);
    }
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
                <td>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.productType}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  {product.isActive ? (
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
                    variant={product.isActive ? 'warning' : 'success'}
                    className='me-2'
                      onClick={() => toggleProductStatus(product.productId, product.isActive)}
                      style={{
                        width: "100px",
                      }}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                    variant="danger"
                    className='me-2'
                    onClick={() => handleRemoveProduct(product.productId)}
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
                  value={editingProduct.productName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formProductCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={editingProduct.productType}
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
                  value={editingProduct.quantity}
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

      {/* Toast for notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastType === 'success' ? 'success' : 'danger'}>
          <Toast.Header>
            <strong className="me-auto">{toastType === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ManageProducts;
