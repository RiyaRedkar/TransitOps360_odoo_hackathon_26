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
import { Select } from '@/components/ui/Select'
import { useCreateVehicle, useUpdateVehicle } from '@/hooks/useVehicles'
import type { Vehicle, VehicleCreate, VehicleUpdate } from '@/types'

interface VehicleFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: Vehicle
  mode: 'create' | 'edit'
}

type FormData = VehicleCreate & { id?: string }

export function VehicleFormModal({
  open,
  onOpenChange,
  vehicle,
  mode,
}: VehicleFormModalProps) {
  const createMutation = useCreateVehicle()
  const updateMutation = useUpdateVehicle()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: vehicle || {
      registration_number: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      capacity_kg: 0,
      fuel_type: 'Diesel',
      acquisition_cost: 0,
      fuel_efficiency: undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data as VehicleCreate)
        toast.success('Vehicle created successfully')
      } else if (vehicle) {
        const updateData: VehicleUpdate = {
          make: data.make,
          model: data.model,
          capacity_kg: data.capacity_kg,
          fuel_efficiency: data.fuel_efficiency,
        }
        await updateMutation.mutateAsync({ id: vehicle.id, data: updateData })
        toast.success('Vehicle updated successfully')
      }
      reset()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save vehicle')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
            </DialogTitle>
          </DialogHeader>

          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registration_number">Registration Number *</Label>
              <Input
                id="registration_number"
                {...register('registration_number', {
                  required: 'Registration number is required',
                })}
                disabled={mode === 'edit'}
                placeholder="e.g., KA-01-AB-1234"
              />
              {errors.registration_number && (
                <p className="text-xs text-red-500">
                  {errors.registration_number.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  {...register('make', { required: 'Make is required' })}
                  placeholder="e.g., Tata"
                />
                {errors.make && (
                  <p className="text-xs text-red-500">{errors.make.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  {...register('model', { required: 'Model is required' })}
                  placeholder="e.g., LPT 2518"
                />
                {errors.model && (
                  <p className="text-xs text-red-500">{errors.model.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year', {
                    required: 'Year is required',
                    min: { value: 1900, message: 'Invalid year' },
                    max: {
                      value: new Date().getFullYear() + 1,
                      message: 'Invalid year',
                    },
                  })}
                />
                {errors.year && (
                  <p className="text-xs text-red-500">{errors.year.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type *</Label>
                <Select
                  id="fuel_type"
                  {...register('fuel_type', { required: 'Fuel type is required' })}
                  disabled={mode === 'edit'}
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity_kg">Capacity (kg) *</Label>
                <Input
                  id="capacity_kg"
                  type="number"
                  step="0.01"
                  {...register('capacity_kg', {
                    required: 'Capacity is required',
                    min: { value: 1, message: 'Must be greater than 0' },
                  })}
                />
                {errors.capacity_kg && (
                  <p className="text-xs text-red-500">
                    {errors.capacity_kg.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_efficiency">Fuel Efficiency (km/l)</Label>
                <Input
                  id="fuel_efficiency"
                  type="number"
                  step="0.01"
                  {...register('fuel_efficiency', {
                    min: { value: 0.1, message: 'Must be greater than 0' },
                  })}
                  placeholder="Optional"
                />
              </div>
            </div>

            {mode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="acquisition_cost">Acquisition Cost *</Label>
                <Input
                  id="acquisition_cost"
                  type="number"
                  step="0.01"
                  {...register('acquisition_cost', {
                    required: 'Acquisition cost is required',
                    min: { value: 0, message: 'Must be 0 or greater' },
                  })}
                />
                {errors.acquisition_cost && (
                  <p className="text-xs text-red-500">
                    {errors.acquisition_cost.message}
                  </p>
                )}
              </div>
            )}
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
