import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import tripService from '@/services/tripService'
import type { TripCreate, TripDispatch, TripUpdate } from '@/types'

export const useTrips = (params?: {
  status?: string
  skip?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => tripService.getAll(params),
  })
}

export const useTrip = (tripId: string) => {
  return useQuery({
    queryKey: ['trips', tripId],
    queryFn: () => tripService.getById(tripId),
    enabled: !!tripId,
  })
}

export const useCreateTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TripCreate) => tripService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export const useDispatchTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TripDispatch }) =>
      tripService.dispatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}

export const useUpdateTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TripUpdate }) =>
      tripService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export const useCompleteTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tripId: string) => tripService.complete(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}

export const useCancelTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tripId: string) => tripService.cancel(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}

export const useDeleteTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tripId: string) => tripService.delete(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}
