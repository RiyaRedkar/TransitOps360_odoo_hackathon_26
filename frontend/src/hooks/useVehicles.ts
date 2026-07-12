import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import vehicleService from '@/services/vehicleService'
import type { VehicleCreate, VehicleUpdate, VehicleStatusUpdate } from '@/types'

export const useVehicles = (params?: {
  status?: string
  search?: string
  skip?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.getAll(params),
  })
}

export const useAvailableVehicles = () => {
  return useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: () => vehicleService.getAvailable(),
  })
}

export const useVehicle = (vehicleId: string) => {
  return useQuery({
    queryKey: ['vehicles', vehicleId],
    queryFn: () => vehicleService.getById(vehicleId),
    enabled: !!vehicleId,
  })
}

export const useCreateVehicle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: VehicleCreate) => vehicleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VehicleUpdate }) =>
      vehicleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}

export const useUpdateVehicleStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: VehicleStatusUpdate }) =>
      vehicleService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vehicleId: string) => vehicleService.delete(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
