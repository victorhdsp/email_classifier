import { render, screen, fireEvent } from '@testing-library/react';
import EmailSidebar from './index';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('EmailSidebar', () => {
  const mockSetSidebarOpen = vi.fn();
  const mockSetExpandedResult = vi.fn();

  const mockResults = [
    {
      id: '1',
      subject: 'Test Subject 1',
      type: 'Produtivo',
      text: 'Test text 1',
      timestamp: '01/01/2023',
    },
    {
      id: '2',
      subject: 'Test Subject 2',
      type: 'Improdutivo',
      text: 'Test text 2',
      timestamp: '02/01/2023',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders sidebar toggle button and closes sidebar', async () => {
    render(
      <EmailSidebar
        sidebarOpen={true}
        setSidebarOpen={mockSetSidebarOpen}
        results={mockResults}
        expandedResult={null}
        setExpandedResult={mockSetExpandedResult}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(toggleButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(toggleButton);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
  });

  test('renders sidebar toggle button and opens sidebar', async () => {
    render(
      <EmailSidebar
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        results={mockResults}
        expandedResult={null}
        setExpandedResult={mockSetExpandedResult}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(toggleButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(toggleButton);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(true);
  });

  test('renders results and expands them', () => {
    render(
      <EmailSidebar
        sidebarOpen={true}
        setSidebarOpen={mockSetSidebarOpen}
        results={mockResults}
        expandedResult={null}
        setExpandedResult={mockSetExpandedResult}
      />
    );

    // Check if results are rendered
    expect(screen.getByText('Test Subject 1')).toBeInTheDocument();
    expect(screen.getByText('Test Subject 2')).toBeInTheDocument();

    // Expand first result
    fireEvent.click(screen.getAllByText('Test Subject 1')[0]);
    expect(mockSetExpandedResult).toHaveBeenCalledWith('1');
  });
});
