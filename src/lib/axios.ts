import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  withCredentials: true, // Enable credentials for all requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add interceptor to include the auth token in requests
axiosInstance.interceptors.request.use((config) => {
  // Get the token directly from localStorage
  const token = localStorage.getItem("user_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to handle unauthorized responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors - redirect to login
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request detected");
      // Clear authentication data
      localStorage.removeItem("user");
      localStorage.removeItem("user_token");

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
