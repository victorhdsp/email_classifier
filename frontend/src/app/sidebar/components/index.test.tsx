import { render, screen } from '@testing-library/react'
import EmailSidebar from './index'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { EmailResult } from '@/app/shared/components/views/AppContent/types'

describe('EmailSidebar', () => {
  const mockSetSidebarOpen = vi.fn()

  const mockResults: EmailResult[] = [
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
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders sidebar toggle button and closes sidebar', async () => {
    render(
      <EmailSidebar
        sidebarOpen={true}
        setSidebarOpen={mockSetSidebarOpen}
        results={mockResults}
        onRemoveResult={vi.fn()}
      />,
    )

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i })
    expect(toggleButton).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(toggleButton)
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false)
  })

  test('renders sidebar toggle button and opens sidebar', async () => {
    render(
      <EmailSidebar
        sidebarOpen={false}
        setSidebarOpen={mockSetSidebarOpen}
        results={mockResults}
        onRemoveResult={vi.fn()}
      />,
    )

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i })
    expect(toggleButton).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(toggleButton)
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(true)
  })

  test('renders results and expands them correctly', async () => {
    render(
      <EmailSidebar
        sidebarOpen={true}
        setSidebarOpen={mockSetSidebarOpen}
        results={mockResults}
        onRemoveResult={vi.fn()}
      />,
    )
    const user = userEvent.setup()

    // Check if results are rendered and the first one is expanded by default
    expect(screen.getByText('Test Subject 1')).toBeInTheDocument()
    expect(screen.getByText('Test text 1')).toBeInTheDocument()
    expect(screen.getByText('Test Subject 2')).toBeInTheDocument()
    expect(screen.queryByText('Test text 2')).not.toBeInTheDocument()

    // Click the first result to collapse it
    await user.click(screen.getByText(/Test Subject 1/i))
    expect(screen.queryByText('Test text 1')).not.toBeInTheDocument()

    // Click the second result to expand it
    await user.click(screen.getByText(/Test Subject 2/i))
    expect(screen.getByText('Test text 2')).toBeInTheDocument()
  })
})
