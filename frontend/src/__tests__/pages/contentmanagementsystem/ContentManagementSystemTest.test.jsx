import { render, screen, fireEvent } from '@testing-library/react';
import ContentManagementSystem from '../../../pages/contentmanagementsystem/ContentManagementSystem';
import { CompanyContext } from '../../../context/CompanyContext';
import { useAuth } from '../../../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock useAuth
vi.mock("../../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe('ContentManagementSystem Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('renders ContentManagementSystem component', () => {
    // Mock useAuth to provide a mock value
    useAuth.mockReturnValue({ auth: { isAuthenticated: false } });

    // Mock CompanyContext to provide mock values
    const mockCompanyContext = {
      main_color: "#000000",
      logo: "https://example.com/logo.png",
      name: "Test Company",
    };

    render(
      <Router>
        <CompanyContext.Provider value={mockCompanyContext}>
          <ContentManagementSystem />
        </CompanyContext.Provider>
      </Router>
    );

    // Check if the Sidebar
    expect(screen.queryAllByText(/Articles/i).length).toBeGreaterThan(0);

  });
});