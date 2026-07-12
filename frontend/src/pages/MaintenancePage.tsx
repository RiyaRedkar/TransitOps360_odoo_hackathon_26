import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MaintenancePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Maintenance</h1>
          <p className="text-[color:var(--text-secondary)] mt-1">Schedule and track vehicle maintenance</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          New Maintenance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[color:var(--text-secondary)]">Maintenance tracking interface will be implemented</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
