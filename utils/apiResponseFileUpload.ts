import axios from "axios";
import cookie from "js-cookie";

export const apiResponseFileUpload = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_LIVE_URL
      : process.env.NEXT_PUBLIC_LOCAL_URL,
  headers: {
    Accept: "application/json",
    // DO NOT set Content-Type for multipart/form-data - axios will set it automatically with boundary
  },
  withCredentials: true,
});

// Add request interceptor to dynamically add the token
apiResponseFileUpload.interceptors.request.use((config) => {
  const token = cookie.get("genituToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
