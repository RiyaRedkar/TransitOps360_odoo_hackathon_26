import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#2563EB] text-white',
        secondary: 'border-transparent bg-[#1E293B] text-[#F8FAFC]',
        destructive: 'border-transparent bg-[#EF4444] text-white',
        outline: 'text-[#F8FAFC] border-[rgba(255,255,255,0.2)]',
        success: 'border-transparent bg-[#22C55E]/10 text-[#22C55E]',
        warning: 'border-transparent bg-[#F59E0B]/10 text-[#F59E0B]',
        danger: 'border-transparent bg-[#EF4444]/10 text-[#EF4444]',
        info: 'border-transparent bg-[#0EA5E9]/10 text-[#0EA5E9]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
