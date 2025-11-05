import apiClient from './apiClient';

const voterService = {
  registerVoter: async (payload) => {
    // payload: { cnicNumber, deviceId, cnicPicture }
    const res = await apiClient.post('/voter/register-voter', payload);
    return res;
  },
  voteCasting: async (payload) => {
    // payload: { cnicNumber, deviceId, candidates }
    const res = await apiClient.post('/voter/vote-casting', payload);
    return res;
  },
  uploadAsset: async (payload) => {
    const res = await apiClient.post('/voter/upload-file', payload);
    return res;
  },
  cnicVerification: async (payload) => {
    const res = await apiClient.post('/voter/cnic-verification', payload);
    return res;
  }
};

export default voterService;
