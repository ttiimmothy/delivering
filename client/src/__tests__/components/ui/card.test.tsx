import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../setup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

describe('Card Components', () => {
  it('renders card with content', () => {
    const { getByText } = renderWithProviders(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    );
    
    expect(getByText('Card content')).toBeInTheDocument();
  });

  it('renders card with header', () => {
    const { getByText } = renderWithProviders(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
      </Card>
    );
    
    expect(getByText('Card Title')).toBeInTheDocument();
    expect(getByText('Card description')).toBeInTheDocument();
  });

  it('applies correct classes to card', () => {
    const { getByRole } = renderWithProviders(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );
    
    const card = getByRole('generic');
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
  });

  it('applies correct classes to card content', () => {
    const { getByText } = renderWithProviders(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );
    
    const content = getByText('Content');
    expect(content).toHaveClass('p-6', 'pt-0');
  });

  it('applies correct classes to card header', () => {
    const { getByText } = renderWithProviders(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );
    
    const header = getByText('Title').parentElement;
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
  });
});
