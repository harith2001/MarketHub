import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Badge } from "react-bootstrap";
import ProductForm from "../components/vendor/ProductForm";
import Header from "../components/Header";

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: "101",
      name: "Apple",
      category: "Fruits",
      description: "Fresh and juicy apples",
      price: 2.5,
      stock: 100,
      status: true,
    },
    {
      id: "102",
      name: "Orange",
      category: "Fruits",
      description: "Sweet and tangy oranges",
      price: 1.8,
      stock: 50,
      status: false,
    },
    {
      id: "103",
      name: "Laptop",
      category: "Electronics",
      description: "High-performance laptop",
      price: 1200,
      stock: 20,
      status: false,
    },
    {
      id: "104",
      name: "Headphones",
      category: "Electronics",
      description: "Noise-cancelling headphones",
      price: 150,
      stock: 75,
      status: true,
    },
    {
      id: "105",
      name: "Banana",
      category: "Fruits",
      description: "Fresh ripe bananas",
      price: 1.2,
      stock: 200,
      status: true,
    },
  ]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      //const result = await getProducts(); // Fetch products from API
      //setProducts(result.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle deleting a product
  const handleDelete = async (productId) => {
    try {
      //await deleteProduct(productId);
      fetchProducts(); // Re-fetch products after deleting one
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle editing a product
  const handleEdit = (product) => {
    setEditingProduct(product); // Set the product data to edit
  };

  // Handle saving product 
  const handleSaveProduct = (productData) => {
    console.log("Product data:", productData);
    // save the product and refresh product list
    fetchProducts();
    setEditingProduct(null); // Reset form after save
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
