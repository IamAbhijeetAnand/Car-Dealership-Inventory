import api from './api';

export const fetchAIRecommendations = async (preferences) => {
  const response = await api.post('/ai/recommend', preferences);
  return response.data;
};
