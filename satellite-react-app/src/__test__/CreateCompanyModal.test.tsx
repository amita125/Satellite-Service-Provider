import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateCompanyModal from '../components/Modals/CreateCompanyModal';

describe('CreateCompanyModal', () => {

    beforeAll(() => {
        window.matchMedia = window.matchMedia || function() {
          return {
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
          };
        };
      });

      
  test('renders modal with form elements', () => {
    const visible = true;
    const close = jest.fn();

    render(<CreateCompanyModal visible={visible} close={close} />);

    // Check if the modal title is rendered
    const modalTitle = screen.getByText('Create a new company 😀');
    expect(modalTitle).toBeInTheDocument();

    // Check if form inputs are rendered
    const companyNameInput = screen.getByLabelText('Company Name');
    expect(companyNameInput).toBeInTheDocument();

    const companyAddressInput = screen.getByLabelText('Company Address');
    expect(companyAddressInput).toBeInTheDocument();

    // Check if submit button is rendered
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
  });

  test('calls close function when modal is closed', () => {
    const visible = true;
    const close = jest.fn();

    render(<CreateCompanyModal visible={visible} close={close} />);

    // Close the modal
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    // Check if close function is called
    expect(close).toHaveBeenCalledTimes(1);
  });

  // Add more tests as needed...
});
