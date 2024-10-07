import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Order';

// Create an order
export const createOrder = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order by customer ID
export const getOrderByCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order by customer ID:', error);
    throw error;
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/AllOrders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/${status}`);
    return response.data; // Return the response data (e.g., updated order)
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
}
