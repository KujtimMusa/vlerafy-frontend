"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient"
  hoverable?: boolean
  children: React.ReactNode
}

export function ModernCard({
  variant = "default",
  hoverable = true,
  className = "",
  children,
  ...props
}: ModernCardProps) {
  const variants = {
    default: "bg-white border border-gray-200 shadow-lg",
    glass: "bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl",
  }

  return (
    <motion.div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        variants[variant]
      } ${hoverable ? "hover:shadow-2xl hover:-translate-y-1 cursor-pointer" : ""} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

