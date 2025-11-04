import apiClient from './apiClient';

const candidateService = {
  getCandidates: async (cnicNumber) => {
    const res = await apiClient.get(`/voter/${cnicNumber}/candidate`);
    return res;
  }
};

export default candidateService;
