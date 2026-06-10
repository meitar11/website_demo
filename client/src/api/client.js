import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchProducts({ category, search } = {}) {
  const { data } = await api.get('/products', {
    params: { category, search },
  });
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get('/products/categories');
  return data.categories;
}

export async function fetchProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
}

export async function fetchProductStats() {
  const { data } = await api.get('/products/stats');
  return data.stats;
}

export async function sendContactMessage(payload) {
  const { data } = await api.post('/contact', payload);
  return data;
}
