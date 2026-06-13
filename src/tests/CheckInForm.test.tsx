/**
 * CheckInForm.test.tsx
 * 
 * DOM tests for the CheckInForm component.
 * Verifies semantic HTML structures, presence of visible labels,
 * validation error triggers, and valid form submissions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckInForm } from '../components/CheckInForm';

describe('CheckInForm Component', () => {

  it('renders form headings and input components', () => {
    const mockSubmit = vi.fn();
    render(<CheckInForm onCheckInSubmit={mockSubmit} />);

    // Check header
    expect(screen.getByRole('heading', { name: /Daily Mood & Study Log/i })).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByRole('button', { name: /Analyze & Generate Insights/i })).toBeInTheDocument();
  });

  it('contains visible labels associated with form fields', () => {
    const mockSubmit = vi.fn();
    render(<CheckInForm onCheckInSubmit={mockSubmit} />);

    // Check label matching inputs
    expect(screen.getByLabelText(/Target Exam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Exam Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sleep Duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Study Duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Daily Journal & Reflections/i)).toBeInTheDocument();
  });

  it('displays validation warnings on invalid empty submit', () => {
    const mockSubmit = vi.fn();
    render(<CheckInForm onCheckInSubmit={mockSubmit} />);

    // Click submit immediately. Since the journal is empty, it should fail.
    const submitBtn = screen.getByRole('button', { name: /Analyze & Generate Insights/i });
    fireEvent.click(submitBtn);

    // Expect validation message on journal
    expect(screen.getByText(/Journal entry cannot be empty/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('triggers onCheckInSubmit handler when payload is valid', () => {
    const mockSubmit = vi.fn();
    render(<CheckInForm onCheckInSubmit={mockSubmit} />);

    // Populate journal field
    const journalInput = screen.getByLabelText(/Daily Journal & Reflections/i);
    fireEvent.change(journalInput, { target: { value: 'Today was quite stressful because of a chemistry backlog, but I managed 8 hours of preparation.' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Analyze & Generate Insights/i });
    fireEvent.click(submitBtn);

    // Verify submission callback matches
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      examType: 'NEET', // Default
      mood: 5,
      stress: 5,
      sleepHours: 7,
      studyHours: 8,
      journalText: 'Today was quite stressful because of a chemistry backlog, but I managed 8 hours of preparation.'
    }));

    // Success toast check
    expect(screen.getByText(/Check-in submitted successfully/i)).toBeInTheDocument();
  });

});
