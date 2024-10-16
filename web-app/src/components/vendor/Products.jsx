import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Badge, Toast, ToastContainer } from "react-bootstrap";
import ProductForm from "./ProductForm";
import Header from "../Header";
import { getProductByVendorId, deleteProduct, updateProduct } from "../../api/product";
import { useSearch } from "../../SearchContext";

const Products = ({ vendorId }) => {
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    console.log("vendor ID: ", vendorId)
    fetchProducts();
  }, [vendorId]);

  // Fetch products by vendorId API
  const fetchProducts = async () => {
    try {
      const response = await getProductByVendorId(vendorId); 
      setProducts(response); 
    } catch (error) {
      console.error("Error when fetching products:", error);
    }
  };

  // deleting a product
  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId); 
      setToastMessage("Product deleted successfully!");
      setToastType("success");
      setShowToast(true);
      fetchProducts(); // Re-fetch rest of the products
    } catch (error) {
      console.error("Error when deleting product:", error);
      setToastMessage("Failed to delete product.");
      setToastType("danger");
      setShowToast(true);
    }
  };

  // Handle editing a product
  const handleEdit = (product) => {
    setEditingProduct(product); 
  };

  // Handle saving product 
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData); 
        setToastMessage("Product updated successfully!");
        setToastType("success");
        setShowToast(true);
      }
      fetchProducts();
      setEditingProduct(null); // Reset form after save
    } catch (error) {
      console.error("Error happen when saving product:", error);
      setToastMessage("Failed to update product.");
      setToastType("warning");
      setShowToast(true);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <Container style={{ marginLeft: '200px', padding: '20px' }}>
      <Header title="Products"></Header>
      <Row className="mb-5">
        <Col>
          <div className="p-4 border rounded">
            <div
              style={{
                maxHeight: "200px", // table container height
                overflowY: "auto", // vertical scrolling
              }}
            >
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.productId}</td>
                      <td>{product.productName}</td>
                      <td>{product.productType}</td>
                      <td>{product.productDescription}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.isActive ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}</td>
                      <td>
                        <Button
                          className="me-2"
                          onClick={() => handleEdit(product)}
                          style={{
                            backgroundColor: '#066cdb',
                            width: "100px",
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(product.id)}
                          style={{
                            width: "100px",
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>

      {/* form */}
      <Row>
        <Col>
          <div className="p-4 border rounded">
            <h4>{editingProduct ? "Edit Product" : "Create a New Product"}</h4>
            <ProductForm
              onSave={handleSaveProduct}
              editingProduct={editingProduct}
            />
          </div>
        </Col>
      </Row>

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

export default Products;
