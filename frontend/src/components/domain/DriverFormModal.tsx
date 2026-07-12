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
import { useCreateDriver, useUpdateDriver } from '@/hooks/useDrivers'
import type { Driver, DriverCreate, DriverUpdate } from '@/types'

interface DriverFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver?: Driver
  mode: 'create' | 'edit'
}

type FormData = DriverCreate & { id?: string }

export function DriverFormModal({
  open,
  onOpenChange,
  driver,
  mode,
}: DriverFormModalProps) {
  const createMutation = useCreateDriver()
  const updateMutation = useUpdateDriver()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: driver || {
      name: '',
      license_number: '',
      license_expiry: '',
      phone: '',
      email: '',
      hire_date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data as DriverCreate)
        toast.success('Driver created successfully')
      } else if (driver) {
        const updateData: DriverUpdate = {
          name: data.name,
          phone: data.phone,
          email: data.email,
        }
        await updateMutation.mutateAsync({ id: driver.id, data: updateData })
        toast.success('Driver updated successfully')
      }
      reset()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save driver')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Add New Driver' : 'Edit Driver'}
            </DialogTitle>
          </DialogHeader>

          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="e.g., John Doe"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number *</Label>
                <Input
                  id="license_number"
                  {...register('license_number', {
                    required: 'License number is required',
                  })}
                  disabled={mode === 'edit'}
                  placeholder="e.g., DL-1420110012345"
                />
                {errors.license_number && (
                  <p className="text-xs text-red-500">
                    {errors.license_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_expiry">License Expiry *</Label>
                <Input
                  id="license_expiry"
                  type="date"
                  {...register('license_expiry', {
                    required: 'License expiry is required',
                  })}
                  disabled={mode === 'edit'}
                />
                {errors.license_expiry && (
                  <p className="text-xs text-red-500">
                    {errors.license_expiry.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  placeholder="e.g., +91 9876543210"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Optional"
                />
              </div>
            </div>

            {mode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="hire_date">Hire Date *</Label>
                <Input
                  id="hire_date"
                  type="date"
                  {...register('hire_date', { required: 'Hire date is required' })}
                />
                {errors.hire_date && (
                  <p className="text-xs text-red-500">{errors.hire_date.message}</p>
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
