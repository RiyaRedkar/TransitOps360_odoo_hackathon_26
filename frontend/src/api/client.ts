import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'

const client = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page and token exists
      const currentPath = window.location.pathname
      const hasToken = localStorage.getItem('access_token')
      
      if (currentPath !== '/login' && hasToken) {
        // Clear invalid token
        localStorage.removeItem('access_token')
        console.log('Token invalid or expired, redirecting to login')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
