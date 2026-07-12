import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

// Mock Maintenance Data
const maintenanceRecords = [
  {
    id: 'M-001',
    vehicle: 'MH12AB1234',
    serviceType: 'Regular Service',
    status: 'completed',
    date: '2024-03-08',
    cost: 3500,
    nextDue: '2024-06-08',
    mileage: 45000,
  },
  {
    id: 'M-002',
    vehicle: 'MH12CD5678',
    serviceType: 'Oil Change',
    status: 'in_progress',
    date: '2024-03-10',
    cost: 1200,
    nextDue: '2024-04-10',
    mileage: 38000,
  },
  {
    id: 'M-003',
    vehicle: 'MH12EF9012',
    serviceType: 'Brake Inspection',
    status: 'pending',
    date: '2024-03-12',
    cost: 2800,
    nextDue: '2024-03-12',
    mileage: 52000,
  },
  {
    id: 'M-004',
    vehicle: 'MH12GH3456',
    serviceType: 'Tire Replacement',
    status: 'completed',
    date: '2024-03-05',
    cost: 8500,
    nextDue: '2025-03-05',
    mileage: 48000,
  },
]

const maintenanceStats = [
  { label: 'Total Maintenance', value: '1,250', icon: '🔧' },
  { label: 'Pending Service', value: '8', icon: '⏰' },
  { label: 'Avg Cost/Month', value: '₹65K', icon: '💰' },
  { label: 'Fleet Health', value: '92%', icon: '✅' },
]

const commonServices = [
  { name: 'Regular Service (3K/6K km)', cost: 3500 },
  { name: 'Oil Change', cost: 1200 },
  { name: 'Tire Rotation', cost: 1500 },
  { name: 'Brake Inspection', cost: 2800 },
  { name: 'Air Filter Replacement', cost: 800 },
  { name: 'Battery Check', cost: 500 },
]

export default function MaintenancePage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  const filteredRecords = filterStatus === 'all'
    ? maintenanceRecords
    : maintenanceRecords.filter(r => r.status === filterStatus)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Maintenance Management</h1>
            <p className="text-[color:var(--text-secondary)] mt-1">Schedule and track vehicle maintenance</p>
          </div>
          <Button onClick={() => setShowScheduleForm(!showScheduleForm)} className="gap-2">
            <Plus size={20} />
            New Maintenance
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {maintenanceStats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[color:var(--text-secondary)]">{stat.label}</p>
                  <p className="text-3xl font-bold text-[color:var(--text-primary)] mt-2">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Schedule Form */}
      {showScheduleForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Vehicle</label>
                  <select className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option>MH12AB1234</option>
                    <option>MH12CD5678</option>
                    <option>MH12EF9012</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Service Type</label>
                  <select className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    {commonServices.map(s => (
                      <option key={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Date</label>
                  <input type="date" className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="secondary" onClick={() => setShowScheduleForm(false)}>Cancel</Button>
                <Button>Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {['all', 'completed', 'in_progress', 'pending'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Maintenance Records */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Records</CardTitle>
            <CardDescription>Showing {filteredRecords.length} records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.map(record => (
                <div key={record.id} className="p-4 bg-[color:var(--bg-secondary)] rounded-lg border border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-[color:var(--text-primary)]">{record.serviceType}</p>
                      <p className="text-sm text-[color:var(--text-secondary)]">{record.vehicle} - Mileage: {record.mileage} km</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'completed' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                      record.status === 'in_progress' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
                      'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}>
                      {record.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-[color:var(--text-secondary)]">Date</p>
                      <p className="font-medium text-[color:var(--text-primary)]">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[color:var(--text-secondary)]">Cost</p>
                      <p className="font-medium text-[#22C55E]">₹{record.cost}</p>
                    </div>
                    <div>
                      <p className="text-[color:var(--text-secondary)]">Next Due</p>
                      <p className="font-medium text-[color:var(--text-primary)]">{new Date(record.nextDue).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <Button variant="secondary" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Common Services */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Common Services & Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonServices.map(service => (
                <div key={service.name} className="p-3 bg-[color:var(--bg-secondary)] rounded-lg flex items-center justify-between hover:bg-[color:var(--bg-tertiary)] transition-colors">
                  <div>
                    <p className="font-medium text-[color:var(--text-primary)]">{service.name}</p>
                  </div>
                  <p className="font-bold text-[#2563EB]">₹{service.cost}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
