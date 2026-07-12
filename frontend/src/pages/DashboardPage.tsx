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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

// Mock Data
const utilisationData = [
  { date: 'Mon', utilization: 65 },
  { date: 'Tue', utilization: 78 },
  { date: 'Wed', utilization: 72 },
  { date: 'Thu', utilization: 85 },
  { date: 'Fri', utilization: 91 },
  { date: 'Sat', utilization: 68 },
  { date: 'Sun', utilization: 55 },
]

const tripStatusData = [
  { name: 'Completed', value: 45, fill: '#22C55E' },
  { name: 'In Progress', value: 12, fill: '#0EA5E9' },
  { name: 'Pending', value: 8, fill: '#F59E0B' },
  { name: 'Cancelled', value: 3, fill: '#EF4444' },
]

const fuelCostData = [
  { month: 'Jan', cost: 2400 },
  { month: 'Feb', cost: 2210 },
  { month: 'Mar', cost: 2290 },
  { month: 'Apr', cost: 2000 },
  { month: 'May', cost: 2181 },
  { month: 'Jun', cost: 2500 },
]

const maintenanceCostData = [
  { month: 'Jan', cost: 400 },
  { month: 'Feb', cost: 300 },
  { month: 'Mar', cost: 200 },
  { month: 'Apr', cost: 278 },
  { month: 'May', cost: 189 },
  { month: 'Jun', cost: 239 },
]

const recentTrips = [
  { id: 'T-001', vehicle: 'MH12AB1234', driver: 'John Doe', status: 'Completed', distance: '150 km', time: '2:30 hrs' },
  { id: 'T-002', vehicle: 'MH12CD5678', driver: 'Jane Smith', status: 'In Progress', distance: '45 km', time: '1:15 hrs' },
  { id: 'T-003', vehicle: 'MH12EF9012', driver: 'Mike Johnson', status: 'Pending', distance: '--', time: '--' },
  { id: 'T-004', vehicle: 'MH12GH3456', driver: 'Sarah Davis', status: 'Completed', distance: '200 km', time: '3:00 hrs' },
]

const alerts = [
  { type: 'warning', title: 'Maintenance Due', desc: 'Vehicle MH12AB1234 requires service' },
  { type: 'danger', title: 'Low Fuel', desc: 'Vehicle MH12CD5678 fuel level below 20%' },
  { type: 'info', title: 'Driver License Expiring', desc: 'John Doe license expiring in 15 days' },
]

const recentActivity = [
  { time: '2 hrs ago', action: 'Trip Completed', entity: 'T-001', user: 'System' },
  { time: '4 hrs ago', action: 'Vehicle Added', entity: 'MH12AB1234', user: 'Shilpa Admin' },
  { time: '6 hrs ago', action: 'Maintenance Scheduled', entity: 'MH12CD5678', user: 'Maintenance Team' },
  { time: '8 hrs ago', action: 'Driver Status Updated', entity: 'John Doe', user: 'Fleet Manager' },
]

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('week')

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
            <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Dashboard</h1>
            <p className="text-[color:var(--text-secondary)] mt-1">Welcome back, Shilpa 👋</p>
          </div>
          <div className="flex items-center gap-2">
            {['day', 'week', 'month'].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setDateRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard
          title="Total Vehicles"
          value="50"
          icon={<Truck size={24} />}
          trend={{ value: 2, direction: 'up' }}
          description="This month"
        />
        <KPICard
          title="Available Vehicles"
          value="35"
          icon={<TrendingUp size={24} />}
          trend={{ value: 15, direction: 'up' }}
          description="Ready to dispatch"
        />
        <KPICard
          title="On Trip"
          value="12"
          icon={<MapPin size={24} />}
          trend={{ value: 5, direction: 'down' }}
          description="Currently moving"
        />
        <KPICard
          title="In Maintenance"
          value="3"
          icon={<AlertTriangle size={24} />}
          trend={{ value: 8, direction: 'down' }}
          description="In service"
        />
      </motion.div>

      {/* Additional KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard
          title="Available Drivers"
          value="28"
          icon={<Users size={24} />}
          trend={{ value: 12, direction: 'up' }}
          description="Ready for dispatch"
        />
        <KPICard
          title="Fleet Utilization"
          value="76%"
          icon={<Activity size={24} />}
          trend={{ value: 8, direction: 'up' }}
          description="This week"
        />
        <KPICard
          title="Operational Cost"
          value="₹45.2K"
          icon={<DollarSign size={24} />}
          trend={{ value: 5, direction: 'down' }}
          description="Weekly average"
        />
        <KPICard
          title="Fuel Efficiency"
          value="8.5"
          icon={<Zap size={24} />}
          trend={{ value: 3, direction: 'up' }}
          description="km/l average"
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Fleet Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Utilization Trend</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={utilisationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="date" stroke="var(--text-tertiary)" />
                <YAxis stroke="var(--text-tertiary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ fill: '#2563EB', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trip Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Status Distribution</CardTitle>
            <CardDescription>Current week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tripStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {tripStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                  }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: '20px', color: 'var(--text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cost Tracking Charts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Fuel Cost Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Fuel Cost Trend</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fuelCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" />
                <YAxis stroke="var(--text-tertiary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                  }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="cost" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maintenance Cost Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Cost</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={maintenanceCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" />
                <YAxis stroke="var(--text-tertiary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                  }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="cost" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Trips & Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle>Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--border-light)]">
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Trip ID</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Vehicle</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Driver</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Distance</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((trip) => (
                    <tr key={trip.id} className="border-b border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-[color:var(--text-primary)]">{trip.id}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.vehicle}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.driver}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={trip.status} variant="trip" />
                      </td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.distance}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{trip.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#F59E0B]" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning'
                    ? 'bg-[#F59E0B]/10 border-l-[#F59E0B]'
                    : alert.type === 'danger'
                    ? 'bg-[#EF4444]/10 border-l-[#EF4444]'
                    : 'bg-[#0EA5E9]/10 border-l-[#0EA5E9]'
                }`}
              >
                <p className="text-sm font-medium text-[color:var(--text-primary)]">{alert.title}</p>
                <p className="text-xs text-[color:var(--text-secondary)] mt-1">{alert.desc}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-[color:var(--border-light)] last:border-0 last:pb-0">
                  <div className="w-8 h-8 bg-[#2563EB]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Activity size={16} className="text-[#2563EB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[color:var(--text-primary)]">{activity.action}</p>
                    <p className="text-xs text-[color:var(--text-secondary)]">{activity.entity} by {activity.user}</p>
                    <p className="text-xs text-[color:var(--text-tertiary)] mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
