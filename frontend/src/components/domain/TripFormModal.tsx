import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { useCreateTrip, useUpdateTrip } from '@/hooks/useTrips'
import type { Trip, TripCreate, TripUpdate } from '@/types'

interface TripFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip?: Trip
  mode: 'create' | 'edit'
}

type FormData = TripCreate & { id?: string }

export function TripFormModal({
  open,
  onOpenChange,
  trip,
  mode,
}: TripFormModalProps) {
  const createMutation = useCreateTrip()
  const updateMutation = useUpdateTrip()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: trip || {
      origin: '',
      destination: '',
      distance_km: 0,
      cargo_weight_kg: 0,
      cargo_description: '',
      revenue: undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data as TripCreate)
        toast.success('Trip created successfully')
      } else if (trip) {
        const updateData: TripUpdate = {
          origin: data.origin,
          destination: data.destination,
          distance_km: data.distance_km,
          cargo_weight_kg: data.cargo_weight_kg,
          cargo_description: data.cargo_description,
          revenue: data.revenue,
        }
        await updateMutation.mutateAsync({ id: trip.id, data: updateData })
        toast.success('Trip updated successfully')
      }
      reset()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save trip')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create New Trip' : 'Edit Trip'}
            </DialogTitle>
          </DialogHeader>

          <DialogBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin *</Label>
                <Input
                  id="origin"
                  {...register('origin', { required: 'Origin is required' })}
                  placeholder="e.g., Mumbai"
                />
                {errors.origin && (
                  <p className="text-xs text-red-500">{errors.origin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  {...register('destination', {
                    required: 'Destination is required',
                  })}
                  placeholder="e.g., Delhi"
                />
                {errors.destination && (
                  <p className="text-xs text-red-500">
                    {errors.destination.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance_km">Distance (km) *</Label>
                <Input
                  id="distance_km"
                  type="number"
                  step="0.01"
                  {...register('distance_km', {
                    required: 'Distance is required',
                    min: { value: 0.1, message: 'Must be greater than 0' },
                  })}
                />
                {errors.distance_km && (
                  <p className="text-xs text-red-500">
                    {errors.distance_km.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo_weight_kg">Cargo Weight (kg) *</Label>
                <Input
                  id="cargo_weight_kg"
                  type="number"
                  step="0.01"
                  {...register('cargo_weight_kg', {
                    required: 'Cargo weight is required',
                    min: { value: 0.1, message: 'Must be greater than 0' },
                  })}
                />
                {errors.cargo_weight_kg && (
                  <p className="text-xs text-red-500">
                    {errors.cargo_weight_kg.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo_description">Cargo Description</Label>
              <Textarea
                id="cargo_description"
                {...register('cargo_description')}
                placeholder="Optional: Describe the cargo"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Expected Revenue</Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                {...register('revenue', {
                  min: { value: 0, message: 'Must be 0 or greater' },
                })}
                placeholder="Optional"
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
