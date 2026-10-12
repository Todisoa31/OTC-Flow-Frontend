import { cn } from '@/utils/tailwind'
import React from 'react'

type Props = {
    children?: React.ReactNode
    className?: string
}

function CenterLayout({children, className}: Props) {
  return (
    <div className={cn(["h-[calc(100vh-90px)] self-stretch p-[30px] inline-flex flex-col justify-start items-start gap-[30px] overflow-y-scroll grow", className])}>
        {children}
    </div>
  )
}

export default CenterLayout