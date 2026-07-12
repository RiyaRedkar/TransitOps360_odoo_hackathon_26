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
      console.log('🔑 Request with token to:', config.url)
    } else {
      console.warn('⚠️ No token found for request to:', config.url)
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
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.detail || error.message
    })
    
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      
      console.log('🚨 401 Error - Current path:', currentPath)
      
      // Don't redirect if we're already on the login page or it's the login request itself
      if (currentPath !== '/login' && !error.config?.url?.includes('/auth/login')) {
        console.log('🔄 Unauthorized, clearing token and redirecting')
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
