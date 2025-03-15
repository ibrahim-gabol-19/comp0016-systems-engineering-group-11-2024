import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MapFilter from '../../../components/home/MapFilter';

describe('MapFilter', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnDateChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
    mockOnDateChange.mockClear();
  });

  it('renders with default values', () => {
    render(<MapFilter onFilterChange={mockOnFilterChange} onDateChange={mockOnDateChange} />);

    // Check default checkbox states
    expect(screen.getByRole('checkbox', { name: /events/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /issues/i })).toBeChecked();

    // Check default date values
    const today = new Date().toISOString().split('T')[0];
    expect(screen.getByLabelText(/from:/i)).toHaveValue(today);
    expect(screen.getByLabelText(/to:/i)).toHaveValue('');
  });

  it('calls onFilterChange when checkboxes are toggled', () => {
    render(<MapFilter onFilterChange={mockOnFilterChange} onDateChange={mockOnDateChange} />);

    // Toggle "Events" checkbox
    const eventsCheckbox = screen.getByRole('checkbox', { name: /events/i });
    fireEvent.click(eventsCheckbox);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ events: false, issues: true });

    // Toggle "Issues" checkbox
    const issuesCheckbox = screen.getByRole('checkbox', { name: /issues/i });
    fireEvent.click(issuesCheckbox);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ events: false, issues: false });
  });

  it('calls onDateChange when date inputs are changed', () => {
    render(<MapFilter onFilterChange={mockOnFilterChange} onDateChange={mockOnDateChange} />);

    // Change "From" date
    const fromDateInput = screen.getByLabelText(/from:/i);
    fireEvent.change(fromDateInput, { target: { value: '2023-10-01' } });
    expect(mockOnDateChange).toHaveBeenCalledWith({ from: '2023-10-01', to: '' });

    // Change "To" date
    const toDateInput = screen.getByLabelText(/to:/i);
    fireEvent.change(toDateInput, { target: { value: '2023-10-10' } });
    expect(mockOnDateChange).toHaveBeenCalledWith({ from: '2023-10-01', to: '2023-10-10' });
  });

  it('updates the state when date inputs are changed', () => {
    render(<MapFilter onFilterChange={mockOnFilterChange} onDateChange={mockOnDateChange} />);

    // Change "From" date
    const fromDateInput = screen.getByLabelText(/from:/i);
    fireEvent.change(fromDateInput, { target: { value: '2023-10-01' } });
    expect(fromDateInput).toHaveValue('2023-10-01');

    // Change "To" date
    const toDateInput = screen.getByLabelText(/to:/i);
    fireEvent.change(toDateInput, { target: { value: '2023-10-10' } });
    expect(toDateInput).toHaveValue('2023-10-10');
  });
});