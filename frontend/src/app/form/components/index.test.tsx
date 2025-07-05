import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmailForm from './index'
import { vi } from 'vitest'
import { ToastProvider } from '../../shared/components/providers/Toast'
import React from 'react'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const renderWithToast = (component: React.ReactElement) => {
  return render(<ToastProvider>{component}</ToastProvider>)
}

describe('EmailForm', () => {
  const mockOnEmailClassified = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockedAxios.post.mockResolvedValue({
      data: { type: 'recruitment', score: 0.9, explanation: 'test' },
    })
  })

  test('renders correctly and switches between file and text tabs', async () => {
    renderWithToast(<EmailForm onEmailClassified={mockOnEmailClassified} />)

    expect(screen.getByRole('tab', { name: /Arquivo/i })).toHaveAttribute('data-state', 'active')
    expect(screen.getByText(/selecionar arquivo/i)).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('tab', { name: /Texto/i }))
    expect(screen.getByRole('tab', { name: /Texto/i })).toHaveAttribute('data-state', 'active')
    expect(screen.getByPlaceholderText(/cole o conteúdo do email aqui.../i)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /Arquivo/i }))
    expect(screen.getByRole('tab', { name: /Arquivo/i })).toHaveAttribute('data-state', 'active')
    expect(screen.getByText(/selecionar arquivo/i)).toBeInTheDocument()
  })

  test('submits the form with text input and calls onEmailClassified', async () => {
    renderWithToast(<EmailForm onEmailClassified={mockOnEmailClassified} />)

    const user = userEvent.setup()

    await user.click(screen.getByRole('tab', { name: /Texto/i }))
    expect(screen.getByRole('tab', { name: /Texto/i })).toHaveAttribute('data-state', 'active')
    expect(screen.getByPlaceholderText(/cole o conteúdo do email aqui.../i)).toBeInTheDocument()

    const textarea = screen.getByPlaceholderText(/cole o conteúdo do email aqui.../i)
    await user.type(textarea, 'Test email content')

    const submitButton = screen.getByRole('button', {
      name: /classificar email/i,
    })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnEmailClassified).toHaveBeenCalledWith({
        type: 'recruitment',
        score: 0.9,
        explanation: 'test',
      })
    })
  })
})
