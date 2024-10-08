import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Notification';

// create notification
export const createNotification = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// get notifications by user ID
export const getNotificationsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/get-for-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications by user ID:', error);
    throw error;
  }
};

// get all notifications
export const getAllNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all`);
    return response.data;
  } catch (error) {
    console.error('Error occured when fetching all notifications:', error);
    throw error;
  }
}
