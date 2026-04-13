import http from './http';

export const createCandidate = async (payload) => {
  const response = await http.post('/candidates', payload);
  return response.data;
};
