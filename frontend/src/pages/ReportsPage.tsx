import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Calendar, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

// Mock Reports Data
const availableReports = [
  {
    id: 1,
    name: 'Fleet Performance Report',
    description: 'Comprehensive fleet efficiency and utilization metrics',
    category: 'Performance',
    lastGenerated: '2024-03-10',
    frequency: 'Monthly',
    icon: '📊',
  },
  {
    id: 2,
    name: 'Driver Safety Report',
    description: 'Driver compliance, violations, and safety scores',
    category: 'Safety',
    lastGenerated: '2024-03-08',
    frequency: 'Weekly',
    icon: '🚗',
  },
  {
    id: 3,
    name: 'Cost Analysis Report',
    description: 'Detailed breakdown of fuel, maintenance, and operating costs',
    category: 'Finance',
    lastGenerated: '2024-03-01',
    frequency: 'Monthly',
    icon: '💰',
  },
  {
    id: 4,
    name: 'Fuel Efficiency Report',
    description: 'Fuel consumption trends and optimization recommendations',
    category: 'Efficiency',
    lastGenerated: '2024-03-07',
    frequency: 'Weekly',
    icon: '⛽',
  },
  {
    id: 5,
    name: 'Maintenance Schedule Report',
    description: 'Upcoming maintenance, service history, and alerts',
    category: 'Maintenance',
    lastGenerated: '2024-03-06',
    frequency: 'Weekly',
    icon: '🔧',
  },
  {
    id: 6,
    name: 'Compliance Report',
    description: 'License expiry, insurance, registration, and document status',
    category: 'Compliance',
    lastGenerated: '2024-03-09',
    frequency: 'Monthly',
    icon: '✅',
  },
  {
    id: 7,
    name: 'Trip Analysis Report',
    description: 'Trip duration, distance, profitability, and patterns',
    category: 'Operations',
    lastGenerated: '2024-03-05',
    frequency: 'Daily',
    icon: '📍',
  },
  {
    id: 8,
    name: 'Emission & Environmental Report',
    description: 'CO2 emissions, environmental compliance, and sustainability metrics',
    category: 'Environmental',
    lastGenerated: '2024-02-28',
    frequency: 'Monthly',
    icon: '🌍',
  },
]

const categories = ['All', 'Performance', 'Safety', 'Finance', 'Efficiency', 'Maintenance', 'Compliance', 'Operations', 'Environmental']

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [dateRange, setDateRange] = useState('month')

  const filteredReports = selectedCategory === 'All' 
    ? availableReports 
    : availableReports.filter(report => report.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Performance': 'bg-[#2563EB]/10 text-[#2563EB]',
      'Safety': 'bg-[#EF4444]/10 text-[#EF4444]',
      'Finance': 'bg-[#22C55E]/10 text-[#22C55E]',
      'Efficiency': 'bg-[#F59E0B]/10 text-[#F59E0B]',
      'Maintenance': 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
      'Compliance': 'bg-[#06B6D4]/10 text-[#06B6D4]',
      'Operations': 'bg-[#EC4899]/10 text-[#EC4899]',
      'Environmental': 'bg-[#10B981]/10 text-[#10B981]',
    }
    return colors[category] || 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)]'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Reports</h1>
          <p className="text-[color:var(--text-secondary)] mt-1">
            Generate, download, and view comprehensive fleet reports
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-2">📅</div>
            <p className="text-sm font-medium text-[color:var(--text-secondary)]">Date Range</p>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="mt-2 w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium text-[color:var(--text-secondary)]">Total Reports</p>
            <p className="text-2xl font-bold text-[color:var(--text-primary)] mt-2">{availableReports.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-2">📥</div>
            <p className="text-sm font-medium text-[color:var(--text-secondary)]">Generated</p>
            <p className="text-2xl font-bold text-[#22C55E] mt-2">8</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-2">🔄</div>
            <p className="text-sm font-medium text-[color:var(--text-secondary)]">Scheduled</p>
            <p className="text-2xl font-bold text-[#2563EB] mt-2">5</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter size={20} />
              Filter by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
      >
        {filteredReports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{report.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                    {report.category}
                  </span>
                </div>
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--text-secondary)]">Frequency:</span>
                    <span className="font-medium text-[color:var(--text-primary)]">{report.frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--text-secondary)]">Last Generated:</span>
                    <span className="font-medium text-[color:var(--text-primary)]">
                      {new Date(report.lastGenerated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Scheduled Reports */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Automatic Reports</CardTitle>
            <CardDescription>Reports that are generated and sent automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Daily Trip Summary', schedule: 'Every day at 6:00 AM', emails: ['admin@transit.com', 'manager@transit.com'] },
                { name: 'Weekly Safety Report', schedule: 'Every Monday at 9:00 AM', emails: ['safety@transit.com'] },
                { name: 'Monthly Finance Report', schedule: 'First day of month at 8:00 AM', emails: ['finance@transit.com', 'admin@transit.com'] },
                { name: 'Compliance Reminder', schedule: 'Every Wednesday at 10:00 AM', emails: ['compliance@transit.com'] },
                { name: 'Fuel Efficiency Report', schedule: 'Every Friday at 5:00 PM', emails: ['operations@transit.com'] },
              ].map((scheduled, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[color:var(--bg-secondary)] rounded-lg border border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-[color:var(--text-primary)]">{scheduled.name}</p>
                      <p className="text-xs text-[color:var(--text-secondary)] mt-1 flex items-center gap-1">
                        <Calendar size={14} />
                        {scheduled.schedule}
                      </p>
                      <p className="text-xs text-[color:var(--text-secondary)] mt-1">
                        Sent to: {scheduled.emails.join(', ')}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Custom Report */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Report</CardTitle>
            <CardDescription>Generate a custom report with selected parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Report Type
                </label>
                <select className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                  <option>Fleet Performance</option>
                  <option>Driver Safety</option>
                  <option>Cost Analysis</option>
                  <option>Fuel Efficiency</option>
                  <option>Compliance Status</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Date Range
                </label>
                <select className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                  <option>Last Week</option>
                  <option>Last Month</option>
                  <option>Last Quarter</option>
                  <option>Last Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Format
                </label>
                <select className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                  <option>HTML</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary">Cancel</Button>
              <Button className="flex items-center gap-2">
                <Download size={16} />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
