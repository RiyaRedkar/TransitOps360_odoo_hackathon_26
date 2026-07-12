import client from '@/api/client'
import type { Trip, TripCreate, TripDispatch, TripUpdate, PaginatedResponse } from '@/types'

class TripService {
  /**
   * Get all trips with optional filters
   */
  async getAll(params?: {
    status?: string
    skip?: number
    limit?: number
  }): Promise<PaginatedResponse<Trip>> {
    const response = await client.get<PaginatedResponse<Trip>>('/trips', { params })
    return response.data
  }

  /**
   * Get trip by ID
   */
  async getById(tripId: string): Promise<Trip> {
    const response = await client.get<Trip>(`/trips/${tripId}`)
    return response.data
  }

  /**
   * Create new trip
   */
  async create(tripData: TripCreate): Promise<Trip> {
    const response = await client.post<Trip>('/trips', tripData)
    return response.data
  }

  /**
   * Dispatch trip with vehicle and driver
   */
  async dispatch(tripId: string, dispatchData: TripDispatch): Promise<Trip> {
    const response = await client.post<Trip>(`/trips/${tripId}/dispatch`, dispatchData)
    return response.data
  }

  /**
   * Update trip
   */
  async update(tripId: string, tripData: TripUpdate): Promise<Trip> {
    const response = await client.put<Trip>(`/trips/${tripId}`, tripData)
    return response.data
  }

  /**
   * Complete trip
   */
  async complete(tripId: string): Promise<Trip> {
    const response = await client.post<Trip>(`/trips/${tripId}/complete`)
    return response.data
  }

  /**
   * Cancel trip
   */
  async cancel(tripId: string): Promise<Trip> {
    const response = await client.post<Trip>(`/trips/${tripId}/cancel`)
    return response.data
  }

  /**
   * Delete trip
   */
  async delete(tripId: string): Promise<void> {
    await client.delete(`/trips/${tripId}`)
  }
}

export default new TripService()
