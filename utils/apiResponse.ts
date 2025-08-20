import axios from "axios";
import cookie from "js-cookie";

const gennituToken = cookie.get("gennituToken");

//api controller
export const apiResponse = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_LIVE_URL
      : process.env.NEXT_PUBLIC_LOCAL_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + gennituToken,
  },
  withCredentials: true,
});

export const clientUrl =
  process.env.NODE_ENV === "production"
    ? "https://gennit-client.vercel.app/"
    : "http://localhost:3000/";

export const serverUrlSocket =  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIVE_SOCKET_URL
    : process.env.NEXT_PUBLIC_LOCAL_SOCKET_URL;

