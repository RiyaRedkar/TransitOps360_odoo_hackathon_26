import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronRight,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTheme } from '@/context/ThemeContext'

const breadcrumbMap: Record<string, string[]> = {
  '/': ['Dashboard'],
  '/vehicles': ['Fleet', 'Vehicles'],
  '/vehicles/:id': ['Fleet', 'Vehicles', 'Details'],
  '/drivers': ['Fleet', 'Drivers'],
  '/trips': ['Operations', 'Trips'],
  '/maintenance': ['Operations', 'Maintenance'],
  '/fuel': ['Operations', 'Fuel Logs'],
  '/expenses': ['Finance', 'Expenses'],
  '/analytics': ['Intelligence', 'Analytics'],
  '/reports': ['Reports'],
  '/settings': ['Settings'],
}

export function TopNav() {
  const location = useLocation()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = breadcrumbMap[location.pathname] || ['Dashboard']
    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <nav className="sticky top-0 z-30 h-16 bg-[color:var(--bg-secondary)] border-b border-[color:var(--border-light)] flex items-center px-4 lg:px-6 gap-4 transition-colors duration-200">
      {/* Breadcrumbs */}
      <div className="hidden lg:flex items-center gap-2 flex-1 min-w-0">
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-2 min-w-0">
            {idx > 0 && <ChevronRight size={16} className="text-[color:var(--text-tertiary)] flex-shrink-0" />}
            <span className={cn(
              'text-sm truncate',
              idx === breadcrumbs.length - 1
                ? 'text-[color:var(--text-primary)] font-medium'
                : 'text-[color:var(--text-secondary)]'
            )}>
              {crumb}
            </span>
          </div>
        ))}
      </div>

      {/* Search Bar - Desktop */}
      <div className="hidden md:flex flex-1 max-w-xs">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--text-tertiary)]" />
          <Input
            type="search"
            placeholder="Search vehicles, trips..."
            className="pl-9 bg-[color:var(--bg-tertiary)]"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 lg:gap-4 ml-auto">
        {/* Search Mobile */}
        <Button variant="ghost" size="icon" className="md:hidden text-[color:var(--text-primary)]">
          <Search size={20} />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-[color:var(--text-primary)]"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full" />
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[color:var(--bg-tertiary)] border border-[color:var(--border-light)] rounded-lg shadow-lg p-4 space-y-3 transition-colors duration-200">
              <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Notifications</h3>
              {[
                {
                  title: 'Vehicle Maintenance Due',
                  desc: 'Vehicle MH12AB1234 requires maintenance',
                  time: '2 hours ago',
                },
                {
                  title: 'Trip Completed',
                  desc: 'Trip T-001 completed successfully',
                  time: '1 hour ago',
                },
              ].map((notif, idx) => (
                <div key={idx} className="pb-3 border-b border-[color:var(--border-light)] last:border-0 transition-colors duration-200">
                  <p className="text-xs font-medium text-[color:var(--text-primary)]">{notif.title}</p>
                  <p className="text-xs text-[color:var(--text-secondary)]">{notif.desc}</p>
                  <p className="text-xs text-[color:var(--text-tertiary)] mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-[color:var(--text-primary)]"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[color:var(--bg-tertiary)] transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-full flex items-center justify-center text-white text-xs font-bold">
              SA
            </div>
            <span className="text-sm font-medium text-[color:var(--text-primary)] hidden lg:block">Shilpa</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[color:var(--bg-tertiary)] border border-[color:var(--border-light)] rounded-lg shadow-lg p-2 transition-colors duration-200">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-secondary)] transition-colors"
              >
                <Settings size={16} className="text-[color:var(--text-primary)]" />
                Settings
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('access_token')
                  window.location.href = '/login'
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#EF4444] hover:bg-[color:var(--bg-secondary)] transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
