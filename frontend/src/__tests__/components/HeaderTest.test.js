import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CompanyContext } from "../../context/CompanyContext";
import Header from "../../components/Header";

// Mock the useAuth hook and CompanyContext
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// jest.mock("../../context/CompanyContext", () => ({
//   CompanyContext: React.createContext(),
// }));

describe("Header Component", () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("renders Header with company logo and name", () => {
    // Mock context values
    useAuth.mockReturnValue({
      auth: { isAuthenticated: true, user: { is_superuser: false } },
      logout: mockLogout,
    });

    const companyContextValue = {
      main_color: "blue",
      logo: "test-logo.png",
      name: "Test Company",
    };

    render(
      <Router>
        <CompanyContext.Provider value={companyContextValue}>
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Check if logo, company name, and nav links are present
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Reporting")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  test("renders 'Manage' link when user is superuser", () => {
    // Mock context values for a superuser
    useAuth.mockReturnValue({
      auth: { isAuthenticated: true, user: { is_superuser: true } },
      logout: mockLogout,
    });

    const companyContextValue = {
      main_color: "blue",
      logo: "test-logo.png",
      name: "Test Company",
    };

    render(
      <Router>
        <CompanyContext.Provider value={companyContextValue}>
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Check if 'Manage' link is rendered for superuser
    expect(screen.getByText("Manage")).toBeInTheDocument();
  });

  test("does not render 'Manage' link when user is not superuser", () => {
    // Mock context values for a non-superuser
    useAuth.mockReturnValue({
      auth: { isAuthenticated: true, user: { is_superuser: false } },
      logout: mockLogout,
    });

    const companyContextValue = {
      main_color: "blue",
      logo: "test-logo.png",
      name: "Test Company",
    };

    render(
      <Router>
        <CompanyContext.Provider value={companyContextValue}>
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Ensure 'Manage' link is not rendered for non-superuser
    expect(screen.queryByText("Manage")).not.toBeInTheDocument();
  });

  test("handles logout", async () => {
    // Mock context values for an authenticated user
    useAuth.mockReturnValue({
      auth: { isAuthenticated: true },
      logout: mockLogout,
    });

    const companyContextValue = {
      main_color: "blue",
      logo: "test-logo.png",
      name: "Test Company",
    };

    render(
      <Router>
        <CompanyContext.Provider value={companyContextValue}>
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Find the logout button
    const logoutButton = screen.getByRole("button", { name: /logout/i });

    // Simulate click on logout button
    fireEvent.click(logoutButton);

    // Check if logout was called and the navigation occurred
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("renders correct hover effects for navigation links", () => {
    // Mock context values
    useAuth.mockReturnValue({
      auth: { isAuthenticated: true, user: { is_superuser: false } },
      logout: mockLogout,
    });

    const companyContextValue = {
      main_color: "blue",
      logo: "test-logo.png",
      name: "Test Company",
    };

    render(
      <Router>
        <CompanyContext.Provider value={companyContextValue}>
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Simulate mouse enter on "Home" link and check color change
    const homeLink = screen.getByText("Home");
    fireEvent.mouseEnter(homeLink);
    expect(homeLink).toHaveStyle("color: blue"); // Hover color

    // Simulate mouse leave on "Home" link and check color reset
    fireEvent.mouseLeave(homeLink);
    expect(homeLink).toHaveStyle("color: black"); // Default color
  });
});
