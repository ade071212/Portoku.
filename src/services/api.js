import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const isGAS = API_URL.includes('script.google.com');

const getAuth = (config = {}) => {
  const token = localStorage.getItem('token');
  if (token) {
    return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } };
  }
  return config;
};

// Custom API wrapper to support both old Express and new Serverless/Google Apps Script
const api = {
  get: async (path) => {
    if (isGAS) {
      const endpoint = path.replace('/', '');
      const res = await fetch(`${API_URL}?endpoint=${endpoint}`);
      const data = await res.json();
      return { data };
    }
    return axios.get(`${API_URL}${path}`, getAuth());
  },
  post: async (path, payload, config) => {
    // Intercept image uploads to ImgBB
    if (path === '/upload' || path === '/api/upload') {
       const file = payload.get('file');
       const imgBBKey = import.meta.env.VITE_IMGBB_API_KEY;
       
       if (!imgBBKey) {
         if (!isGAS) return axios.post(`${API_URL}/upload`, payload, getAuth(config));
         throw new Error("Missing VITE_IMGBB_API_KEY in .env");
       }
       
       const imgData = new FormData();
       imgData.append('image', file);
       const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
         method: 'POST',
         body: imgData
       });
       const data = await res.json();
       if (data.success) {
         // Return mimicking the old local backend response { url: ... }
         // We only return the relative path in the old backend, but for imgBB we return the full URL
         // Note: AdminDashboard expects either full URL or prepends localhost. 
         // Since ImgBB gives full URL, we must make sure AdminDashboard doesn't double prepend.
         return { data: { url: data.data.url, isFullUrl: true } };
       }
       throw new Error("ImgBB upload failed");
    }

    if (isGAS) {
      const endpoint = path.replace('/', '');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'POST', endpoint, payload })
      });
      const data = await res.json();
      return { data: data.data }; 
    }
    return axios.post(`${API_URL}${path}`, payload, getAuth(config));
  },
  put: async (path, payload) => {
    if (isGAS) {
      const parts = path.split('/').filter(Boolean);
      const endpoint = parts[0];
      const id = parts[1] || null;
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'PUT', endpoint, id, payload })
      });
      const data = await res.json();
      return { data: data.data }; 
    }
    return axios.put(`${API_URL}${path}`, payload, getAuth());
  },
  delete: async (path) => {
    if (isGAS) {
      const parts = path.split('/').filter(Boolean);
      const endpoint = parts[0];
      const id = parts[1];
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'DELETE', endpoint, id })
      });
      const data = await res.json();
      return { data: data.data }; 
    }
    return axios.delete(`${API_URL}${path}`, getAuth());
  }
};

export default api;
