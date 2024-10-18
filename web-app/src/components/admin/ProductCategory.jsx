import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { createProductType, getAllProductTypes, deleteProductType } from '../../api/productType';
import Header from '../Header';

const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch all product categories
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllProductTypes();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
  }, []);

  // Handle creating a new category
  const handleCreateCategory = async () => {
    if (!newCategoryId) return; // Prevent empty category creation
    try {
      await createProductType({ productTypeId: newCategoryId, productTypeName: newCategoryName });
      setToastMessage('Product category added successfully!');
      setToastType('success');
      setShowToast(true);
      setNewCategoryId(''); // Clear the ID input
      setNewCategoryName(''); // Clear the name input
      fetchCategories(); // Refresh the list of categories
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Error creating product category:', error);
      setToastMessage('Failed to add product category.');
      setToastType('danger');
      setShowToast(true);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id) => {
    try {
      await deleteProductType(id);
      setToastMessage('Product category deleted successfully!');
      setToastType('success');
      setShowToast(true);
      fetchCategories(); // Refresh the list of categories
    } catch (error) {
      console.error('Error deleting product category:', error);
      setToastMessage('Failed to delete product category.');
      setToastType('danger');
      setShowToast(true);
    }
  };

  return (
      <div>
          <div className="d-flex justify-content-end mb-3">
      <Button variant="primary" onClick={() => setShowModal(true)}>
        <i className="bi bi-plus-lg"></i> Add Category
      </Button>
              
          </div>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Category Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
              <tr key={category.id}>
                  <td>{category.productTypeId}</td>
              <td>{category.productTypeName}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteCategory(category.productTypeId)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formCategoryId">
            <Form.Label>Category ID</Form.Label>
            <Form.Control
              type="text"
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(e.target.value)}
              placeholder="Enter category id"
            />
          </Form.Group>    
          <Form.Group controlId="formCategoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateCategory}>
            Add Category
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
    </div>
  );
};

export default ProductCategory;
