import axios from "axios";
import { BASE_URL } from "../constants/endpoints";

const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadService = {
  uploadFile: async ({ uri, fieldName = "file", fileDirName = "cnic" }, retryCount = 0) => {
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append(fieldName, { uri, name: filename, type });
      formData.append("fileDirName", fileDirName);

      console.log(`Uploading to: ${BASE_URL}/voter/upload-file (attempt ${retryCount + 1})`);

      const res = await axios.post(`${BASE_URL}/voter/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: TIMEOUT,
      });

      console.log("Upload successful:", res.data.data.fileUrl);

      if (res.data?.data?.fileUrl) {
        return res.data.data.fileUrl;
      } else {
        throw new Error("File upload failed - no fileUrl in response");
      }
    } catch (error) {
      console.error(`uploadFile error (attempt ${retryCount + 1}):`, error.message);
      
      // Retry on network errors
      if (retryCount < MAX_RETRIES - 1 && 
          (error.message === "Network Error" || error.code === "ECONNABORTED")) {
        console.log(`Retrying upload in 2 seconds...`);
        await delay(2000);
        return uploadService.uploadFile({ uri, fieldName, fileDirName }, retryCount + 1);
      }
      
      throw error;
    }
  },
};

export default uploadService;
