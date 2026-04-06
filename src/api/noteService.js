import { apiCall } from "../utils/api.js";

export const noteService = {
  uploadNote: (formData) => apiCall("/notes/upload", {
    method: "POST",
    body: formData // FormData prevents JSON serialization in apiCall
  }),

  getPublicNotes: (page = 1, limit = 10, search = "") => 
    apiCall(`/notes/public?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, { method: "GET" }),

  getMyNotes: () => apiCall("/notes/my-notes", { method: "GET" }),

  getNoteById: (id) => apiCall(`/notes/${id}`, { method: "GET" }),

  deleteNote: (id) => apiCall(`/notes/${id}`, { method: "DELETE" }),

  getTrending: () => apiCall("/notes/trending", { method: "GET" }),

  getRecommended: () => apiCall("/notes/recommended", { method: "GET" }),

  getTopContributor: () => apiCall("/notes/top-contributor", { method: "GET" }),

  voteNote: (id, voteType) => apiCall(`/notes/${id}/vote`, {
    method: "POST",
    body: { vote_type: voteType } // "upvote" or "downvote"
  }),

  reportNote: (id, reason) => apiCall(`/notes/${id}`, {
    method: "POST",
    body: { reason }
  }),
  
  downloadNote: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not Authorized: Please log in to download.");
    
    try {
      const response = await fetch(`http://localhost:5000/api/notes/download/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        let msg = "Not Authorized";
        try { const data = await response.json(); msg = data.message; } catch(e){}
        throw new Error(msg);
      }
      
      // Since fetch adheres to HTTP standard, it automatically follows the Cloudinary 302 redirect.
      // The final redirected URL is exposed in response.url!
      window.open(response.url, "_blank");
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  }
};
