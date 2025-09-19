import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache, ServerError, createHttpLink, from } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink, onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
  credentials: 'include',
})

// use cookies now, not using localStorage to store the token
// const authLink = setContext((_, { headers }) => {
//   // Get the authentication token from local storage if it exists
//   const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  
//   // Return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     }
//   }
// })

const errorLink = new ErrorLink (({ error, result }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      )
    })
  }

  if (ServerError.is(error)) {
    console.error(`[Network error]: ${error}`)
    if ('statusCode' in error && error.statusCode === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }
})

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => !!error && !error.message.includes('Authentication')
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, retryLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          restaurants: {
            keyArgs: ['cuisine', 'isOpen', 'search', 'sortBy', 'sortOrder', 'limit', 'offset'],
            merge(existing = [], incoming, { args }) {
              // If this is a pagination request (has offset), append to existing
              if (args?.offset && args.offset > 0) {
                return [...existing, ...incoming]
              }
              // Otherwise, replace the existing data
              return incoming
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
})
