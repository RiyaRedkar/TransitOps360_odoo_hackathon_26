import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, DollarSign, Droplet, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock Fuel Data
const fuelRecords = [
  {
    id: 'F-001',
    vehicle: 'MH12AB1234',
    date: '2024-03-10',
    quantity: 45.5,
    cost: 5460,
    pricePerLiter: 120,
    mileage: 45000,
    location: 'Mumbai Pump',
    fuelType: 'Diesel',
  },
  {
    id: 'F-002',
    vehicle: 'MH12CD5678',
    date: '2024-03-09',
    quantity: 52.0,
    cost: 6240,
    pricePerLiter: 120,
    mileage: 38000,
    location: 'Pune Pump',
    fuelType: 'Diesel',
  },
  {
    id: 'F-003',
    vehicle: 'MH12EF9012',
    date: '2024-03-08',
    quantity: 48.3,
    cost: 5796,
    pricePerLiter: 120,
    mileage: 52000,
    location: 'Nashik Pump',
    fuelType: 'Diesel',
  },
  {
    id: 'F-004',
    vehicle: 'MH12GH3456',
    date: '2024-03-07',
    quantity: 55.0,
    cost: 6600,
    pricePerLiter: 120,
    mileage: 48000,
    location: 'Mumbai Pump',
    fuelType: 'Diesel',
  },
]

// Mock Fuel Efficiency Data (for charts)
const fuelEfficiencyData = [
  { date: 'Mar 1', efficiency: 5.2, cost: 4800 },
  { date: 'Mar 2', efficiency: 5.1, cost: 5100 },
  { date: 'Mar 3', efficiency: 5.3, cost: 4900 },
  { date: 'Mar 4', efficiency: 5.0, cost: 5300 },
  { date: 'Mar 5', efficiency: 5.4, cost: 4700 },
  { date: 'Mar 6', efficiency: 5.2, cost: 5000 },
  { date: 'Mar 7', efficiency: 5.1, cost: 5150 },
  { date: 'Mar 8', efficiency: 5.3, cost: 4950 },
  { date: 'Mar 9', efficiency: 5.2, cost: 5050 },
  { date: 'Mar 10', efficiency: 5.5, cost: 4600 },
]

// Mock Fuel Price History
const fuelPriceData = [
  { date: 'Feb 20', price: 115 },
  { date: 'Feb 25', price: 117 },
  { date: 'Mar 1', price: 118 },
  { date: 'Mar 5', price: 120 },
  { date: 'Mar 10', price: 120 },
]

const fuelStats = [
  { label: 'Total Fuel Consumed', value: '8,450L', icon: Droplet, trend: '+3%' },
  { label: 'Avg Fuel Cost/Month', value: '₹1.2L', icon: DollarSign, trend: '+5%' },
  { label: 'Fleet Avg Efficiency', value: '5.2 km/L', icon: TrendingUp, trend: '+2%' },
  { label: 'Fuel Alerts', value: '3', icon: AlertTriangle, trend: 'High consumption' },
]

export default function FuelPage() {
  const [filterVehicle, setFilterVehicle] = useState('all')
  const [showAddFuel, setShowAddFuel] = useState(false)

  const filteredRecords = filterVehicle === 'all'
    ? fuelRecords
    : fuelRecords.filter(r => r.vehicle === filterVehicle)

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
            <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Fuel Management</h1>
            <p className="text-[color:var(--text-secondary)] mt-1">Track fuel consumption, costs, and efficiency</p>
          </div>
          <Button onClick={() => setShowAddFuel(!showAddFuel)} className="gap-2">
            <Plus size={20} />
            Add Fuel Record
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
        {fuelStats.map((stat, idx) => {
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

      {/* Add Fuel Form */}
      {showAddFuel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add Fuel Record</CardTitle>
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
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Quantity (Liters)</label>
                  <input type="number" placeholder="45.5" className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Date</label>
                  <input type="date" className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Price/Liter (₹)</label>
                  <input type="number" placeholder="120" className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Mileage (km)</label>
                  <input type="number" placeholder="45000" className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-2">Fuel Type</label>
                  <select className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option>Diesel</option>
                    <option>Petrol</option>
                    <option>CNG</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="secondary" onClick={() => setShowAddFuel(false)}>Cancel</Button>
                <Button>Add Record</Button>
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
        {/* Fuel Efficiency Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Fuel Efficiency Trend</CardTitle>
            <CardDescription>10-day average (km/L)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fuelEfficiencyData}>
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
                <Line type="monotone" dataKey="efficiency" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Fuel Cost */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Fuel Cost</CardTitle>
            <CardDescription>10-day cost breakdown (₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fuelEfficiencyData}>
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
                <Bar dataKey="cost" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fuel Price History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Fuel Price History</CardTitle>
            <CardDescription>Diesel prices trend (₹/Liter)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fuelPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
                <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} domain={[110, 125]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} name="Diesel (₹/L)" />
              </LineChart>
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
              <label className="text-sm font-medium text-[color:var(--text-primary)] block mb-3">Filter by Vehicle</label>
              <div className="flex flex-wrap gap-3">
                {['all', 'MH12AB1234', 'MH12CD5678', 'MH12EF9012', 'MH12GH3456'].map(vehicle => (
                  <button
                    key={vehicle}
                    onClick={() => setFilterVehicle(vehicle)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterVehicle === vehicle
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)]'
                    }`}
                  >
                    {vehicle === 'all' ? 'All Vehicles' : vehicle}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fuel Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Fuel Records</CardTitle>
            <CardDescription>Showing {filteredRecords.length} records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--border-light)]">
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Record ID</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Vehicle</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Quantity (L)</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Price/L</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Total Cost</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Mileage</th>
                    <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[color:var(--text-primary)]">{record.id}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{record.vehicle}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{record.quantity}L</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">₹{record.pricePerLiter}</td>
                      <td className="py-3 px-4 font-medium text-[#22C55E]">₹{record.cost}</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{record.mileage} km</td>
                      <td className="py-3 px-4 text-[color:var(--text-secondary)]">{record.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fuel Efficiency by Vehicle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Fuel Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { vehicle: 'MH12AB1234', efficiency: 5.2, consumption: '₹120/km' },
                { vehicle: 'MH12CD5678', efficiency: 4.9, consumption: '₹130/km' },
                { vehicle: 'MH12EF9012', efficiency: 5.1, consumption: '₹125/km' },
                { vehicle: 'MH12GH3456', efficiency: 5.4, consumption: '₹115/km' },
              ].map(item => (
                <div key={item.vehicle} className="p-4 bg-[color:var(--bg-secondary)] rounded-lg border border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)] transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[color:var(--text-primary)]">{item.vehicle}</p>
                      <p className="text-sm text-[color:var(--text-secondary)] mt-1">Efficiency: {item.efficiency} km/L</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#2563EB]">{item.consumption}</p>
                    </div>
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
