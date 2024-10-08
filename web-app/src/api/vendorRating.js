import axios from 'axios';

const API_URL = 'http://localhost:5000/api/VendorRating';

// Create Vendor Rating
export const createVendorRating = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating vendor rating:', error);
    throw error;
  }
};

// Get Vendor Rating by Vendor ID
export const getVendorRatingById = async (vendorId) => {
  try {
    const response = await axios.get(`${API_URL}/byVendorId/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor rating by ID:', error);
    throw error;
  }
};

// Get Vendor Rating by Vendor Name
export const getVendorRatingByName = async (vendorName) => {
  try {
    const response = await axios.get(`${API_URL}/byVendorName/${vendorName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor rating by name:', error);
    throw error;
  }
};

// Get All Vendor Ratings
export const getAllVendorRatings = async () => {
  try {
    const response = await axios.get(`${API_URL}/AllVendorRatings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all vendor ratings:', error);
    throw error;
  }
};

// Get Vendor Rating Average by Vendor ID
export const getVendorRatingAverage = async (vendorId) => {
  try {
    const response = await axios.get(`${API_URL}/average/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor rating average:', error);
    throw error;
  }
};
