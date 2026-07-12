import client from '@/api/client'

export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  role: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await client.post<LoginResponse>('/auth/login', credentials)
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token)
      }
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await client.get<User>('/auth/me')
      return response.data
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await client.post<LoginResponse>('/auth/refresh', {})
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token)
      }
      return response.data
    } catch (error) {
      console.error('Token refresh error:', error)
      throw error
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('access_token')
    window.location.href = '/login'
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('access_token')
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export default new AuthService()
