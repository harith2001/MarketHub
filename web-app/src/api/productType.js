import axios from 'axios';

const API_URL = 'http://localhost:5003/api/ProductType';

// create a new product type
export const createProductType = async (productTypeData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, productTypeData);
    return response.data;
  } catch (error) {
    console.error('Error creating product type:', error);
    throw error;
  }
};

// get all product types
export const getAllProductTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product types:', error);
    throw error;
  }
};

// delete a product type by ID
export const deleteProductType = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product type:', error);
    throw error;
  }
};
