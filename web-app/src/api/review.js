import axios from 'axios';

const API_URL = 'http://localhost:5003/api/Review'; 

// create a new review
export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating a review:', error);
    throw error;
  }
};

// get all reviews
export const getAllReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

// get reviews by vendor ID
export const getReviewsByVendorId = async (vendorId) => {
  try {
    const response = await axios.get(`${API_URL}/get-by-vendorId/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews by vendor ID ${vendorId}:`, error);
    throw error;
  }
};

// get reviews by product ID
export const getReviewsByProductId = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/get-by-productId/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews by product ID ${productId}:`, error);
    throw error;
  }
};

// get reviews by order ID
export const getReviewsByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/get-by-orderId/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews by order ID ${orderId}:`, error);
    throw error;
  }
};
