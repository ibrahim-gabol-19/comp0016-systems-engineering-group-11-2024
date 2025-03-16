import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectTopBar from '../../../components/contentmanagementsystem/SelectTopBar';

describe('SelectTopBar', () => {
  const selectedCards = [1, 2, 3]; // Example selected cards
  const onDelete = vi.fn();
  const onStar = vi.fn();
  const onSelectAll = vi.fn();
  const onCancel = vi.fn();

  it('renders the component with the correct number of selected cards', () => {
    render(
      <SelectTopBar
        selectedCards={selectedCards}
        onDelete={onDelete}
        onStar={onStar}
        onSelectAll={onSelectAll}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText(`${selectedCards.length} card(s) selected`)).toBeInTheDocument();
  });
  // Add more tests as needed for other functionality
});