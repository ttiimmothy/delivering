'use client'

import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apollo'
import { ThemeProvider } from '@/components/theme-provider'
import { StripeProvider } from '@/components/stripe-provider'
import { SocketProvider } from '@/components/socket-provider'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
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
