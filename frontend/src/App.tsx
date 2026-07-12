import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AppLayout } from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import VehiclesPage from './pages/VehiclesPage'
import DriversPage from './pages/DriversPage'
import TripsPage from './pages/TripsPage'
import MaintenancePage from './pages/MaintenancePage'
import CompliancePage from './pages/CompliancePage'
import AnalyticsPage from './pages/AnalyticsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import FuelPage from './pages/FuelPage'
import ExpensesPage from './pages/ExpensesPage'

// Protected Route Component
function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  
  console.log('🔒 ProtectedRoute check - Authenticated:', isAuthenticated)
  
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to /login')
    return <Navigate to="/login" replace />
  }
  
  console.log('✅ Authenticated, rendering AppLayout')
  return <AppLayout />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/fuel" element={<FuelPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  )
}

export default App
