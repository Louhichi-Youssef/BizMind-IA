import api from './api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generate a new business plan
export const generateBusinessPlan = async (inputs) => {
  const res = await api.post('/business-plans/generate', inputs, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Fetch all plans for the logged-in user
export const getMyPlans = async () => {
  const res = await api.get('/business-plans', {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Fetch a single plan by ID
export const getPlanById = async (id) => {
  const res = await api.get(`/business-plans/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Delete a plan by ID
export const deletePlan = async (id) => {
  const res = await api.delete(`/business-plans/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
