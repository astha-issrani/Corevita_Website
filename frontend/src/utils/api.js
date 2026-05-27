import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('corevita_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProducts = () => API.get('/products');
export const getProduct = (slug) => API.get(`/products/${slug}`);
export const getFeaturedProducts = () => API.get('/products/featured');
export const createOrder = (data) => API.post('/orders', data);
export const trackOrder = (data) => API.post('/orders/track', data);
export const loginUser = (data) => API.post('/users/login', data);
export const registerUser = (data) => API.post('/users/register', data);
export const subscribeEmail = (email) => API.post('/users/subscribe', { email });

export default API;
