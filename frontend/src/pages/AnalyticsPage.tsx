import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Award, Fuel, DollarSign, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { KPICard } from '@/components/domain/KPICard'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

// Mock Analytics Data
const performanceTrend = [
  { month: 'Jan', efficiency: 78, safety: 88, utilization: 72 },
  { month: 'Feb', efficiency: 82, safety: 90, utilization: 75 },
  { month: 'Mar', efficiency: 85, safety: 92, utilization: 78 },
  { month: 'Apr', efficiency: 88, safety: 91, utilization: 82 },
  { month: 'May', efficiency: 90, safety: 93, utilization: 85 },
  { month: 'Jun', efficiency: 92, safety: 95, utilization: 88 },
]

const costBreakdown = [
  { name: 'Fuel', value: 55, fill: '#F59E0B' },
  { name: 'Maintenance', value: 25, fill: '#0EA5E9' },
  { name: 'Driver Salary', value: 15, fill: '#22C55E' },
  { name: 'Others', value: 5, fill: '#8B5CF6' },
]

const fuelConsumption = [
  { vehicle: 'MH01', consumption: 8.5, target: 9 },
  { vehicle: 'MH02', consumption: 7.8, target: 9 },
  { vehicle: 'MH03', consumption: 8.9, target: 9 },
  { vehicle: 'MH04', consumption: 9.2, target: 9 },
  { vehicle: 'MH05', consumption: 8.3, target: 9 },
]

const driverSafetyScores = [
  { driver: 'John Doe', score: 95, violations: 0 },
  { driver: 'Jane Smith', score: 92, violations: 1 },
  { driver: 'Mike Johnson', score: 88, violations: 2 },
  { driver: 'Sarah Davis', score: 90, violations: 1 },
  { driver: 'Tom Wilson', score: 85, violations: 3 },
]

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m')

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
            <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Analytics & Intelligence</h1>
            <p className="text-[color:var(--text-secondary)] mt-1">Fleet performance, efficiency, and insights</p>
          </div>
          <div className="flex gap-2">
            {['1m', '3m', '6m', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)]'
                }`}
              >
                {period}
              </button>
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
          title="Fleet Efficiency"
          value="92%"
          icon={<TrendingUp size={24} />}
          trend={{ value: 4, direction: 'up' }}
          description="vs last month"
        />
        <KPICard
          title="Safety Score"
          value="95/100"
          icon={<Award size={24} />}
          trend={{ value: 2, direction: 'up' }}
          description="Average rating"
        />
        <KPICard
          title="Fuel Efficiency"
          value="8.7"
          icon={<Fuel size={24} />}
          trend={{ value: 3, direction: 'down' }}
          description="km/l average"
        />
        <KPICard
          title="Total Cost/Month"
          value="₹4.2M"
          icon={<DollarSign size={24} />}
          trend={{ value: 5, direction: 'down' }}
          description="12% reduction YoY"
        />
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Last 6 months comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrend}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ fill: '#2563EB', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="safety"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ fill: '#22C55E', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Operating expenses distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Fuel Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle>Fuel Consumption vs Target</CardTitle>
            <CardDescription>Vehicle-wise efficiency analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fuelConsumption}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="vehicle" stroke="var(--text-tertiary)" />
                <YAxis stroke="var(--text-tertiary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                  }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend />
                <Bar dataKey="consumption" fill="#F59E0B" name="Actual" />
                <Bar dataKey="target" fill="#0EA5E9" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Driver Safety Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Safety Scores</CardTitle>
            <CardDescription>Top drivers by safety rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {driverSafetyScores.map((driver, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[color:var(--bg-secondary)] rounded-lg hover:bg-[color:var(--bg-tertiary)] transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-[color:var(--text-primary)]">{driver.driver}</p>
                    <p className="text-xs text-[color:var(--text-secondary)]">
                      {driver.violations} violations
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[color:var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${driver.score >= 90 ? 'bg-[#22C55E]' : driver.score >= 85 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                        style={{ width: `${driver.score}%` }}
                      />
                    </div>
                    <span className="font-semibold text-[color:var(--text-primary)] w-12 text-right">
                      {driver.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#F59E0B]" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#2563EB]/10 rounded-lg border-l-4 border-[#2563EB]">
                <p className="font-semibold text-[color:var(--text-primary)]">Efficiency Improved</p>
                <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                  Fleet efficiency increased by 14% compared to last quarter
                </p>
              </div>
              <div className="p-4 bg-[#22C55E]/10 rounded-lg border-l-4 border-[#22C55E]">
                <p className="font-semibold text-[color:var(--text-primary)]">Safety Leaders</p>
                <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                  5 drivers maintaining 90+ safety score consistently
                </p>
              </div>
              <div className="p-4 bg-[#F59E0B]/10 rounded-lg border-l-4 border-[#F59E0B]">
                <p className="font-semibold text-[color:var(--text-primary)]">Cost Optimization</p>
                <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                  Potential 8% savings by optimizing fuel consumption
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
