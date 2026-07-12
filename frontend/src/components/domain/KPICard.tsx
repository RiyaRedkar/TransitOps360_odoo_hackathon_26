import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  description?: string
  className?: string
  onClick?: () => void
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  description,
  className,
  onClick,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ translateY: -4 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className={cn('hover:border-[color:var(--border-light)] transition-all', className)}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-[color:var(--text-secondary)] font-medium">{title}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-[color:var(--text-primary)]">{value}</p>
                {trend && (
                  <div className={cn(
                    'flex items-center gap-0.5 text-sm font-medium',
                    trend.direction === 'up' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  )}>
                    {trend.direction === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    <span>{trend.value}%</span>
                  </div>
                )}
              </div>
              {description && (
                <p className="text-xs text-[color:var(--text-tertiary)] mt-2">{description}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center text-[#2563EB] flex-shrink-0">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
