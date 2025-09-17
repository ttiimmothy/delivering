import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@/__tests__/setup';
import RootLayout from '@/app/layout';

// Mock the child components
const MockChildren = () => <div data-testid="children">Test Content</div>;

describe('RootLayout Component', () => {
  it('renders children with header and footer', () => {
    const { getByTestId } = renderWithProviders(
      <RootLayout>
        <MockChildren />
      </RootLayout>
    );
    
    expect(getByTestId('children')).toBeInTheDocument();
  });

  it('includes header component', () => {
    const { getAllByText } = renderWithProviders(
      <RootLayout>
        <MockChildren />
      </RootLayout>
    );
    
    expect(getAllByText('Delivering')).toHaveLength(2); // Header and footer both have "Delivering"
  });

  it('includes footer component', () => {
    const { getByText } = renderWithProviders(
      <RootLayout>
        <MockChildren />
      </RootLayout>
    );
    
    const currentYear = new Date().getFullYear();
    expect(getByText(`© ${currentYear} Delivering. All rights reserved.`)).toBeInTheDocument();
  });
});
