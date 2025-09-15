import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import { Providers } from '@/app/providers';

// Mock the child components
const MockChildren = () => <div data-testid="children">Test Content</div>;

describe('Providers Component', () => {
  it('renders children with all providers', () => {
    const { getByTestId } = renderWithProviders(
      <Providers>
        <MockChildren />
      </Providers>
    );
    
    expect(getByTestId('children')).toBeInTheDocument();
  });

  it('wraps children with ApolloProvider', () => {
    const { getByTestId } = renderWithProviders(
      <Providers>
        <MockChildren />
      </Providers>
    );
    
    expect(getByTestId('children')).toBeInTheDocument();
  });

  it('wraps children with StripeProvider', () => {
    const { getByTestId } = renderWithProviders(
      <Providers>
        <MockChildren />
      </Providers>
    );
    
    expect(getByTestId('children')).toBeInTheDocument();
  });

  it('wraps children with SocketProvider', () => {
    const { getByTestId } = renderWithProviders(
      <Providers>
        <MockChildren />
      </Providers>
    );
    
    expect(getByTestId('children')).toBeInTheDocument();
  });
});
