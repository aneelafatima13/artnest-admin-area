import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // important if backend uses cookies
});

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Session expired
      toast.error("Session expired! Redirecting to login...", { position: "top-right" });

      // Wait 2 seconds to show toast
      setTimeout(async () => {
        try {
          // Call backend logout API to destroy server session
          await axios.post("http://localhost:5000/api/logout"); // make sure you have this endpoint
  } catch (err) {
          console.error("Backend logout failed:", err);
        }

        // Clear frontend session
        sessionStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "/";
      }, 2000);
    }
    return Promise.reject(error);
  }
);

export default instance;
