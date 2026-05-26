import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const ticketApi = {
  getAll: (params) => api.get('/tickets', { params }),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.patch(`/tickets/${id}`, data),
  remove: (id) => api.delete(`/tickets/${id}`),
  stats: () => api.get('/tickets/stats'),
};

export default api;
