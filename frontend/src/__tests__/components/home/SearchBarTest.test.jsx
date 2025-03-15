import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../../../components/home/SearchBar";
import { CompanyContext } from "../../../context/CompanyContext";
import { AIContext } from "../../../context/AIContext";
import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock axios
vi.mock("axios");

// Mock useNavigate and preserve BrowserRouter
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

// Mock CompanyContext and AIContext
vi.mock("../../../context/CompanyContext", () => ({
    CompanyContext: React.createContext(),
}));

vi.mock("../../../context/AIContext", () => ({
    AIContext: React.createContext(),
}));

describe("SearchBar Component", () => {
    let navigateMock;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
        navigateMock = vi.fn();
        useNavigate.mockReturnValue(navigateMock);

        // Mock CompanyContext and AIContext values
        const mockCompanyContext = {
            name: "Test Company",
            sw_lat: "0",
            sw_lon: "0",
            ne_lat: "0",
            ne_lon: "0",
        };

        const mockAIContext = {
            getReply: vi.fn(),
            engine: "test-engine",
        };

        render(
            <Router>
                <CompanyContext.Provider value={mockCompanyContext}>
                    <AIContext.Provider value={mockAIContext}>
                        <SearchBar />
                    </AIContext.Provider>
                </CompanyContext.Provider>
            </Router>
        );
    });

    test("renders the search bar", () => {
        expect(screen.getByPlaceholderText(/when is the next volunteering event/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /ask ai/i })).toBeInTheDocument();
    });

    test("handles user input and form submission", async () => {
        const user = userEvent.setup();
    
        // Simulate user input
        const input = screen.getByPlaceholderText(/when is the next volunteering event/i);
        await user.type(input, "test query");
    
        // Simulate form submission by pressing Enter
        await user.keyboard("{enter}");
    
        // Verify that the input is cleared after submission
        await waitFor(() => {
            expect(input.value).toBe("");
        });
    });

});