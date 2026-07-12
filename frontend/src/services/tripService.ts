import client from '@/api/client'

export interface Trip {
  id: string
  vehicle_id: string
  driver_id: string
  origin: string
  destination: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  distance: number
  duration: number
  fuel_consumed: number
  cost: number
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface TripCreateRequest {
  vehicle_id: string
  driver_id: string
  origin: string
  destination: string
}

class TripService {
  /**
   * Get all trips with optional filters
   */
  async getAll(params?: {
    status?: string
    skip?: number
    limit?: number
  }) {
    try {
      const response = await client.get<Trip[]>('/trips', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching trips:', error)
      throw error
    }
  }

  /**
   * Get trip by ID
   */
  async getById(tripId: string) {
    try {
      const response = await client.get<Trip>(`/trips/${tripId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching trip:', error)
      throw error
    }
  }

  /**
   * Create new trip
   */
  async create(tripData: TripCreateRequest) {
    try {
      const response = await client.post<Trip>('/trips', tripData)
      return response.data
    } catch (error) {
      console.error('Error creating trip:', error)
      throw error
    }
  }

  /**
   * Update trip status
   */
  async updateStatus(tripId: string, status: string) {
    try {
      const response = await client.patch<Trip>(`/trips/${tripId}/status`, {
        status,
      })
      return response.data
    } catch (error) {
      console.error('Error updating trip status:', error)
      throw error
    }
  }

  /**
   * Complete trip
   */
  async complete(tripId: string, tripData?: Partial<Trip>) {
    try {
      const response = await client.patch<Trip>(`/trips/${tripId}/status`, {
        status: 'completed',
        ...tripData,
      })
      return response.data
    } catch (error) {
      console.error('Error completing trip:', error)
      throw error
    }
  }

  /**
   * Cancel trip
   */
  async cancel(tripId: string) {
    try {
      const response = await client.patch<Trip>(`/trips/${tripId}/status`, {
        status: 'cancelled',
      })
      return response.data
    } catch (error) {
      console.error('Error cancelling trip:', error)
      throw error
    }
  }
}

export default new TripService()
