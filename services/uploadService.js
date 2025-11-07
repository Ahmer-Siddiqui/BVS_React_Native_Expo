import axios from "axios";
import { BASE_URL } from "../constants/endpoints";

const uploadService = {
  uploadFile: async ({ uri, fieldName = "file", fileDirName = "cnic" }) => {
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append(fieldName, { uri, name: filename, type });
      formData.append("fileDirName", fileDirName);

      const res = await axios.post(`${BASE_URL}/voter/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.data?.fileUrl) {
        return res.data.data.fileUrl; // ✅ Return clean URL only
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("uploadFile error:", error.message);
      throw error;
    }
  },
};

export default uploadService;
