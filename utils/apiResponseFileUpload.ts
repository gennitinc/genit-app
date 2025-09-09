import axios from "axios";
import cookie from "js-cookie";

export const apiResponseFileUpload = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_LIVE_URL
      : process.env.NEXT_PUBLIC_LOCAL_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to dynamically add the token
apiResponseFileUpload.interceptors.request.use((config) => {
  const token = cookie.get("gennituToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
