import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired'
export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended'
export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled'
export type MaintenanceStatus = 'Active' | 'Completed' | 'Pending'

interface StatusBadgeProps {
  status: string
  variant?: 'vehicle' | 'driver' | 'trip' | 'maintenance'
  className?: string
}

const statusColorMap: Record<string, Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'danger' | 'info'>> = {
  vehicle: {
    'Available': 'success',
    'On Trip': 'info',
    'In Shop': 'warning',
    'Retired': 'secondary',
  },
  driver: {
    'Available': 'success',
    'On Trip': 'info',
    'Off Duty': 'secondary',
    'Suspended': 'danger',
  },
  trip: {
    'Draft': 'secondary',
    'Dispatched': 'info',
    'Completed': 'success',
    'Cancelled': 'danger',
  },
  maintenance: {
    'Active': 'warning',
    'Completed': 'success',
    'Pending': 'secondary',
  },
}

export function StatusBadge({ status, variant = 'vehicle', className }: StatusBadgeProps) {
  const colorVariant = statusColorMap[variant]?.[status] || 'secondary'

  return (
    <Badge variant={colorVariant} className={cn('gap-2', className)}>
      <span className={cn(
        'w-2 h-2 rounded-full',
        {
          'bg-[#22C55E]': colorVariant === 'success',
          'bg-[#0EA5E9]': colorVariant === 'info',
          'bg-[#F59E0B]': colorVariant === 'warning',
          'bg-[#EF4444]': colorVariant === 'danger',
          'bg-[#6B7280]': colorVariant === 'secondary',
        }
      )} />
      {status}
    </Badge>
  )
}
