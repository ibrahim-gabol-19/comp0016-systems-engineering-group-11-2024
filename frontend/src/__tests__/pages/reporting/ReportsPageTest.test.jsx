// ReportsPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import ReportsPage from '../../../pages/reporting/ReportsPage';
import {AuthProvider} from "../../../context/AuthContext"
import { CompanyProvider } from '../../../context/CompanyContext';
import { AIProvider } from '../../../context/AIContext';
describe('ReportsPage', () => {
  const renderReportsPage = (state = {}) => {
    return render(
      <MemoryRouter initialEntries={['/reporting']}>
        <AuthProvider>
          <CompanyProvider>
            <AIProvider>
              <ReportsPage location={{ state }} />
            </AIProvider>
          </CompanyProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  };

//   test('renders SidebarReport component when selectedIssue is provided', () => {
//     const selectedIssue = { id: 1, title: 'Test Issue', description: 'Test Description' };
//     renderReportsPage({ selectedIssue });

//     expect(screen.getByText(/Test Issue/i)).toBeInTheDocument();
//     expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
//   });

//   test('renders MapComponent', () => {
//     renderReportsPage();

//     expect(screen.getByRole('button', { name: /unresolved/i })).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /resolved/i })).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /closed/i })).toBeInTheDocument();
//   });

//   test('renders AI Summary section when viewingAISummary is true', () => {
//     const selectedIssue = { id: 1, title: 'Test Issue', description: 'Test Description' };
//     renderReportsPage({ selectedIssue });

//     // Simulate setting viewingAISummary to true
//     const aiSummary = screen.getByText(/Test Description/i);
//     expect(aiSummary).toBeInTheDocument();
//   });

  test('does not render SidebarReport when no selectedIssue is provided', () => {
    renderReportsPage();

    expect(screen.queryByText(/Test Issue/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Test Description/i)).not.toBeInTheDocument();
  });
});
