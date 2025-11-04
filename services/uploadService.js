import axios from 'axios';
import { BASE_URL } from '../constants/endpoints';

const uploadService = {
  uploadFile: async ({ uri, fieldName = 'file', fileDirName = 'cnic' }) => {
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append(fieldName, { uri, name: filename, type });
    formData.append('fileDirName', fileDirName);

    const res = await axios.post(`${BASE_URL}/voter/upload-file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

export default uploadService;
