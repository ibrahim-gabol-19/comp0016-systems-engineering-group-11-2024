// ReportsPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

  test('does not render SidebarReport when no selectedIssue is provided', () => {
    renderReportsPage();

    expect(screen.queryByText(/Test Issue/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Test Description/i)).not.toBeInTheDocument();
  });
});
