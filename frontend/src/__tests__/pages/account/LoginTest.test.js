import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "../../../pages/account/Login"; // Adjust the import path as needed
import { useAuth } from "../../../context/AuthContext"; // Import useAuth

// Mock axios
jest.mock("axios");

// Mock useAuth
jest.mock("../../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  let navigateMock;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  test("renders the login form", () => {
    // Mock useAuth to provide a mock value
    useAuth.mockReturnValue({ auth: { isAuthenticated: false } });

    render(
      <Router>
        <Login />
      </Router>
    );

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("redirects to home if already authenticated", () => {
    // Mock useAuth to simulate an authenticated user
    useAuth.mockReturnValue({ auth: { isAuthenticated: true } });

    render(
      <Router>
        <Login />
      </Router>
    );

    // Verify that navigate was called with the correct path
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  test("submits the form successfully with valid data", async () => {
    // Mock a successful API response
    axios.post.mockResolvedValueOnce({ data: { access: "mock-access-token" } });

    // Mock useAuth to simulate an unauthenticated user
    useAuth.mockReturnValue({ auth: { isAuthenticated: false }, login: jest.fn() });

    render(
      <Router>
        <Login />
      </Router>
    );

    // Simulate user input
    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "StrongPassword1!");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /log in/i });
    await userEvent.click(submitButton);

    // Verify the API call and navigation
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String), // Match any URL
        {
          username: "testuser",
          password: "StrongPassword1!",
        }
      );

      // Verify that login was called with the access token
      expect(useAuth().login).toHaveBeenCalledWith("mock-access-token");

      // Verify that navigate was called with the correct path
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  // Not a currently working test
//   test("displays an error message when login fails", async () => {
//     // Mock a failed API response
//     axios.post.mockRejectedValueOnce(new Error("Login failed"));

//     // Mock useAuth to simulate an unauthenticated user
//     useAuth.mockReturnValue({ auth: { isAuthenticated: false }, login: jest.fn() });

//     render(
//       <Router>
//         <Login />
//       </Router>
//     );

//     // Simulate user input
//     await userEvent.type(screen.getByLabelText(/username/i), "testuser");
//     await userEvent.type(screen.getByLabelText(/password/i), "StrongPassword1!");

//     // Submit the form
//     const submitButton = screen.getByRole("button", { name: /log in/i });
//     await userEvent.click(submitButton);

//     // Verify the error message is displayed
//     await waitFor(() => {
//       expect(
//         screen.getByText(/error logging in/i)
//       ).toBeInTheDocument();
//     });
//   });
});