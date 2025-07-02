import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailForm from './index';
import { vi } from 'vitest';

describe('EmailForm', () => {
  const mockOnEmailClassified = vi.fn();
  const mockSetIsProcessing = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders correctly and switches between file and text tabs', async () => {
    render(
      <EmailForm
        onEmailClassified={mockOnEmailClassified}
        setIsProcessing={mockSetIsProcessing}
        isProcessing={false}
      />
    );

    expect(screen.getByRole('tab', { name: /Arquivo/i })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText(/selecionar arquivo/i)).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Texto/i }));
    expect(screen.getByRole('tab', { name: /Texto/i })).toHaveAttribute('data-state', 'active');
    expect(screen.getByPlaceholderText(/cole o conteúdo do email aqui.../i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Arquivo/i }));
    expect(screen.getByRole('tab', { name: /Arquivo/i })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText(/selecionar arquivo/i)).toBeInTheDocument();
  });

  test('submits the form with text input and calls onEmailClassified', async () => {
    render(
      <EmailForm
        onEmailClassified={mockOnEmailClassified}
        setIsProcessing={mockSetIsProcessing}
        isProcessing={false}
      />
    );

    const user = userEvent.setup();
    
    await user.click(screen.getByRole('tab', { name: /Texto/i }));
    expect(screen.getByRole('tab', { name: /Texto/i })).toHaveAttribute('data-state', 'active');
    expect(screen.getByPlaceholderText(/cole o conteúdo do email aqui.../i)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/cole o conteúdo do email aqui.../i);
    fireEvent.change(textarea, { target: { value: 'Test email content' } });

    const submitButton = screen.getByRole('button', { name: /classificar email/i });
    await user.click(submitButton);
    
    expect(mockSetIsProcessing).toHaveBeenCalledWith(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    await waitFor(() => {
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
    });
  });
});