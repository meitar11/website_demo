import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../src/pages/Contact';
import { sendContactMessage } from '../src/api/client';
import toast from 'react-hot-toast';

vi.mock('../src/api/client', () => ({
  sendContactMessage: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe('Contact form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation errors for an empty submission', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(
      await screen.findByText(/please enter your name/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it('submits valid data and shows a success toast', async () => {
    sendContactMessage.mockResolvedValue({ message: 'Thanks!', id: 'abc' });
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/name/i), 'Grace Hopper');
    await user.type(screen.getByLabelText(/email/i), 'grace@example.com');
    await user.type(
      screen.getByLabelText(/message/i),
      'This is a wonderful demo storefront.'
    );
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await vi.waitFor(() => {
      expect(sendContactMessage).toHaveBeenCalledWith({
        name: 'Grace Hopper',
        email: 'grace@example.com',
        message: 'This is a wonderful demo storefront.',
      });
    });
    expect(toast.success).toHaveBeenCalledWith('Thanks!');
  });
});
