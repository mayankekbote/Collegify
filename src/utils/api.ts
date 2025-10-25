import axios from 'axios';

// Allow overriding the API base via Vite env variable `VITE_API_BASE`.
// On local dev this will fall back to localhost:5000.
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface College {
  id: number;
  college_name: string;
  branch: string;
  cutoff_percentile: number;
  category: 'Open' | 'SC' | 'ST' | 'OBC';
  region: string;
  fees: number;
  median_package: number;
  image_urls: string;
}

export interface CollegeSearchParams {
  percentile: number;
  category: string;
  region?: string;
  branch?: string;
}

export const collegeAPI = {
  search: (params: CollegeSearchParams) => 
    api.post<College[]>('/colleges/search', params),
  
  getAll: () => 
    api.get<College[]>('/colleges'),
  
  getById: (id: number) => 
    api.get<College>(`/colleges/${id}`),
  
  create: (college: Omit<College, 'id'>) => 
    api.post<College>('/colleges', college),
  
  update: (id: number, college: Partial<College>) => 
    api.put<College>(`/colleges/${id}`, college),
  
  delete: (id: number) => 
    api.delete(`/colleges/${id}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

export const quizAPI = {
  submit: (answers: any) => api.post('/quiz/submit', { answers }),
  getResults: () => api.get('/quiz/results'),
};