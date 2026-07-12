import client from '@/api/client'
import type {
  DashboardSummary,
  FleetHealthResponse,
  ComplianceResponse,
  DispatchRecommendationResponse,
  CostIntelligence,
} from '@/types'

class IntelligenceService {
  /**
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await client.get<DashboardSummary>('/intelligence/dashboard-summary')
    return response.data
  }

  /**
   * Get fleet health distribution
   */
  async getFleetHealth(): Promise<FleetHealthResponse> {
    const response = await client.get<FleetHealthResponse>('/intelligence/fleet-health')
    return response.data
  }

  /**
   * Get compliance alerts
   */
  async getComplianceAlerts(): Promise<ComplianceResponse> {
    const response = await client.get<ComplianceResponse>('/intelligence/compliance-alerts')
    return response.data
  }

  /**
   * Get dispatch recommendations for a trip
   */
  async getDispatchRecommendations(
    tripId: string,
    cargoWeightKg: number
  ): Promise<DispatchRecommendationResponse> {
    const response = await client.get<DispatchRecommendationResponse>(
      `/intelligence/dispatch-recommendations/${tripId}`,
      {
        params: { cargo_weight_kg: cargoWeightKg },
      }
    )
    return response.data
  }

  /**
   * Get cost intelligence
   */
  async getCostIntelligence(
    startDate?: string,
    endDate?: string
  ): Promise<CostIntelligence> {
    const response = await client.get<CostIntelligence>('/intelligence/cost-intelligence', {
      params: { start_date: startDate, end_date: endDate },
    })
    return response.data
  }
}

export default new IntelligenceService()
