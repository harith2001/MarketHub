import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge, Container, Modal, Form, Toast, ToastContainer, Tabs, Tab } from 'react-bootstrap';
import Header from '../../components/Header';
import { getAllProducts, updateProduct, deleteProduct, updateProductStatus } from '../../api/product';
import { useSearch } from '../../SearchContext';
import ProductCategory from './ProductCategory';

const ManageProducts = () => {
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null); 
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

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
  const toggleProductStatus = (productId, isActive) => {
    setSelectedProductId(productId);
    setCurrentAction(isActive ? 'deactivate' : 'activate'); // Set action type
    setShowConfirmModal(true); // Show the confirmation modal
  };

  const confirmToggleStatus = async () => {
    try {
      const updatedProduct = await updateProductStatus(selectedProductId, currentAction === 'activate'); // Call API
      const updatedProducts = products.map(product =>
        product.productId === selectedProductId ? { ...product, isActive: updatedProduct.isActive } : product
      );
      setProducts(updatedProducts);

      // Toast messages
      setToastMessage(updatedProduct.isActive ? 'Product activated successfully!' : 'Product deactivated successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to update product status:', error);
    } finally {
      setShowConfirmModal(false); // Close the modal
      setSelectedProductId(null); // Reset product ID
      setCurrentAction(null); // Reset action
    }
  };

  // Handle product removal
  const handleRemoveProduct = async () => {
    try {
      await deleteProduct(productToRemove); // Call the function to delete the product
      const updatedProducts = products.filter(product => product.productId !== productToRemove);
      setProducts(updatedProducts); // Update the state to remove the product

      // Toast message
      setToastMessage('Product removed successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to remove product:', error);
    } finally {
      setShowRemoveConfirmModal(false); // Close the removal modal
      setProductToRemove(null); // Reset product to remove
    }
  };

  // Open modal to confirm removal
  const confirmRemoveProduct = (productId) => {
    setProductToRemove(productId);
    setShowRemoveConfirmModal(true);
  };
  
  // Open modal to edit product details
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Save product edits
  const handleSaveEdit = async () => {
    try {
      const updatedProductData = {
        id: editingProduct.id, // Include ID if needed
        productId: editingProduct.productId,
        productName: editingProduct.productName,
        productType: editingProduct.productType,
        price: editingProduct.price,
        vendorId: editingProduct.vendorId,
        quantity: editingProduct.quantity,
        isActive: editingProduct.isActive,
        lowerMargin: editingProduct.lowerMargin,
        restockRequired: editingProduct.restockRequired,
        productDescription: editingProduct.productDescription,
        createdDate: editingProduct.createdDate,
        updatedDate: new Date().toISOString(), // Update to current date
        productImage: editingProduct.productImage,
      };

      const updatedProduct = await updateProduct(editingProduct.productId, updatedProductData); // Call the function to update the product
      const updatedProducts = products.map(product =>
        product.productId === updatedProduct.productId ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setShowEditModal(false);

      // Toast message
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

   // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vendorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container style={{ marginLeft: "200px", padding: "20px" }}>
      <Header title="Products"></Header>
      <Tabs defaultActiveKey="products" id="manage-products-tabs" className="mb-3">
        <Tab eventKey="products" title={`Products List (${filteredProducts.length})`}>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <Table striped hover responsive className="table-borderless">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price ($)</th>
              <th>Vendor ID</th>
              <th>Stock</th>
              <th>Stock Margin</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.productType}</td>
                <td>{product.price}</td>
                <td>{product.vendorId}</td>
                <td>{product.quantity}</td>
                <td>{product.lowerMargin}</td>
                <td>
                  {product.isActive ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="secondary">Inactive</Badge>
                  )}
                </td>
                <td style={{ padding: "10px 15px" }}>
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
                    className='ms-2 me-2'
                      onClick={() => toggleProductStatus(product.productId, product.isActive)}
                      style={{
                        width: "100px",
                      }}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                    variant="danger"
                    className='ms-2 me-2'
                    onClick={() => confirmRemoveProduct(product.productId)}
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
        </Tab>
        
        <Tab eventKey="categories" title="Product Categories">
          <ProductCategory/>
        </Tab>
      </Tabs>

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
                  name="productName"
                  value={editingProduct.productName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formProductCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="productType"
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
                  name="quantity"
                  value={editingProduct.quantity}
                  onChange={handleEditChange}
                />
              </Form.Group>
              {/* <Form.Group controlId="formProductImage" className="mb-3">
                <Form.Label>Product Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="productImage"
                  value={editingProduct.productImage}
                  onChange={handleEditChange}
                />
              </Form.Group> */}
              <Form.Group controlId="formProductDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="productDescription"
                  value={editingProduct.productDescription}
                  onChange={handleEditChange}
                />
              </Form.Group>
              {/* <Form.Group controlId="formVendorId" className="mb-3">
                <Form.Label>Vendor ID</Form.Label>
                <Form.Control
                  type="text"
                  name="vendorId"
                  value={editingProduct.vendorId}
                  onChange={handleEditChange}
                />
              </Form.Group> */}
              <Form.Group controlId="formLowerMargin" className="mb-3">
                <Form.Label>Lower Margin</Form.Label>
                <Form.Control
                  type="number"
                  name="lowerMargin"
                  value={editingProduct.lowerMargin}
                  onChange={handleEditChange}
                />
              </Form.Group>
              {/* <Form.Group controlId="formRestockRequired" className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="restockRequired"
                  label="Restock Required"
                  checked={editingProduct.restockRequired}
                  onChange={(e) => handleEditChange({ target: { name: 'restockRequired', value: e.target.checked } })}
                />
              </Form.Group> */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Confirmation Modal for Activate/Deactivate */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {currentAction} this product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmToggleStatus}>
            {currentAction === 'activate' ? 'Activate' : 'Deactivate'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Removal */}
      <Modal show={showRemoveConfirmModal} onHide={() => setShowRemoveConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove this product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => setShowRemoveConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRemoveProduct}>
            Remove
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
