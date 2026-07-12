import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-medium ring-offset-[#0F172A] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:scale-95 shadow-md hover:shadow-lg',
        secondary: 'bg-[#1E293B] text-[#F8FAFC] hover:bg-[#334155] border border-[rgba(255,255,255,0.08)]',
        destructive: 'bg-[#EF4444] text-white hover:bg-[#DC2626] active:scale-95 shadow-md',
        outline: 'border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10',
        ghost: 'text-[#F8FAFC] hover:bg-[#1E293B]',
        link: 'text-[#2563EB] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
