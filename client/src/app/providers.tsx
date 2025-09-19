'use client'

import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from '../lib/apollo'
import { ThemeProvider } from '../components/ThemeProvider'
import { StripeProvider } from '../components/StripeProvider'
import { SocketProvider } from '../components/SocketProvider'
import { Toaster } from '../components/ui/Toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <StripeProvider>
          <SocketProvider>
            {children}
            <Toaster />
          </SocketProvider>
        </StripeProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}
