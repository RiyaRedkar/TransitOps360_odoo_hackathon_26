import { useQuery } from '@tanstack/react-query'
import intelligenceService from '@/services/intelligenceService'

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['intelligence', 'dashboard-summary'],
    queryFn: () => intelligenceService.getDashboardSummary(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useFleetHealth = () => {
  return useQuery({
    queryKey: ['intelligence', 'fleet-health'],
    queryFn: () => intelligenceService.getFleetHealth(),
    refetchInterval: 60000, // Refetch every minute
  })
}

export const useComplianceAlerts = () => {
  return useQuery({
    queryKey: ['intelligence', 'compliance-alerts'],
    queryFn: () => intelligenceService.getComplianceAlerts(),
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}

export const useDispatchRecommendations = (tripId: string, cargoWeightKg: number) => {
  return useQuery({
    queryKey: ['intelligence', 'dispatch-recommendations', tripId, cargoWeightKg],
    queryFn: () => intelligenceService.getDispatchRecommendations(tripId, cargoWeightKg),
    enabled: !!tripId && cargoWeightKg > 0,
  })
}

export const useCostIntelligence = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['intelligence', 'cost-intelligence', startDate, endDate],
    queryFn: () => intelligenceService.getCostIntelligence(startDate, endDate),
  })
}
