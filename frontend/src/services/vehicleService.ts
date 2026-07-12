import client from '@/api/client'
import type { Vehicle, VehicleCreate, VehicleUpdate, VehicleStatusUpdate, PaginatedResponse } from '@/types'

class VehicleService {
  /**
   * Get all vehicles with optional filters
   */
  async getAll(params?: {
    status?: string
    search?: string
    skip?: number
    limit?: number
  }): Promise<PaginatedResponse<Vehicle>> {
    const response = await client.get<PaginatedResponse<Vehicle>>('/vehicles', { params })
    return response.data
  }

  /**
   * Get available vehicles for dispatch
   */
  async getAvailable(): Promise<Vehicle[]> {
    const response = await client.get<Vehicle[]>('/vehicles/available')
    return response.data
  }

  /**
   * Get vehicle by ID
   */
  async getById(vehicleId: string): Promise<Vehicle> {
    const response = await client.get<Vehicle>(`/vehicles/${vehicleId}`)
    return response.data
  }

  /**
   * Create new vehicle
   */
  async create(vehicleData: VehicleCreate): Promise<Vehicle> {
    const response = await client.post<Vehicle>('/vehicles', vehicleData)
    return response.data
  }

  /**
   * Update vehicle
   */
  async update(vehicleId: string, vehicleData: VehicleUpdate): Promise<Vehicle> {
    const response = await client.put<Vehicle>(`/vehicles/${vehicleId}`, vehicleData)
    return response.data
  }

  /**
   * Update vehicle status
   */
  async updateStatus(vehicleId: string, status: VehicleStatusUpdate): Promise<Vehicle> {
    const response = await client.patch<Vehicle>(`/vehicles/${vehicleId}/status`, status)
    return response.data
  }

  /**
   * Delete vehicle
   */
  async delete(vehicleId: string): Promise<void> {
    await client.delete(`/vehicles/${vehicleId}`)
  }
}

export default new VehicleService()
