import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('brewHavenUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect to login if it's NOT a login/register request
    const isAuthRoute = err.config?.url?.includes('/auth/login') ||
                        err.config?.url?.includes('/auth/register');

    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('brewHavenUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
