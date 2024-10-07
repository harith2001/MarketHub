import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Badge } from "react-bootstrap";
import ProductForm from "./ProductForm";
import Header from "../Header";
import { getProductByVendorId, deleteProduct, updateProduct } from "../../api/product";

const Products = ({ vendorId}) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
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
      fetchProducts(); // Re-fetch rest of the products
    } catch (error) {
      console.error("Error when deleting product:", error);
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
        console.log("Successfully updated the product");
      }
      fetchProducts();
      setEditingProduct(null); // Reset form after save
    } catch (error) {
      console.error("Error happen when saving product:", error);
    }
  };

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
              <Table striped bordered hover responsive>
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
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.description}</td>
                      <td>{product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.status === 'Active' ? (
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
    </Container>
  );
};

export default Products;
