import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Truck,
  Users,
  MapPin,
  Wrench,
  Fuel,
  DollarSign,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

interface NavItem {
  label: string
  icon: React.ReactNode
  href?: string
  submenu?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <Home size={20} />, href: '/' },
  {
    label: 'Fleet',
    icon: <Truck size={20} />,
    submenu: [
      { label: 'Vehicles', icon: <Truck size={16} />, href: '/vehicles' },
      { label: 'Drivers', icon: <Users size={16} />, href: '/drivers' },
    ],
  },
  { label: 'Trips', icon: <MapPin size={20} />, href: '/trips' },
  { label: 'Maintenance', icon: <Wrench size={20} />, href: '/maintenance' },
  { label: 'Fuel Logs', icon: <Fuel size={20} />, href: '/fuel' },
  { label: 'Expenses', icon: <DollarSign size={20} />, href: '/expenses' },
  { label: 'Analytics', icon: <BarChart3 size={20} />, href: '/analytics' },
  { label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
]

export function Sidebar({ isDesktop = true }: { isDesktop?: boolean }) {
  const location = useLocation()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href?: string) => {
    if (!href) return false
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    if (item.submenu) {
      return (
        <div key={item.label}>
          <button
            onClick={() => setExpandedMenu(expandedMenu === item.label ? null : item.label)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
              expandedMenu === item.label
                ? 'bg-[#2563EB]/10 text-[#2563EB]'
                : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-tertiary)]/50'
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                'transition-transform',
                expandedMenu === item.label && 'rotate-180'
              )}
            />
          </button>
          {expandedMenu === item.label && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-4 border-l border-[color:var(--border-light)]"
            >
              {item.submenu.map((subitem) => (
                <Link
                  key={subitem.href}
                  to={subitem.href || '#'}
                  onClick={() => !isDesktop && setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors',
                    isActive(subitem.href)
                      ? 'bg-[#2563EB]/10 text-[#2563EB] font-medium'
                      : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-tertiary)]/50'
                  )}
                >
                  {subitem.icon}
                  <span>{subitem.label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        to={item.href || '#'}
        onClick={() => !isDesktop && setIsMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isActive(item.href)
            ? 'bg-[#2563EB]/10 text-[#2563EB] border-l-4 border-[#2563EB]'
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-tertiary)]/50'
        )}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    )
  }

  // Desktop Sidebar - Static rendering
  if (isDesktop) {
    return (
      <aside className="w-64 h-full bg-[color:var(--bg-secondary)] border-r border-[color:var(--border-light)] flex flex-col overflow-hidden transition-colors duration-200">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[color:var(--border-light)] transition-colors duration-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-lg flex items-center justify-center">
              <Truck size={20} className="text-white dark:text-white" />
            </div>
            <span className="text-lg font-bold text-[color:var(--text-primary)]">TransitOps360</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {navItems.map((item) => (
            <NavItemComponent key={item.label} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[color:var(--border-light)] p-4 space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-xs font-bold">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[color:var(--text-primary)]">Shilpa Admin</p>
              <p className="text-xs text-[color:var(--text-tertiary)]">Fleet Manager</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    )
  }

  // Mobile Sidebar - Drawer with toggle
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[color:var(--bg-secondary)] border-b border-[color:var(--border-light)] flex items-center px-4 z-40 pointer-events-auto transition-colors duration-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="pointer-events-auto"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 pointer-events-auto"
          />

          {/* Drawer Sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-screen w-64 bg-[color:var(--bg-secondary)] border-r border-[color:var(--border-light)] flex flex-col z-50 pointer-events-auto transition-colors duration-200"
          >
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-[color:var(--border-light)] transition-colors duration-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-lg flex items-center justify-center">
                  <Truck size={20} className="text-white dark:text-white" />
                </div>
                <span className="text-lg font-bold text-[color:var(--text-primary)]">TransitOps360</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
              {navItems.map((item) => (
                <NavItemComponent key={item.label} item={item} />
              ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-[color:var(--border-light)] p-4 space-y-4 transition-colors duration-200">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  SA
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[color:var(--text-primary)]">Shilpa Admin</p>
                  <p className="text-xs text-[color:var(--text-tertiary)]">Fleet Manager</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </>
  )
}
