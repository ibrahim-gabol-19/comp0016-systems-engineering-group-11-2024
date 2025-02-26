import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from "../../../pages/account/SignUp";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock axios
vi.mock("axios");

// Mock AuthContext
vi.mock("../../../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

// Mock import.meta.env
vi.stubEnv("VITE_API_URL", "http://localhost:8000/api");

describe("SignUp Component", () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    test("renders the sign-up form", () => {
        // Mock useAuth to provide a mock value
        useAuth.mockReturnValue({ auth: { isAuthenticated: false } });

        render(
            <Router>
                <SignUp />
            </Router>
        );

        // Check if the form elements are rendered
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    });

    test("displays validation errors for invalid password", async () => {
        useAuth.mockReturnValue({ auth: { isAuthenticated: false } });

        render(
            <Router>
                <SignUp />
            </Router>
        );

        // Simulate user input
        await userEvent.type(screen.getByLabelText(/username/i), "testuser");
        await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
        const passwordInput = screen.getByLabelText(/password/i);
        await userEvent.type(passwordInput, "weak");

        // Submit the form
        const submitButton = screen.getByRole("button", { name: /sign up/i });
        await userEvent.click(submitButton);

        // Check for validation errors
        await waitFor(() => {
            expect(
                screen.getByText(/password must be at least 8 characters long/i)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/password must contain at least one uppercase letter/i)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/password must contain at least one number/i)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/password must contain at least one special character/i)
            ).toBeInTheDocument();
        });
    });

    test("submits the form successfully with valid data", async () => {
        // Mock a successful API response
        axios.post.mockResolvedValueOnce({ data: {} });

        useAuth.mockReturnValue({ auth: { isAuthenticated: false } });

        render(
            <Router>
                <SignUp />
            </Router>
        );

        // Simulate user input
        await userEvent.type(screen.getByLabelText(/username/i), "testuser");
        await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "StrongPassword1!");

        // Submit the form
        const submitButton = screen.getByRole("button", { name: /sign up/i });
        await userEvent.click(submitButton);

        // Check if the API was called with the correct data
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `${import.meta.env.VITE_API_URL}/auth/signup/`, // Use the environment variable
                {
                    username: "testuser",
                    email: "test@example.com",
                    password: "StrongPassword1!",
                }
            );
        });
    });

    test("displays an error message when sign-up fails", async () => {
        // Mock a failed API response
        axios.post.mockRejectedValueOnce(new Error("Signup failed"));

        useAuth.mockReturnValue({ auth: { isAuthenticated: false } });

        render(
            <Router>
                <SignUp />
            </Router>
        );

        // Simulate user input
        await userEvent.type(screen.getByLabelText(/username/i), "testuser");
        await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "StrongPassword1!");

        // Submit the form
        const submitButton = screen.getByRole("button", { name: /sign up/i });
        await userEvent.click(submitButton);

        // Check for the error message
        await waitFor(() => {
            expect(
                screen.getByText(/signup failed. please try again/i)
            ).toBeInTheDocument();
        });
    });
});