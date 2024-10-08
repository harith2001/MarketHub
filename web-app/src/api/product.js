import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Product';

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// Get active products
export const getAllActiveProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-active-products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductByVendorId = async (vendorId) => {
  try {
    const response = await axios.get(`${API_URL}/get-by-vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by vendor ID:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/get-by-productId/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Add new product
export const addNewProduct = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/add-new-product`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, data) => {
  try {
    const response = await axios.patch(`${API_URL}/update-product/${productId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get stock status by vendor ID
export const getStockStatus = async (vendorId) => {
  try {
    const response = await axios.get(`${API_URL}/get-stock-status/${vendorId}`);
    return response.data; 
  } catch (error) {
    console.error('Error when fetching stock status:', error);
    throw error; 
  }
};

