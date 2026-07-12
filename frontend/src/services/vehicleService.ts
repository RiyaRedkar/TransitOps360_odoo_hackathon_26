import client from '@/api/client'

export interface Vehicle {
  id: string
  plate: string
  make: string
  model: string
  year: number
  vin: string
  status: 'available' | 'on_trip' | 'maintenance' | 'retired'
  fuel_type: string
  capacity: number
  current_mileage: number
  fuel_level: number
  health_score: number
  created_at: string
  updated_at: string
}

export interface VehicleCreateRequest {
  plate: string
  make: string
  model: string
  year: number
  vin: string
  fuel_type: string
  capacity: number
}

class VehicleService {
  /**
   * Get all vehicles with optional filters
   */
  async getAll(params?: {
    status?: string
    search?: string
    skip?: number
    limit?: number
  }) {
    try {
      const response = await client.get<Vehicle[]>('/vehicles', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      throw error
    }
  }

  /**
   * Get available vehicles for dispatch
   */
  async getAvailable() {
    try {
      const response = await client.get<Vehicle[]>('/vehicles/available')
      return response.data
    } catch (error) {
      console.error('Error fetching available vehicles:', error)
      throw error
    }
  }

  /**
   * Get vehicle by ID
   */
  async getById(vehicleId: string) {
    try {
      const response = await client.get<Vehicle>(`/vehicles/${vehicleId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      throw error
    }
  }

  /**
   * Create new vehicle
   */
  async create(vehicleData: VehicleCreateRequest) {
    try {
      const response = await client.post<Vehicle>('/vehicles', vehicleData)
      return response.data
    } catch (error) {
      console.error('Error creating vehicle:', error)
      throw error
    }
  }

  /**
   * Update vehicle
   */
  async update(vehicleId: string, vehicleData: Partial<Vehicle>) {
    try {
      const response = await client.put<Vehicle>(`/vehicles/${vehicleId}`, vehicleData)
      return response.data
    } catch (error) {
      console.error('Error updating vehicle:', error)
      throw error
    }
  }

  /**
   * Update vehicle status
   */
  async updateStatus(vehicleId: string, status: string) {
    try {
      const response = await client.patch<Vehicle>(`/vehicles/${vehicleId}/status`, {
        status,
      })
      return response.data
    } catch (error) {
      console.error('Error updating vehicle status:', error)
      throw error
    }
  }

  /**
   * Delete vehicle
   */
  async delete(vehicleId: string) {
    try {
      await client.delete(`/vehicles/${vehicleId}`)
      return true
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      throw error
    }
  }
}

export default new VehicleService()
