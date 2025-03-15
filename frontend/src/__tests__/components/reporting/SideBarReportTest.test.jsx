import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SidebarReport from '../../../components/reporting/SidebarReport';
import { CompanyContext } from '../../../context/CompanyContext';
import { AIContext } from '../../../context/AIContext';
import { useAuth } from '../../../context/AuthContext';

// Mock the contexts and hooks
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../context/CompanyContext', () => ({
  CompanyContext: {
    Provider: ({ children, value }) => children,
  },
}));

vi.mock('../../context/AIContext', () => ({
  AIContext: {
    Provider: ({ children, value }) => children,
  },
}));

vi.mock('axios');

const mockCompanyContext = {
  name: 'Test Company',
  main_color: '#000000',
};

const mockAIContext = {
  getReply: vi.fn(),
  engine: 'gpt-3.5-turbo',
};

const mockAuth = {
  user: {
    username: 'testuser',
  },
};

const mockSelectedMarker = {
  id: 1,
  title: 'Test Report',
  status: 'open',
  tags: 'environmental',
  author: 'testuser',
  published_date: '2023-10-01',
  description: 'This is a test report description.',
  upvotes: 10,
  latitude: 40.7128,
  longitude: -74.006,
  discussions: [
    {
      author: 'testuser',
      message: 'This is a test discussion message.',
      created_at: '2023-10-01T12:00:00Z',
    },
  ],
  main_image: 'https://example.com/image.jpg',
};

describe('SidebarReport', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ auth: mockAuth });
  });

  it('renders the new report form when newMarker is provided', () => {
    render(
      <CompanyContext.Provider value={mockCompanyContext}>
        <AIContext.Provider value={mockAIContext}>
          <SidebarReport newMarker={{ latlng: { lat: 40.7128, lng: -74.006 }}} />
        </AIContext.Provider>
      </CompanyContext.Provider>
    );

    expect(screen.getByText('New Report')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders the report details when selectedMarker is provided', () => {
    render(
      <CompanyContext.Provider value={mockCompanyContext}>
        <AIContext.Provider value={mockAIContext}>
          <SidebarReport selectedMarker={mockSelectedMarker} />
        </AIContext.Provider>
      </CompanyContext.Provider>
    );

    expect(screen.getByText('Test Report')).toBeInTheDocument();
    expect(screen.getByText('This is a test report description.')).toBeInTheDocument();
    expect(screen.getByText('10 Upvotes')).toBeInTheDocument();
    expect(screen.getByText('Discussion')).toBeInTheDocument();
  });

  it('handles upvote click', async () => {
    const fetchReports = vi.fn();
    render(
      <CompanyContext.Provider value={mockCompanyContext}>
        <AIContext.Provider value={mockAIContext}>
          <SidebarReport selectedMarker={mockSelectedMarker} fetchReports={fetchReports} />
        </AIContext.Provider>
      </CompanyContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /upvote/i }));
    await waitFor(() => expect(fetchReports).toHaveBeenCalled());
  });

  it('handles AI summary click', async () => {
    const setViewingAISummary = vi.fn();
    const setModelReply = vi.fn();
    const setIsStreaming = vi.fn();

    render(
      <CompanyContext.Provider value={mockCompanyContext}>
        <AIContext.Provider value={mockAIContext}>
          <SidebarReport
            selectedMarker={mockSelectedMarker}
            setViewingAISummary={setViewingAISummary}
            setModelReply={setModelReply}
            setIsStreaming={setIsStreaming}
          />
        </AIContext.Provider>
      </CompanyContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /ai logo/i }));
    await waitFor(() => expect(mockAIContext.getReply).toHaveBeenCalled());
  });

  it('handles discussion message submission', async () => {
    const fetchReports = vi.fn();
    render(
      <CompanyContext.Provider value={mockCompanyContext}>
        <AIContext.Provider value={mockAIContext}>
          <SidebarReport selectedMarker={mockSelectedMarker} fetchReports={fetchReports} />
        </AIContext.Provider>
      </CompanyContext.Provider>
    );

    fireEvent.click(screen.getByText('Discussion'));
    fireEvent.change(screen.getByPlaceholderText('Type your message here...'), {
      target: { value: 'New discussion message' },
    });
    fireEvent.click(screen.getByText('Submit Message'));
    await waitFor(() => expect(fetchReports).toHaveBeenCalled());
  });
});