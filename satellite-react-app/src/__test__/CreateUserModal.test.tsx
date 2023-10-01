import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateUserModal from '../components/Modals/CreateUserModal';

describe('CreateUserModal', () => {

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

    render(<CreateUserModal visible={visible} close={close} />);

    // Check if the modal title is rendered
    const modalTitle = screen.getByText('Create a new satellite teleport service provider 😀');
    expect(modalTitle).toBeInTheDocument();

    // Check if form inputs are rendered
    const usernameInput = screen.getByLabelText('Username');
    expect(usernameInput).toBeInTheDocument();

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toBeInTheDocument();

    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    expect(confirmPasswordInput).toBeInTheDocument();

    const userRoleSelect = screen.getByLabelText('User Role');
    expect(userRoleSelect).toBeInTheDocument();

    const emailInput = screen.getByLabelText('E-mail');
    expect(emailInput).toBeInTheDocument();

    // Check if the submit button is rendered
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
  });

  test('calls close function when modal is closed', () => {
    const visible = true;
    const close = jest.fn();

    render(<CreateUserModal visible={visible} close={close} />);

    // Close the modal
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    // Check if close function is called
    expect(close).toHaveBeenCalledTimes(1);
  });

  // Add more tests as needed...
});
