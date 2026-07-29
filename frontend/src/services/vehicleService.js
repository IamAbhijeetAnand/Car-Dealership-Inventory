import api from './api';

export const fetchVehicles = async (params) => {
  const response = await api.get('/vehicles', { params });
  return response.data;
};

export const fetchVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(`/vehicles/${id}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};

export const purchaseVehicle = async (purchaseData) => {
  const response = await api.post('/inventory/purchase', purchaseData);
  return response.data;
};

export const restockVehicle = async (restockData) => {
  const response = await api.post('/inventory/restock', restockData);
  return response.data;
};

export const fetchMyPurchases = async () => {
  const response = await api.get('/inventory/my-history');
  return response.data;
};

export const fetchAdminDashboardMetrics = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};

export const fetchAllTransactions = async () => {
  const response = await api.get('/inventory/all-transactions');
  return response.data;
};
