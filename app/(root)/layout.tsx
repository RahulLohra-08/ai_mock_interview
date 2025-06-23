'use client'
import React, { ReactNode } from 'react'
import { Toaster } from 'sonner' //allow user to showing toast for error and success

const RootLayout = ({ children } : { children: ReactNode}) => {
  return (
    <div>
      {children}
      {/* Import Toaster component in root file */}
      <Toaster /> 
    </div>
  )
}

export default RootLayout