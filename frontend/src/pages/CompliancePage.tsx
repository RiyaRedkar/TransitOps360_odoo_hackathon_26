import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { motion } from 'framer-motion'

export default function CompliancePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Compliance</h1>
        <p className="text-[color:var(--text-secondary)] mt-1">Monitor license and document expiry</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[color:var(--text-secondary)]">Compliance tracking interface will be implemented</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
