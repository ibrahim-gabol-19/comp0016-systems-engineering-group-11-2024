import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import FeaturedEvents from '../../../components/events/FeaturedEvents';
import { useNavigate } from 'react-router-dom';

// Mock axios
vi.mock('axios');

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('FeaturedEvents', () => {
  const mockEvents = [
    {
      id: 1,
      title: 'Event 1',
      main_image: 'http://example.com/image1.jpg',
      eventType: 'scheduled',
      date: '2023-10-01',
      time: '10:00 AM',
      description: 'This is event 1',
    },
    {
      id: 2,
      title: 'Event 2',
      main_image: 'http://example.com/image2.jpg',
      eventType: 'open',
      openTimes: 'All day',
      description: 'This is event 2',
    },
  ];

  const mockNavigate = vi.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });


  it('renders featured events when data is fetched successfully', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    render(<FeaturedEvents />);
    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });

  it('navigates to event detail page when an event is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    render(<FeaturedEvents />);
    await waitFor(() => {
      const event1 = screen.getByText('Event 1');
      fireEvent.click(event1);
      expect(mockNavigate).toHaveBeenCalledWith('/events/1');
    });
  });


});