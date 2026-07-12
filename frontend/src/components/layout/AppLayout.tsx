import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { motion } from 'framer-motion'

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen bg-[color:var(--bg-primary)] overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar - Static on desktop, hidden on mobile */}
      <div className="hidden lg:block w-64 h-full overflow-hidden">
        <Sidebar isDesktop={true} />
      </div>

      {/* Mobile Sidebar - Overlay on mobile, hidden on desktop */}
      <div className="lg:hidden fixed inset-0 z-50 pointer-events-none">
        <Sidebar isDesktop={false} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Navigation */}
        <TopNav />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 lg:p-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
