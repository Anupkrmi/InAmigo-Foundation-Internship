import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const analyzeText = async (text) => {
  const response = await axios.post(`${API_URL}/analyze`, { text });
  return response.data;
};