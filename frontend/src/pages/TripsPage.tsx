import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MapPin, Clock, User, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/domain/StatusBadge'

// Mock Trip Data
const tripsData = [
  {
    id: 'T-001',
    origin: 'Mumbai',
    destination: 'Pune',
    vehicle: 'MH12AB1234',
    driver: 'John Doe',
    status: 'completed',
    startTime: '2024-03-10 08:30',
    endTime: '2024-03-10 11:45',
    distance: 150,
    duration: '3h 15m',
    fuelUsed: 18.5,
    cost: 2500,
  },
  {
    id: 'T-002',
    origin: 'Pune',
    destination: 'Nashik',
    vehicle: 'MH12CD5678',
    driver: 'Jane Smith',
    status: 'in_progress',
    startTime: '2024-03-10 10:00',
    endTime: '--',
    distance: 210,
    duration: '2h 45m',
    fuelUsed: 25.2,
    cost: 3200,
  },
  {
    id: 'T-003',
    origin: 'Nashik',
    destination: 'Aurangabad',
    vehicle: 'MH12EF9012',
    driver: 'Mike Johnson',
    status: 'pending',
    startTime: '2024-03-10 15:00',
    endTime: '--',
    distance: 250,
    duration: '3h 30m',
    fuelUsed: 0,
    cost: 3800,
  },
  {
    id: 'T-004',
    origin: 'Aurangabad',
    destination: 'Nagpur',
    vehicle: 'MH12GH3456',
    driver: 'Sarah Davis',
    status: 'completed',
    startTime: '2024-03-09 09:00',
    endTime: '2024-03-09 13:30',
    distance: 350,
    duration: '4h 30m',
    fuelUsed: 42.0,
    cost: 5200,
  },
  {
    id: 'T-005',
    origin: 'Nagpur',
    destination: 'Indore',
    vehicle: 'MH12IJ7890',
    driver: 'Tom Wilson',
    status: 'completed',
    startTime: '2024-03-09 06:00',
    endTime: '2024-03-09 12:15',
    distance: 380,
    duration: '6h 15m',
    fuelUsed: 45.6,
    cost: 5800,
  },
]

const tripStats = [
  { label: 'Total Trips', value: '2,450', change: '+12%' },
  { label: 'In Progress', value: '3', change: '↓ 2' },
  { label: 'Avg Distance', value: '245 km', change: '+5%' },
  { label: 'Total Revenue', value: '₹12.5L', change: '+8%' },
]

export default function TripsPage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const filteredTrips = filterStatus === 'all' 
    ? tripsData 
    : tripsData.filter(trip => trip.status === filterStatus)

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
            <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Trips Management</h1>
            <p className="text-[color:var(--text-secondary)] mt-1">Create, track, and manage vehicle trips</p>
          </div>
          <Button className="gap-2">
            <Plus size={20} />
            Create Trip
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
        {tripStats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-[color:var(--text-secondary)]">{stat.label}</p>
              <p className="text-3xl font-bold text-[color:var(--text-primary)] mt-2">{stat.value}</p>
              <p className="text-xs text-[#22C55E] mt-2">{stat.change} vs last week</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Filter Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="all">All Trips</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="recent">Most Recent</option>
                  <option value="distance">Distance</option>
                  <option value="duration">Duration</option>
                  <option value="cost">Cost</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trips Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Active Trips</CardTitle>
            <CardDescription>Showing {filteredTrips.length} trips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--border-light)]">
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Trip ID</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Route</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Vehicle</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Driver</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Distance</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Duration</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Cost</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="border-b border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[color:var(--text-primary)]">{trip.id}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#2563EB]" />
                          {trip.origin} → {trip.destination}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.vehicle}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          {trip.driver}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.distance} km</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {trip.duration}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#22C55E]">₹{trip.cost}</td>
                      <td className="py-3 px-4">
                        <StatusBadge 
                          status={trip.status.charAt(0).toUpperCase() + trip.status.slice(1)} 
                          variant="trip" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trip Details Modal/Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Ongoing Trip */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} className="text-[#F59E0B]" />
              Ongoing Trip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tripsData.find(t => t.status === 'in_progress') && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[color:var(--text-secondary)]">Trip ID:</span>
                    <span className="font-medium text-[color:var(--text-primary)]">T-002</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--text-secondary)]">Route:</span>
                    <span className="font-medium text-[color:var(--text-primary)]">Pune → Nashik</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--text-secondary)]">Vehicle:</span>
                    <span className="font-medium text-[color:var(--text-primary)]">MH12CD5678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--text-secondary)]">Driver:</span>
                    <span className="font-medium text-[color:var(--text-primary)]">Jane Smith</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--text-secondary)]">Distance:</span>
                    <span className="font-medium text-[color:var(--text-primary)]">210 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--text-secondary)]">Time Elapsed:</span>
                    <span className="font-medium text-[#F59E0B]">2h 15m</span>
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button variant="secondary" className="flex-1">View Details</Button>
                  <Button className="flex-1">Complete Trip</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-[#22C55E]/10 rounded-lg">
                <p className="text-xs text-[color:var(--text-secondary)]">Avg Trip Cost</p>
                <p className="text-2xl font-bold text-[#22C55E] mt-1">₹4,120</p>
              </div>
              <div className="p-3 bg-[#2563EB]/10 rounded-lg">
                <p className="text-xs text-[color:var(--text-secondary)]">Avg Distance</p>
                <p className="text-2xl font-bold text-[#2563EB] mt-1">268 km</p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                <p className="text-xs text-[color:var(--text-secondary)]">On-Time Rate</p>
                <p className="text-2xl font-bold text-[#F59E0B] mt-1">96.5%</p>
              </div>
              <div className="p-3 bg-[#0EA5E9]/10 rounded-lg">
                <p className="text-xs text-[color:var(--text-secondary)]">Completion Rate</p>
                <p className="text-2xl font-bold text-[#0EA5E9] mt-1">99.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
