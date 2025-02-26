import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { CompanyContext } from "../../context/CompanyContext";
// Mock useAuth
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock useNavigate and preserve BrowserRouter
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Header Component", () => {
  let navigateMock;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    navigateMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  test("renders the header with company name and logo", () => {
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
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Check if the company name and logo are rendered
    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByAltText("Logo")).toHaveAttribute("src", "https://example.com/logo.png");
  });

  test("renders navigation links", () => {
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
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Check if the navigation links are rendered
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Reporting")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  test("renders 'Manage' link for superuser", () => {
    // Mock useAuth to provide a mock value for superuser
    useAuth.mockReturnValue({ auth: { isAuthenticated: true, user: { is_superuser: true } } });

    // Mock CompanyContext to provide mock values
    const mockCompanyContext = {
      main_color: "#000000",
      logo: "https://example.com/logo.png",
      name: "Test Company",
    };

    render(
      <Router>
        <CompanyContext.Provider value={mockCompanyContext}>
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Check if the 'Manage' link is rendered for superuser
    expect(screen.getByText("Manage")).toBeInTheDocument();
  });

  test("logs out the user and redirects to login page", async () => {
    // Mock useAuth to provide a mock value for authenticated user
    const logoutMock = vi.fn();
    useAuth.mockReturnValue({ auth: { isAuthenticated: true }, logout: logoutMock });

    // Mock CompanyContext to provide mock values
    const mockCompanyContext = {
      main_color: "#000000",
      logo: "https://example.com/logo.png",
      name: "Test Company",
    };

    render(
      <Router>
        <CompanyContext.Provider value={mockCompanyContext}>
          <Header />
        </CompanyContext.Provider>
      </Router>
    );

    // Simulate user clicking the logout button
    const logoutButton = screen.getByText("Logout");
    await userEvent.click(logoutButton);

    // Verify that logout was called and navigate was called with the correct path
    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });
});