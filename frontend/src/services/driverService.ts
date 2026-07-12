import client from '@/api/client'

export interface Driver {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  license_number: string
  license_expiry: string
  status: 'active' | 'inactive' | 'on_leave'
  experience_years: number
  safety_score: number
  violations: number
  created_at: string
  updated_at: string
}

export interface DriverCreateRequest {
  first_name: string
  last_name: string
  email: string
  phone: string
  license_number: string
  license_expiry: string
  experience_years: number
}

class DriverService {
  /**
   * Get all drivers with optional filters
   */
  async getAll(params?: {
    status?: string
    search?: string
    skip?: number
    limit?: number
  }) {
    try {
      const response = await client.get<Driver[]>('/drivers', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching drivers:', error)
      throw error
    }
  }

  /**
   * Get available drivers for dispatch
   */
  async getAvailable() {
    try {
      const response = await client.get<Driver[]>('/drivers/available')
      return response.data
    } catch (error) {
      console.error('Error fetching available drivers:', error)
      throw error
    }
  }

  /**
   * Get driver by ID
   */
  async getById(driverId: string) {
    try {
      const response = await client.get<Driver>(`/drivers/${driverId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching driver:', error)
      throw error
    }
  }

  /**
   * Create new driver
   */
  async create(driverData: DriverCreateRequest) {
    try {
      const response = await client.post<Driver>('/drivers', driverData)
      return response.data
    } catch (error) {
      console.error('Error creating driver:', error)
      throw error
    }
  }

  /**
   * Update driver
   */
  async update(driverId: string, driverData: Partial<Driver>) {
    try {
      const response = await client.put<Driver>(`/drivers/${driverId}`, driverData)
      return response.data
    } catch (error) {
      console.error('Error updating driver:', error)
      throw error
    }
  }

  /**
   * Update driver status
   */
  async updateStatus(driverId: string, status: string) {
    try {
      const response = await client.patch<Driver>(`/drivers/${driverId}/status`, {
        status,
      })
      return response.data
    } catch (error) {
      console.error('Error updating driver status:', error)
      throw error
    }
  }

  /**
   * Delete driver
   */
  async delete(driverId: string) {
    try {
      await client.delete(`/drivers/${driverId}`)
      return true
    } catch (error) {
      console.error('Error deleting driver:', error)
      throw error
    }
  }
}

export default new DriverService()
