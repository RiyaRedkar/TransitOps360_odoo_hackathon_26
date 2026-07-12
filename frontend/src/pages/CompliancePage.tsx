import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

// Mock Compliance Data
const licenseData = [
  {
    id: 1,
    driver: 'John Doe',
    licenseNumber: 'DL-123456',
    expiryDate: '2025-08-15',
    status: 'active',
    daysLeft: 34,
  },
  {
    id: 2,
    driver: 'Jane Smith',
    licenseNumber: 'DL-234567',
    expiryDate: '2025-03-20',
    status: 'expiring',
    daysLeft: 4,
  },
  {
    id: 3,
    driver: 'Mike Johnson',
    licenseNumber: 'DL-345678',
    expiryDate: '2024-12-10',
    status: 'expired',
    daysLeft: 0,
  },
  {
    id: 4,
    driver: 'Sarah Davis',
    licenseNumber: 'DL-456789',
    expiryDate: '2025-11-30',
    status: 'active',
    daysLeft: 162,
  },
]

const vehicleDocuments = [
  {
    id: 1,
    vehicle: 'MH12AB1234',
    insurance: { date: '2025-06-15', status: 'active', daysLeft: 95 },
    registration: { date: '2025-12-31', status: 'active', daysLeft: 564 },
    pollution: { date: '2025-03-15', status: 'expiring', daysLeft: 4 },
    fitness: { date: '2025-09-30', status: 'active', daysLeft: 201 },
  },
  {
    id: 2,
    vehicle: 'MH12CD5678',
    insurance: { date: '2024-12-20', status: 'expired', daysLeft: 0 },
    registration: { date: '2025-11-15', status: 'active', daysLeft: 108 },
    pollution: { date: '2025-04-30', status: 'active', daysLeft: 50 },
    fitness: { date: '2025-08-15', status: 'active', daysLeft: 126 },
  },
]

const complianceMetrics = [
  { label: 'Active Licenses', value: 28, total: 30, percentage: 93 },
  { label: 'Valid Registrations', value: 49, total: 50, percentage: 98 },
  { label: 'Active Insurance', value: 47, total: 50, percentage: 94 },
  { label: 'Pollution Compliance', value: 45, total: 50, percentage: 90 },
]

export default function CompliancePage() {
  const [selectedTab, setSelectedTab] = useState('licenses')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-[#22C55E]" />
      case 'expiring':
        return <Clock size={16} className="text-[#F59E0B]" />
      case 'expired':
        return <XCircle size={16} className="text-[#EF4444]" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-[#22C55E] bg-[#22C55E]/10'
      case 'expiring':
        return 'text-[#F59E0B] bg-[#F59E0B]/10'
      case 'expired':
        return 'text-[#EF4444] bg-[#EF4444]/10'
      default:
        return ''
    }
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
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Compliance & Documentation</h1>
          <p className="text-[color:var(--text-secondary)] mt-1">
            Monitor licenses, insurance, registration, and vehicle compliance
          </p>
        </div>
      </motion.div>

      {/* Compliance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {complianceMetrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-[color:var(--text-secondary)]">{metric.label}</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-[color:var(--text-primary)]">{metric.percentage}%</p>
                  <p className="text-xs text-[color:var(--text-tertiary)]">
                    {metric.value}/{metric.total}
                  </p>
                </div>
                <div className="w-full h-2 bg-[color:var(--bg-secondary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${metric.percentage >= 95 ? 'bg-[#22C55E]' : metric.percentage >= 80 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex gap-2 mb-6 border-b border-[color:var(--border-light)]">
          {[
            { id: 'licenses', label: 'Driver Licenses', icon: '🆔' },
            { id: 'vehicles', label: 'Vehicle Documents', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                selectedTab === tab.id
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Driver Licenses Tab */}
        {selectedTab === 'licenses' && (
          <Card>
            <CardHeader>
              <CardTitle>Driver License Compliance</CardTitle>
              <CardDescription>Track license validity and expiration dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--border-light)]">
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Driver</th>
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">
                        License Number
                      </th>
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">
                        Expiry Date
                      </th>
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">
                        Days Left
                      </th>
                      <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenseData.map((license) => (
                      <tr
                        key={license.id}
                        className="border-b border-[color:var(--border-light)] hover:bg-[color:var(--bg-tertiary)]/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-[color:var(--text-primary)]">{license.driver}</td>
                        <td className="py-3 px-4 text-[color:var(--text-secondary)] font-mono">
                          {license.licenseNumber}
                        </td>
                        <td className="py-3 px-4 text-[color:var(--text-secondary)]">
                          {new Date(license.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            license.daysLeft > 30 ? 'text-[#22C55E]' :
                            license.daysLeft > 0 ? 'text-[#F59E0B]' :
                            'text-[#EF4444]'
                          }`}>
                            {license.daysLeft > 0 ? `${license.daysLeft} days` : 'Expired'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(license.status)}
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(license.status)}`}>
                              {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Documents Tab */}
        {selectedTab === 'vehicles' && (
          <div className="space-y-4">
            {vehicleDocuments.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{vehicle.vehicle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Insurance', doc: vehicle.insurance, icon: '🛡️' },
                      { name: 'Registration', doc: vehicle.registration, icon: '📄' },
                      { name: 'Pollution', doc: vehicle.pollution, icon: '🌍' },
                      { name: 'Fitness', doc: vehicle.fitness, icon: '✅' },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className={`p-4 rounded-lg border-2 ${
                          doc.doc.status === 'active'
                            ? 'border-[#22C55E]/30 bg-[#22C55E]/5'
                            : doc.doc.status === 'expiring'
                            ? 'border-[#F59E0B]/30 bg-[#F59E0B]/5'
                            : 'border-[#EF4444]/30 bg-[#EF4444]/5'
                        }`}
                      >
                        <div className="text-2xl mb-2">{doc.icon}</div>
                        <p className="font-medium text-[color:var(--text-primary)] text-sm">{doc.name}</p>
                        <p className="text-xs text-[color:var(--text-secondary)] mt-1">
                          {new Date(doc.doc.date).toLocaleDateString()}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-xs font-semibold ${
                            doc.doc.status === 'active'
                              ? 'text-[#22C55E]'
                              : doc.doc.status === 'expiring'
                              ? 'text-[#F59E0B]'
                              : 'text-[#EF4444]'
                          }`}>
                            {doc.doc.daysLeft > 0 ? `${doc.doc.daysLeft}d` : 'Expired'}
                          </span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(doc.doc.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#F59E0B]" />
              Alerts & Actions Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-[#EF4444]/10 border-l-4 border-[#EF4444] rounded-r-lg">
              <p className="font-semibold text-[#EF4444]">License Expired</p>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                Mike Johnson's license (DL-345678) has expired. Immediate action required.
              </p>
            </div>
            <div className="p-4 bg-[#F59E0B]/10 border-l-4 border-[#F59E0B] rounded-r-lg">
              <p className="font-semibold text-[#F59E0B]">Expiring Soon</p>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                Jane Smith's license expires in 4 days (2025-03-20). Schedule renewal.
              </p>
            </div>
            <div className="p-4 bg-[#F59E0B]/10 border-l-4 border-[#F59E0B] rounded-r-lg">
              <p className="font-semibold text-[#F59E0B]">Insurance Renewal</p>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                Vehicle MH12CD5678 insurance has expired. Process renewal immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
