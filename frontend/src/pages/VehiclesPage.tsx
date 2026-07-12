import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/domain/StatusBadge'
import { motion } from 'framer-motion'

const vehiclesData = [
  { id: 1, registration: 'MH12AB1234', make: 'Tata', model: 'LPT', year: 2022, capacity: 5000, status: 'Available', health: 95 },
  { id: 2, registration: 'MH12CD5678', make: 'Ashok Leyland', model: 'Guru', year: 2021, capacity: 6000, status: 'On Trip', health: 88 },
  { id: 3, registration: 'MH12EF9012', make: 'Mahindra', model: 'Bolero', year: 2020, capacity: 3500, status: 'In Shop', health: 72 },
  { id: 4, registration: 'MH12GH3456', make: 'Tata', model: 'ACE', year: 2023, capacity: 4000, status: 'Available', health: 99 },
  { id: 5, registration: 'MH12IJ7890', make: 'Maruti', model: 'Super Carry', year: 2019, capacity: 2500, status: 'Available', health: 81 },
]

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredVehicles = vehiclesData.filter(vehicle => {
    const matchesSearch = vehicle.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
          <Button className="gap-2">
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
                    <th className="text-center py-4 px-6 text-[color:var(--text-secondary)] font-medium text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle, idx) => (
                    <motion.tr
                      key={vehicle.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-medium text-[color:var(--text-primary)]">{vehicle.registration}</span>
                      </td>
                      <td className="py-4 px-6 text-[color:var(--text-secondary)]">{vehicle.make} {vehicle.model}</td>
                      <td className="py-4 px-6 text-[color:var(--text-secondary)]">{vehicle.capacity} kg</td>
                      <td className="py-4 px-6">
                        <StatusBadge status={vehicle.status} variant="vehicle" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-[color:var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#22C55E] to-[#0EA5E9]"
                              style={{ width: `${vehicle.health}%` }}
                            />
                          </div>
                          <span className="text-xs text-[color:var(--text-secondary)]">{vehicle.health}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[color:var(--text-secondary)]">{vehicle.year}</td>
                      <td className="py-4 px-6 text-center">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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
        <p className="text-sm text-[color:var(--text-secondary)]">Showing {filteredVehicles.length} of {vehiclesData.length} vehicles</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Previous</Button>
          <Button variant="secondary" size="sm">Next</Button>
        </div>
      </motion.div>
    </div>
  )
}
