'use client'

import React, { useState, useEffect } from 'react'

interface MobileOptimizedLayoutProps {
  children: React.ReactNode
  isMobile?: boolean
}

export function MobileOptimizedLayout({
  children,
  isMobile
}: MobileOptimizedLayoutProps) {
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileState, setIsMobileState] = useState(isMobile ?? false)
  
  useEffect(() => {
    if (isMobile !== undefined) {
      setIsMobileState(isMobile)
      return
    }
    
    const checkMobile = () => {
      setIsMobileState(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])
  
  // Desktop: normal layout
  if (!isMobileState) {
    return <>{children}</>
  }
  
  // Mobile: bottom sheet style
  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      {/* Bottom Sheet */}
      <div
        className={`
          bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ease-out
          ${isExpanded ? 'h-[90vh]' : 'h-[60vh]'}
        `}
      >
        
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-1.5 bg-gray-300 rounded-full"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          />
        </div>
        
        {/* Content */}
        <div className="h-full overflow-y-auto px-4 pb-8">
          {children}
        </div>
        
      </div>
      
    </div>
  )
}

// Hook to detect mobile
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}















