import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Mail, Lock, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import client from '@/api/client'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@transit.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Call real backend API
      const response = await client.post('/auth/login', {
        username: email,
        password: password,
      })

      // Store JWT token
      const { access_token } = response.data
      localStorage.setItem('access_token', access_token)

      // Navigate to dashboard
      navigate('/')
      setLoading(false)
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please try again.'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A] flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#2563EB] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#06B6D4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-[#2563EB] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-xl shadow-lg mb-4">
            <Truck size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">TransitOps360</h1>
          <p className="text-[#CBD5E1]">Fleet Operations Management Platform</p>
        </motion.div>

        {/* Login Card */}
        <Card className="backdrop-blur-xl bg-[#1E293B]/80 border-[rgba(255,255,255,0.1)] shadow-2xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Welcome Back</h2>
            <p className="text-[#CBD5E1] text-sm mb-6">Sign in to your account to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-[#F8FAFC] mb-2">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
                  <Input
                    type="email"
                    placeholder="admin@transit.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-[#F8FAFC] mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-[#EF4444] text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#CBD5E1] hover:text-[#F8FAFC] cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-[#2563EB] hover:text-[#3B82F6] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
              <p className="text-xs text-[#94A3B8] mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs">
                <p className="text-[#CBD5E1]">Email: <span className="text-[#2563EB] font-mono">admin@transit.com</span></p>
                <p className="text-[#CBD5E1]">Password: <span className="text-[#2563EB] font-mono">admin123</span></p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[#94A3B8] text-xs mt-6"
        >
          © 2024 TransitOps360. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  )
}
