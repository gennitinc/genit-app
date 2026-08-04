import cookie from "js-cookie";
import axios from "axios";

const API_BASE_URL =
  (process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIVE_URL
    : process.env.NEXT_PUBLIC_LOCAL_URL) || "http://localhost:8000/api/v1/";

//api controller
export const apiResponse = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to dynamically add the token
apiResponse.interceptors.request.use((config) => {
  if (
    typeof FormData !== "undefined" &&
    config.data instanceof FormData &&
    config.headers
  ) {
    delete config.headers["Content-Type"];
  }
  if (typeof window !== "undefined") {
    const token = cookie.get("genituToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (
      process.env.NODE_ENV !== "production" &&
      typeof config.url === "string" &&
      config.url.includes("/inspire/generate/")
    ) {
      const url = new URL(config.url, config.baseURL || API_BASE_URL);
      console.info("[api] generation request", {
        method: config.method,
        url: url.toString(),
      });
    }
  }
  return config;
});

export const clientUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_CLIENT_LIVE_URL
    : process.env.NEXT_PUBLIC_CLIENT_URL;

export const serverUrlSocket =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIVE_SOCKET_URL ||
      API_BASE_URL.replace(/\/api\/v1\/?$/, "")
    : process.env.NEXT_PUBLIC_LOCAL_SOCKET_URL ||
      API_BASE_URL.replace(/\/api\/v1\/?$/, "");
