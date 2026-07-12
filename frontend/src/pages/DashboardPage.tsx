import { useState } from 'react'
import {
  Truck,
  Users,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Zap,
  DollarSign,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { KPICard } from '@/components/domain/KPICard'
import { StatusBadge } from '@/components/domain/StatusBadge'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { useDashboardSummary } from '@/hooks/useIntelligence'
import { useTrips } from '@/hooks/useTrips'

// Mock Data for Charts
const utilisationData = [
  { date: 'Mon', utilization: 65 },
  { date: 'Tue', utilization: 78 },
  { date: 'Wed', utilization: 72 },
  { date: 'Thu', utilization: 85 },
  { date: 'Fri', utilization: 91 },
  { date: 'Sat', utilization: 68 },
  { date: 'Sun', utilization: 55 },
]

const alerts = [
  { type: 'warning', title: 'Maintenance Due', desc: 'Vehicle requires service' },
  { type: 'danger', title: 'Low Fuel', desc: 'Vehicle fuel level below 20%' },
  { type: 'info', title: 'Driver License Expiring', desc: 'License expiring soon' },
]

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('week')
  
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useDashboardSummary()
  const { data: tripsData, isLoading: tripsLoading } = useTrips({ limit: 10 })

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[color:var(--text-secondary)]">Loading dashboard...</div>
      </div>
    )
  }

  if (summaryError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertTriangle className="text-[#EF4444]" size={48} />
        <div className="text-[color:var(--text-primary)] text-lg font-semibold">Failed to load dashboard</div>
        <div className="text-[color:var(--text-secondary)] text-sm">Please try refreshing the page</div>
      </div>
    )
  }

  const tripStatusData = tripsData ? [
    { name: 'Completed', value: tripsData.items.filter(t => t.status === 'Completed').length, fill: '#22C55E' },
    { name: 'Dispatched', value: tripsData.items.filter(t => t.status === 'Dispatched').length, fill: '#0EA5E9' },
    { name: 'Draft', value: tripsData.items.filter(t => t.status === 'Draft').length, fill: '#F59E0B' },
    { name: 'Cancelled', value: tripsData.items.filter(t => t.status === 'Cancelled').length, fill: '#EF4444' },
  ].filter(item => item.value > 0) : []

  const recentTrips = tripsData?.items.slice(0, 4).map(trip => ({
    id: trip.id.substring(0, 8),
    origin: trip.origin,
    destination: trip.destination,
    status: trip.status,
    distance: `${trip.distance_km} km`,
    cargo: `${trip.cargo_weight_kg} kg`,
  })) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Dashboard</h1>
            <p className="text-[color:var(--text-secondary)] mt-1">Welcome back 👋</p>
          </div>
          <div className="flex items-center gap-2">
            {['day', 'week', 'month'].map((range) => (
              <Button key={range} variant={dateRange === range ? 'default' : 'secondary'} size="sm" onClick={() => setDateRange(range)}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Vehicles" value={summary?.vehicles?.total?.toString() || '0'} icon={<Truck size={24} />} description="Total fleet" />
        <KPICard title="Available Vehicles" value={summary?.vehicles?.available?.toString() || '0'} icon={<TrendingUp size={24} />} description="Ready to dispatch" />
        <KPICard title="On Trip" value={summary?.vehicles?.on_trip?.toString() || '0'} icon={<MapPin size={24} />} description="Currently moving" />
        <KPICard title="In Maintenance" value={summary?.vehicles?.maintenance?.toString() || '0'} icon={<AlertTriangle size={24} />} description="In service" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Available Drivers" value={summary?.drivers?.available?.toString() || '0'} icon={<Users size={24} />} description={`${summary?.drivers?.total || 0} total`} />
        <KPICard title="Active Trips" value={summary?.trips?.active?.toString() || '0'} icon={<Activity size={24} />} description={`${summary?.trips?.completed_today || 0} completed today`} />
        <KPICard title="Today's Fuel Cost" value={`₹${(summary?.costs?.fuel_today || 0).toLocaleString('en-IN')}`} icon={<DollarSign size={24} />} description="Daily expense" />
        <KPICard title="Pending Maintenance" value={summary?.maintenance?.pending?.toString() || '0'} icon={<Zap size={24} />} description="Scheduled tasks" />
      </motion.div>

      {/* Charts */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Fleet Utilization Trend</CardTitle><CardDescription>Last 7 days</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={utilisationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="date" stroke="var(--text-tertiary)" />
                <YAxis stroke="var(--text-tertiary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', borderRadius: '8px' }} labelStyle={{ color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="utilization" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Trip Status Distribution</CardTitle><CardDescription>Current trips</CardDescription></CardHeader>
          <CardContent>
            {tripStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={tripStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {tripStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-light)' }} labelStyle={{ color: 'var(--text-primary)' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (<div className="flex items-center justify-center h-[300px] text-[color:var(--text-secondary)]">No trip data available</div>)}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Trips */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4"><CardTitle>Recent Trips</CardTitle></CardHeader>
          <CardContent>
            {tripsLoading ? (
              <div className="text-center py-8 text-[color:var(--text-secondary)]">Loading trips...</div>
            ) : recentTrips.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--border-light)]">
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Trip ID</th>
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Route</th>
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Distance</th>
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Cargo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrips.map((trip) => (
                      <tr key={trip.id} className="border-b border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-[color:var(--text-primary)]">{trip.id}</td>
                        <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.origin} → {trip.destination}</td>
                        <td className="py-3 px-4"><StatusBadge status={trip.status} variant="trip" /></td>
                        <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.distance}</td>
                        <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.cargo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (<div className="text-center py-8 text-[color:var(--text-secondary)]">No trips found</div>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2"><AlertTriangle size={20} className="text-[#F59E0B]" />Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`p-3 rounded-lg border-l-4 ${alert.type === 'warning' ? 'bg-[#F59E0B]/10 border-l-[#F59E0B]' : alert.type === 'danger' ? 'bg-[#EF4444]/10 border-l-[#EF4444]' : 'bg-[#0EA5E9]/10 border-l-[#0EA5E9]'}`}>
                <p className="text-sm font-medium text-[color:var(--text-primary)]">{alert.title}</p>
                <p className="text-xs text-[color:var(--text-secondary)] mt-1">{alert.desc}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
