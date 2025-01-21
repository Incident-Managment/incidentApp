import axios from 'axios';

export const baseURL = process.env.VITE_API_URL || 'http://192.168.3.54:3000/api/';

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${baseURL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${baseURL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};