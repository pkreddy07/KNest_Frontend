import { apiCall } from "../utils/api.js";

export const authService = {
  login: (email, password) => apiCall("/auth/login", {
    method: "POST",
    body: { email, password }
  }),

  register: (userData) => apiCall("/auth/register", {
    method: "POST",
    body: userData
  }),

  verifyEmail: (userId, otp) => apiCall("/auth/verify", {
    method: "POST",
    body: { userId, otp }
  }),

  logout: () => {
    localStorage.removeItem("token");
    window.location.hash = "#login";
    // Optional backend call
    // return apiCall("/auth/logout", { method: "POST" });
  },

  getMe: () => apiCall("/auth/me", { method: "GET" })
};
