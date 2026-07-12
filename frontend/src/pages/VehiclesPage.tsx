import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/domain/StatusBadge'
import { VehicleFormModal } from '@/components/domain/VehicleFormModal'
import { useVehicles, useDeleteVehicle } from '@/hooks/useVehicles'
import { motion } from 'framer-motion'
import type { Vehicle } from '@/types'

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>()
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  const { data: vehiclesData, isLoading } = useVehicles({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })
  const deleteMutation = useDeleteVehicle()

  const handleAdd = () => {
    setEditingVehicle(undefined)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleDelete = async (vehicleId: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteMutation.mutateAsync(vehicleId)
        toast.success('Vehicle deleted successfully')
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Failed to delete vehicle')
      }
    }
  }

  const vehicles = vehiclesData?.items || []
  const total = vehiclesData?.total || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Vehicles</h1>
            <p className="text-[color:var(--text-secondary)] mt-1">Manage your fleet of vehicles</p>
          </div>
          <Button className="gap-2" onClick={handleAdd}>
            <Plus size={20} />
            Add Vehicle
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex gap-4 flex-wrap"
      >
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--text-tertiary)]" />
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Button variant="secondary" className="gap-2">
          <Filter size={16} />
          Filters
        </Button>
      </motion.div>

      {/* Status Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2"
      >
        {['all', 'Available', 'On Trip', 'In Shop'].map(status => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </motion.div>

      {/* Vehicles Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-[color:var(--text-secondary)]">
                Loading vehicles...
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12 text-[color:var(--text-secondary)]">
                No vehicles found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[color:var(--border-light)]">
                      <th className="text-left py-4 px-6 text-[color:var(--text-secondary)] font-medium text-sm">Registration</th>
                      <th className="text-left py-4 px-6 text-[color:var(--text-secondary)] font-medium text-sm">Make & Model</th>
                      <th className="text-left py-4 px-6 text-[color:var(--text-secondary)] font-medium text-sm">Capacity</th>
                      <th className="text-left py-4 px-6 text-[color:var(--text-secondary)] font-medium text-sm">Status</th>
                      <th className="text-left py-4 px-6 text-[color:var(--text-secondary)] font-medium text-sm">Health</th>
                      <th className="text-left py-4 px-6 text-[color:var(--text-secondary)] font-medium text-sm">Year</th>
                      <th className="text-center py-4 px-6 text-[color:var(--text-secondary)] font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle, idx) => (
                      <motion.tr
                        key={vehicle.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <span className="font-medium text-[color:var(--text-primary)]">{vehicle.registration_number}</span>
                        </td>
                        <td className="py-4 px-6 text-[color:var(--text-secondary)]">{vehicle.make} {vehicle.model}</td>
                        <td className="py-4 px-6 text-[color:var(--text-secondary)]">{vehicle.capacity_kg} kg</td>
                        <td className="py-4 px-6">
                          <StatusBadge status={vehicle.status} variant="vehicle" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-[color:var(--bg-tertiary)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#22C55E] to-[#0EA5E9]"
                                style={{ width: `${vehicle.health_score}%` }}
                              />
                            </div>
                            <span className="text-xs text-[color:var(--text-secondary)]">{vehicle.health_score}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[color:var(--text-secondary)]">{vehicle.year}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(vehicle)}
                              title="Edit vehicle"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(vehicle.id)}
                              title="Delete vehicle"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-[color:var(--text-secondary)]">Showing {vehicles.length} of {total} vehicles</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Previous</Button>
          <Button variant="secondary" size="sm">Next</Button>
        </div>
      </motion.div>

      {/* Vehicle Form Modal */}
      <VehicleFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vehicle={editingVehicle}
        mode={modalMode}
      />
    </div>
  )
}
