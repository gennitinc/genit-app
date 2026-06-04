import axios from "axios";
import cookie from "js-cookie";

//api controller
export const apiResponse = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_LIVE_URL
      : process.env.NEXT_PUBLIC_LOCAL_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to dynamically add the token
apiResponse.interceptors.request.use((config) => {
  const token = cookie.get("genituToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const clientUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_CLIENT_LIVE_URL
    : process.env.NEXT_PUBLIC_CLIENT_URL;

export const serverUrlSocket =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIVE_SOCKET_URL
    : process.env.NEXT_PUBLIC_LOCAL_SOCKET_URL;
