import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import driverService from '@/services/driverService'
import type { DriverCreate, DriverUpdate } from '@/types'

export const useDrivers = (params?: {
  status?: string
  search?: string
  skip?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: () => driverService.getAll(params),
  })
}

export const useAvailableDrivers = () => {
  return useQuery({
    queryKey: ['drivers', 'available'],
    queryFn: () => driverService.getAvailable(),
  })
}

export const useDriver = (driverId: string) => {
  return useQuery({
    queryKey: ['drivers', driverId],
    queryFn: () => driverService.getById(driverId),
    enabled: !!driverId,
  })
}

export const useCreateDriver = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DriverCreate) => driverService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}

export const useUpdateDriver = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DriverUpdate }) =>
      driverService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}

export const useDeleteDriver = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (driverId: string) => driverService.delete(driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}
