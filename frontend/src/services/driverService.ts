import client from '@/api/client'
import type { Driver, DriverCreate, DriverUpdate, PaginatedResponse } from '@/types'

class DriverService {
  /**
   * Get all drivers with optional filters
   */
  async getAll(params?: {
    status?: string
    search?: string
    skip?: number
    limit?: number
  }): Promise<PaginatedResponse<Driver>> {
    const response = await client.get<PaginatedResponse<Driver>>('/drivers', { params })
    return response.data
  }

  /**
   * Get available drivers for dispatch
   */
  async getAvailable(): Promise<Driver[]> {
    const response = await client.get<Driver[]>('/drivers/available')
    return response.data
  }

  /**
   * Get driver by ID
   */
  async getById(driverId: string): Promise<Driver> {
    const response = await client.get<Driver>(`/drivers/${driverId}`)
    return response.data
  }

  /**
   * Create new driver
   */
  async create(driverData: DriverCreate): Promise<Driver> {
    const response = await client.post<Driver>('/drivers', driverData)
    return response.data
  }

  /**
   * Update driver
   */
  async update(driverId: string, driverData: DriverUpdate): Promise<Driver> {
    const response = await client.put<Driver>(`/drivers/${driverId}`, driverData)
    return response.data
  }

  /**
   * Delete driver
   */
  async delete(driverId: string): Promise<void> {
    await client.delete(`/drivers/${driverId}`)
  }
}

export default new DriverService()
