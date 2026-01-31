"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/contexts/cart-context"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // During SSR, render a minimal version without client-dependent providers
  if (!isHydrated) {
    return <>{children}</>
  }

  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  )
}
