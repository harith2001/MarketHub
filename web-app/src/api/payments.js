import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Payment';

// Create a payment
export const createPayment = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    throw error;
  }
};

// Get payment by order ID
export const getPaymentByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment by order ID:', error);
    throw error;
  }
};
