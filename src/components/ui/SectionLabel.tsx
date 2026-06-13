import { cn } from "@/lib/utils"
import * as React from "react"

export interface SectionLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function SectionLabel({ className, children, ...props }: SectionLabelProps) {
  return (
    <p className={cn("eyebrow", className)} {...props}>
      {children}
    </p>
  )
}
