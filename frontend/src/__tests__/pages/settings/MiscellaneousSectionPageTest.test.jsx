import { render, screen } from '@testing-library/react';
import MiscellaneousSection from '../../../pages/settings/MiscellaneousSectionPage';
import { CompanyContext } from '../../../context/CompanyContext';
import { useAuth } from '../../../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock useAuth
vi.mock("../../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock leaflet components
vi.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div>{children}</div>,
    TileLayer: () => <div>TileLayer</div>,
    Marker: () => <div>Marker</div>,
    Popup: () => <div>Popup</div>,
    Circle: () => <div>Circle</div>, // Add this line to mock the Circle component
  }));
  
describe('MiscellaneousSection Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('renders MiscellaneousSection component', () => {
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
          <MiscellaneousSection />
        </CompanyContext.Provider>
      </Router>
    );

    // Check if the heading is rendered
    expect(screen.getByText(/Company Information/i)).toBeInTheDocument();

       // Check if the name input is rendered
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();

    // Check if the about textarea is rendered
    expect(screen.getByPlaceholderText(/About/i)).toBeInTheDocument();

  
      // Check if the map boundaries section is rendered
    expect(screen.getByText(/Map Boundaries/i)).toBeInTheDocument();
  });
});