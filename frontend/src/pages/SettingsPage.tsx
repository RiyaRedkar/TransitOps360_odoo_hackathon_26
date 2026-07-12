import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Palette,
  Bell,
  Truck,
  Shield,
  Users,
  Database,
  Info,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: 'Shilpa Admin',
    email: 'admin@transit.com',
    phone: '+91 98765 43210',
    department: 'Fleet Operations',
    role: 'Fleet Manager',
    avatar: 'SA',
  })

  const [appearance, setAppearance] = useState({
    theme: 'dark',
    accentColor: 'blue',
    fontSize: 'medium',
    compactMode: false,
    animations: true,
  })

  const [notifications, setNotifications] = useState({
    tripAssigned: true,
    tripCompleted: true,
    maintenanceReminder: true,
    fuelAlerts: true,
    licenseExpiry: true,
    vehicleMaintenance: true,
    emailNotif: true,
    desktopNotif: true,
    smsNotif: false,
  })

  const [fleet, setFleet] = useState({
    fuelType: 'diesel',
    distanceUnit: 'km',
    weightUnit: 'kg',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    defaultView: 'fleetManager',
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    loginAlerts: true,
    passwordExpiry: true,
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Settings</h1>
          <p className="text-[color:var(--text-secondary)] mt-1">
            Manage your account, fleet preferences, notifications and security.
          </p>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#2563EB] rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{profile.avatar}</span>
              </div>
              <Button variant="secondary" size="sm">
                Change Avatar
              </Button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Full Name
                </label>
                <Input
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Email
                </label>
                <Input value={profile.email} disabled placeholder="Email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Phone Number
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Department
                </label>
                <Input
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  placeholder="Department"
                />
              </div>
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                Role
              </label>
              <Input value={profile.role} disabled placeholder="Role" />
              <p className="text-xs text-[color:var(--text-secondary)] mt-2">Role can only be changed by administrators</p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button className="flex items-center gap-2">
                <Save size={16} />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center flex-shrink-0">
                <Palette size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your interface appearance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
                Theme
              </label>
              <div className="flex gap-3 flex-wrap">
                {['light', 'dark', 'system'].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => setAppearance({ ...appearance, theme: themeOption })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      appearance.theme === themeOption
                        ? 'bg-[#2563EB] text-white shadow-lg'
                        : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)]'
                    }`}
                  >
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Selection */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
                Accent Color
              </label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { name: 'Blue', value: 'blue', color: '#2563EB' },
                  { name: 'Green', value: 'green', color: '#22C55E' },
                  { name: 'Purple', value: 'purple', color: '#8B5CF6' },
                  { name: 'Orange', value: 'orange', color: '#F59E0B' },
                ].map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAppearance({ ...appearance, accentColor: color.value })}
                    className={`w-10 h-10 rounded-lg transition-all border-2 ${
                      appearance.accentColor === color.value
                        ? 'border-[color:var(--text-primary)]'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
                Font Size
              </label>
              <div className="flex gap-3 flex-wrap">
                {['small', 'medium', 'large'].map((sizeOption) => (
                  <button
                    key={sizeOption}
                    onClick={() => setAppearance({ ...appearance, fontSize: sizeOption })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      appearance.fontSize === sizeOption
                        ? 'bg-[#2563EB] text-white shadow-lg'
                        : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)]'
                    }`}
                  >
                    {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[color:var(--bg-secondary)] rounded-lg">
                <label className="text-sm font-medium text-[color:var(--text-primary)] cursor-pointer">
                  Compact Mode
                </label>
                <input
                  type="checkbox"
                  checked={appearance.compactMode}
                  onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-[color:var(--bg-secondary)] rounded-lg">
                <label className="text-sm font-medium text-[color:var(--text-primary)] cursor-pointer">
                  Enable Animations
                </label>
                <input
                  type="checkbox"
                  checked={appearance.animations}
                  onChange={(e) => setAppearance({ ...appearance, animations: e.target.checked })}
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>


      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#F59E0B] rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Control what notifications you receive</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: 'tripAssigned', label: 'Trip Assigned' },
              { key: 'tripCompleted', label: 'Trip Completed' },
              { key: 'maintenanceReminder', label: 'Maintenance Reminder' },
              { key: 'fuelAlerts', label: 'Fuel Threshold Alerts' },
              { key: 'licenseExpiry', label: 'Driver License Expiry' },
              { key: 'vehicleMaintenance', label: 'Vehicle Maintenance Due' },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-[color:var(--bg-secondary)] rounded-lg hover:bg-[color:var(--bg-tertiary)]/50 transition-colors"
              >
                <label className="text-sm font-medium text-[color:var(--text-primary)] cursor-pointer">
                  {label}
                </label>
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [key]: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </div>
            ))}

            {/* Notification Channels */}
            <div className="border-t border-[color:var(--border-light)] pt-4 mt-4">
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
                Notification Channels
              </label>
              <div className="space-y-3">
                {[
                  { key: 'emailNotif', label: 'Email Notifications' },
                  { key: 'desktopNotif', label: 'Desktop Notifications' },
                  { key: 'smsNotif', label: 'SMS Notifications' },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-[color:var(--bg-secondary)] rounded-lg"
                  >
                    <label className="text-sm font-medium text-[color:var(--text-primary)] cursor-pointer">
                      {label}
                    </label>
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button className="flex items-center gap-2">
                <Save size={16} />
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fleet Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#0EA5E9] rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>Fleet Settings</CardTitle>
                <CardDescription>Configure fleet-wide preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Default Fuel Type
                </label>
                <select
                  value={fleet.fuelType}
                  onChange={(e) => setFleet({ ...fleet, fuelType: e.target.value })}
                  className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Petrol</option>
                  <option value="electric">Electric</option>
                  <option value="cng">CNG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Distance Unit
                </label>
                <select
                  value={fleet.distanceUnit}
                  onChange={(e) => setFleet({ ...fleet, distanceUnit: e.target.value })}
                  className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="km">Kilometers</option>
                  <option value="mi">Miles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Weight Unit
                </label>
                <select
                  value={fleet.weightUnit}
                  onChange={(e) => setFleet({ ...fleet, weightUnit: e.target.value })}
                  className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="kg">Kilograms</option>
                  <option value="lb">Pounds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Currency
                </label>
                <select
                  value={fleet.currency}
                  onChange={(e) => setFleet({ ...fleet, currency: e.target.value })}
                  className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Timezone
                </label>
                <select
                  value={fleet.timezone}
                  onChange={(e) => setFleet({ ...fleet, timezone: e.target.value })}
                  className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
                  Default Dashboard View
                </label>
                <select
                  value={fleet.defaultView}
                  onChange={(e) => setFleet({ ...fleet, defaultView: e.target.value })}
                  className="w-full bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="fleetManager">Fleet Manager</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="safetyOfficer">Safety Officer</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#EF4444] rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Change */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
                Change Password
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-xs text-[color:var(--text-secondary)] mb-1">
                    Current Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="flex-1 bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <button
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                      }
                      className="p-2 hover:bg-[color:var(--bg-tertiary)] rounded-lg transition-colors"
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs text-[color:var(--text-secondary)] mb-1">
                    New Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={security.newPassword}
                      onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="flex-1 bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <button
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="p-2 hover:bg-[color:var(--bg-tertiary)] rounded-lg transition-colors"
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs text-[color:var(--text-secondary)] mb-1">
                    Confirm Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="flex-1 bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border-light)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <button
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                      }
                      className="p-2 hover:bg-[color:var(--bg-tertiary)] rounded-lg transition-colors"
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button size="sm" className="flex items-center gap-2">
                  <Save size={16} />
                  Update Password
                </Button>
              </div>
            </div>

            {/* Security Options */}
            <div className="border-t border-[color:var(--border-light)] pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[color:var(--bg-secondary)] rounded-lg">
                  <label className="text-sm font-medium text-[color:var(--text-primary)] cursor-pointer">
                    Enable Two-Factor Authentication
                  </label>
                  <input
                    type="checkbox"
                    checked={security.twoFactorAuth}
                    onChange={(e) => setSecurity({ ...security, twoFactorAuth: e.target.checked })}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-[color:var(--bg-secondary)] rounded-lg">
                  <label className="text-sm font-medium text-[color:var(--text-primary)] cursor-pointer">
                    Enable Login Alerts
                  </label>
                  <input
                    type="checkbox"
                    checked={security.loginAlerts}
                    onChange={(e) => setSecurity({ ...security, loginAlerts: e.target.checked })}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-[color:var(--bg-secondary)] rounded-lg">
                  <label className="text-sm font-medium text-[color:var(--text-primary)] cursor-pointer">
                    Force Password Change Every 90 Days
                  </label>
                  <input
                    type="checkbox"
                    checked={security.passwordExpiry}
                    onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.checked })}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>


      {/* Roles & Permissions Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#06B6D4] rounded-lg flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Admin only - Manage user roles and permissions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  role: 'Fleet Manager',
                  permissions: ['Manage Vehicles', 'Manage Drivers', 'Dispatch Trips', 'Maintenance', 'Analytics'],
                },
                {
                  role: 'Dispatcher',
                  permissions: ['Dispatch Trips', 'View Fleet', 'View Drivers', 'Analytics'],
                },
                {
                  role: 'Safety Officer',
                  permissions: ['View Drivers', 'Compliance Reports', 'License Tracking', 'Analytics'],
                },
              ].map((item) => (
                <div key={item.role} className="p-4 bg-[color:var(--bg-secondary)] rounded-lg">
                  <p className="font-medium text-[color:var(--text-primary)] mb-2">{item.role}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-xs font-medium"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[color:var(--text-secondary)] italic">Read-only view. Contact your administrator to modify permissions.</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#6366F1] rounded-lg flex items-center justify-center flex-shrink-0">
                <Database size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export, import, and backup your fleet data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Export Section */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
                Export Data
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button variant="secondary" size="sm">
                  Export Vehicles CSV
                </Button>
                <Button variant="secondary" size="sm">
                  Export Drivers CSV
                </Button>
                <Button variant="secondary" size="sm">
                  Export Trips CSV
                </Button>
                <Button variant="secondary" size="sm">
                  Export Reports PDF
                </Button>
              </div>
            </div>

            {/* Import Section */}
            <div className="border-t border-[color:var(--border-light)] pt-6">
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
                Import Data
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button variant="secondary" size="sm">
                  Import Vehicles
                </Button>
                <Button variant="secondary" size="sm">
                  Import Drivers
                </Button>
              </div>
            </div>

            {/* Backup Section */}
            <div className="border-t border-[color:var(--border-light)] pt-6">
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
                Backup & Restore
              </label>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm">
                  Backup Database
                </Button>
                <Button variant="secondary" size="sm">
                  Restore Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#10B981] rounded-lg flex items-center justify-center flex-shrink-0">
                <Info size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle>System Information</CardTitle>
                <CardDescription>Current application and environment details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Application', value: 'TransitOps360' },
                { label: 'Version', value: 'v1.0.0' },
                { label: 'Frontend', value: 'React 19' },
                { label: 'Backend', value: 'FastAPI' },
                { label: 'Database', value: 'PostgreSQL' },
                { label: 'Environment', value: 'Development' },
                { label: 'Last Sync', value: new Date().toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 bg-[color:var(--bg-secondary)] rounded-lg">
                  <span className="text-sm font-medium text-[color:var(--text-secondary)]">{item.label}</span>
                  <span className="text-sm text-[color:var(--text-primary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <Card className="border-[#EF4444] border-2">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#EF4444]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-[#EF4444]" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-[#EF4444]">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="secondary"
              size="sm"
              className="w-full border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
            >
              Reset Demo Data
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
            >
              Clear Cache
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
            >
              Delete Demo Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
