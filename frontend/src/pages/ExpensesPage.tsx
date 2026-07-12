import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, DollarSign, TrendingUp, AlertTriangle, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock Expense Data
const expenseRecords = [
  {
    id: 'E-001',
    category: 'Fuel',
    vehicle: 'MH12AB1234',
    date: '2024-03-10',
    amount: 5460,
    description: 'Diesel refill - 45.5L',
    status: 'completed',
  },
  {
    id: 'E-002',
    category: 'Maintenance',
    vehicle: 'MH12CD5678',
    date: '2024-03-09',
    amount: 3500,
    description: 'Regular service',
    status: 'completed',
  },
  {
    id: 'E-003',
    category: 'Toll & Permits',
    vehicle: 'MH12EF9012',
    date: '2024-03-08',
    amount: 850,
    description: 'Highway toll charges',
    status: 'completed',
  },
  {
    id: 'E-004',
    category: 'Driver Salary',
    vehicle: 'N/A',
    date: '2024-03-01',
    amount: 35000,
    description: 'March salary - John Doe',
    status: 'completed',
  },
]

// Mock Monthly Expense Data
const monthlyExpenseData = [
  { month: 'January', fuel: 45000, maintenance: 12000, toll: 3500, salary: 105000 },
  { month: 'February', fuel: 48000, maintenance: 14000, toll: 3800, salary: 105000 },
  { month: 'March', fuel: 51000, maintenance: 16000, toll: 4200, salary: 105000 },
]

// Mock Expense by Category
const expenseByCategory = [
  { name: 'Fuel', value: 51000, percentage: 35 },
  { name: 'Maintenance', value: 16000, percentage: 11 },
  { name: 'Salary', value: 105000, percentage: 72 },
  { name: 'Toll & Permits', value: 4200, percentage: 3 },
  { name: 'Insurance', value: 8000, percentage: 5 },
]

// Mock Daily Expense Trend
const dailyExpenseTrend = [
  { date: 'Mar 1', amount: 3200 },
  { date: 'Mar 2', amount: 2800 },
  { date: 'Mar 3', amount: 4100 },
  { date: 'Mar 4', amount: 3500 },
  { date: 'Mar 5', amount: 2900 },
  { date: 'Mar 6', amount: 5400 },
  { date: 'Mar 7', amount: 3800 },
  { date: 'Mar 8', amount: 4200 },
  { date: 'Mar 9', amount: 3600 },
  { date: 'Mar 10', amount: 5460 },
]

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#0EA5E9', '#EC4899']

const expenseStats = [
  { label: 'Total Expenses', value: '₹1,85,000', icon: DollarSign, trend: '+8%' },
  { label: 'Monthly Average', value: '₹61,667', icon: Wallet, trend: '+3%' },
  { label: 'Largest Expense', value: '₹105K (Salary)', icon: TrendingUp, trend: 'March' },
  { label: 'Budget Status', value: '92%', icon: AlertTriangle, trend: '8% remaining' },
]

export default function ExpensesPage() {
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddExpense, setShowAddExpense] = useState(false)

  const filteredRecords = filterCategory === 'all'
    ? expenseRecords
    : expenseRecords.filter(r => r.category === filterCategory)

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
            <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Expense Management</h1>
            <p className="text-[color:var(--text-secondary)] mt-1">Track and manage operational expenses</p>
          </div>
          <Button onClick={() => setShowAddExpense(!showAddExpense)} className="gap-2">
            <Plus size={20} />
            Add Expense
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
        {expenseStats.map((stat, idx) => {
          const IconComponent = stat.icon
          return (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[color:var(--text-secondary)]">{stat.label}</p>
                    <p className="text-3xl font-bold text-[color:var(--text-primary)] mt-2">{stat.value}</p>
                    <p className="text-xs text-[#22C55E] mt-2">{stat.trend}</p>
                  </div>
                  <IconComponent size={24} className="text-[#2563EB]" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* Add Expense Form */}
      {showAddExpense && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Category</label>
                  <select className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option>Fuel</option>
                    <option>Maintenance</option>
                    <option>Toll & Permits</option>
                    <option>Driver Salary</option>
                    <option>Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Vehicle</label>
                  <select className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option>MH12AB1234</option>
                    <option>MH12CD5678</option>
                    <option>MH12EF9012</option>
                    <option>N/A</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Date</label>
                  <input type="date" className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Amount (₹)</label>
                  <input type="number" placeholder="5000" className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Description</label>
                  <input type="text" placeholder="Diesel refill" className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="secondary" onClick={() => setShowAddExpense(false)}>Cancel</Button>
                <Button>Add Expense</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Expense by Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Expense Trend</CardTitle>
            <CardDescription>10-day breakdown (₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyExpenseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
                <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Line type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Breakdown</CardTitle>
            <CardDescription>Last 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
                <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend />
                <Bar dataKey="fuel" fill="#2563EB" name="Fuel" />
                <Bar dataKey="maintenance" fill="#22C55E" name="Maintenance" />
                <Bar dataKey="salary" fill="#F59E0B" name="Salary" />
                <Bar dataKey="toll" fill="#0EA5E9" name="Toll & Permits" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div>
              <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-3">Filter by Category</label>
              <div className="flex flex-wrap gap-3">
                {['all', 'Fuel', 'Maintenance', 'Toll & Permits', 'Driver Salary'].map(category => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterCategory === category
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)]'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expenses Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Expense Records</CardTitle>
            <CardDescription>Showing {filteredRecords.length} records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--border-light)]">
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Vehicle</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Description</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[color:var(--text-primary)]">{record.id}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{record.category}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{record.vehicle}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-medium text-[#22C55E]">₹{record.amount}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{record.description}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#22C55E]/10 text-[#22C55E]">
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Fuel', budget: 60000, spent: 51000, percentage: 85 },
                { category: 'Maintenance', budget: 20000, spent: 16000, percentage: 80 },
                { category: 'Salary', budget: 115000, spent: 105000, percentage: 91 },
                { category: 'Toll & Permits', budget: 5000, spent: 4200, percentage: 84 },
              ].map(item => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-[color:var(--text-primary)]">{item.category}</p>
                    <p className="text-sm text-[color:var(--text-secondary)]">₹{item.spent} / ₹{item.budget}</p>
                  </div>
                  <div className="w-full bg-[color:var(--bg-secondary)] rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        item.percentage > 90 ? 'bg-[#EF4444]' : item.percentage > 75 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-[color:var(--text-secondary)] mt-1">{item.percentage}% of budget used</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
