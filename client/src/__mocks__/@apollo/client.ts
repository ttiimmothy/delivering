import { vi } from 'vitest';

// Mock Apollo Client
const mockClient = {
  query: vi.fn(),
  mutate: vi.fn(),
  watchQuery: vi.fn(),
  subscribe: vi.fn(),
  readQuery: vi.fn(),
  writeQuery: vi.fn(),
  readFragment: vi.fn(),
  writeFragment: vi.fn(),
  writeData: vi.fn(),
  resetStore: vi.fn(),
  clearStore: vi.fn(),
  onClearStore: vi.fn(),
  onResetStore: vi.fn(),
  cache: {
    readQuery: vi.fn(),
    writeQuery: vi.fn(),
    readFragment: vi.fn(),
    writeFragment: vi.fn(),
    writeData: vi.fn(),
    reset: vi.fn(),
    evict: vi.fn(),
    restore: vi.fn(),
    extract: vi.fn(),
    diff: vi.fn(),
    watch: vi.fn(),
    gc: vi.fn(),
    modify: vi.fn(),
    transform: vi.fn(),
    batch: vi.fn(),
    performTransaction: vi.fn(),
    recordOptimisticTransaction: vi.fn(),
    transformForLink: vi.fn(),
  },
} as any;

export const gql = vi.fn((strings, ...values) => {
  // Mock GraphQL Document object
  const queryString = strings.join('');
  let operation = 'query'; // Default
  
  // Detect operation type from the query string
  if (queryString.includes('mutation')) {
    operation = 'mutation';
  } else if (queryString.includes('subscription')) {
    operation = 'subscription';
  }
  
  return {
    kind: 'Document',
    definitions: [{
      kind: 'OperationDefinition',
      operation: operation,
      name: { kind: 'Name', value: 'MockOperation' },
      selectionSet: { kind: 'SelectionSet', selections: [] }
    }]
  };
});

export const useQuery = vi.fn(() => ({
  data: null,
  loading: false,
  error: null,
  refetch: vi.fn(),
  fetchMore: vi.fn(),
}));

export const useMutation = vi.fn(() => [
  vi.fn(),
  { loading: false, error: null, data: null }
]);

export const useSubscription = vi.fn(() => ({
  data: null,
  loading: false,
  error: null,
}));

export const useApolloClient = vi.fn(() => mockClient);

export const ApolloProvider = ({ children }: { children: React.ReactNode }) => children;

export const MockedProvider = ({ children }: { children: React.ReactNode }) => children;

export const createHttpLink = vi.fn(() => ({}));

export const HttpLink = vi.fn(() => ({}));

export const createApolloClient = vi.fn(() => mockClient);

export const ApolloClient = vi.fn(() => mockClient);

export const InMemoryCache = vi.fn(() => ({}));

export const RetryLink = vi.fn(() => ({}));

export const ErrorLink = vi.fn(() => ({}));

export const onError = vi.fn(() => ({}));

export const from = vi.fn(() => []);

export const ApolloLink = {
  from: vi.fn(() => [])
};

export const setContext = vi.fn(() => ({}));

export const SetContextLink = vi.fn(() => ({}));

export const CombinedGraphQLErrors = {
  is: vi.fn(() => false)
};

export const ServerError = {
  is: vi.fn(() => false)
};
