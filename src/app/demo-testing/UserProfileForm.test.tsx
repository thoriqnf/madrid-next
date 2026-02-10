import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserProfileForm from './UserProfileForm';
import '@testing-library/jest-dom';

describe('UserProfileForm - Event Testing Tutorial', () => {
  
  /**
   * LEVEL 1: Recap - Basic JSX Rendering
   * Before we test what the app DOES, we must test what it SHOWS.
   */
  describe('Level 1: Does it render?', () => {
    test('renders the main form header', () => {
      render(<UserProfileForm />);
      const header = screen.getByText(/user profile/i);
      expect(header).toBeInTheDocument();
    });

    test('renders all required input labels', () => {
      render(<UserProfileForm />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preferred role/i)).toBeInTheDocument();
      expect(screen.getByText(/experience level/i)).toBeInTheDocument();
    });

    test('renders the newsletter checkbox as unchecked initially', () => {
      render(<UserProfileForm />);
      const checkbox = screen.getByRole('checkbox', { name: /newsletter/i });
      expect(checkbox).not.toBeChecked();
    });
  });

  /**
   * LEVEL 2: Basic Events - The "fireEvent" Way
   * fireEvent is the most basic way to trigger events. 
   * It directly jumps to the final state.
   */
  describe('Level 2: Basic interaction (fireEvent)', () => {
    test('should change text input value immediately', () => {
      render(<UserProfileForm />);
      const nameInput = screen.getByLabelText(/full name/i);
      
      // We manually tell the input its new value
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      
      expect(nameInput).toHaveValue('John Doe');
    });
  });

  /**
   * LEVEL 3: Realistic Interactions - The "userEvent" Way
   * userEvent is BETTER because it simulates what a real human does
   * (clicking, typing, selecting from dropdowns).
   */
  describe('Level 3: Realistic interaction (userEvent)', () => {
    test('should type character by character', async () => {
      const user = userEvent.setup();
      render(<UserProfileForm />);
      const nameInput = screen.getByLabelText(/full name/i);
      
      await user.type(nameInput, 'Jane Doe');
      expect(nameInput).toHaveValue('Jane Doe');
    });

    test('should select an option from a dropdown', async () => {
      const user = userEvent.setup();
      render(<UserProfileForm />);
      const roleSelect = screen.getByLabelText(/preferred role/i);
      
      await user.selectOptions(roleSelect, 'developer');
      expect(roleSelect).toHaveValue('developer');
    });

    test('should click a radio button', async () => {
      const user = userEvent.setup();
      render(<UserProfileForm />);
      const midRadio = screen.getByLabelText(/mid/i);
      
      await user.click(midRadio);
      expect(midRadio).toBeChecked();
    });

    test('should toggle a checkbox', async () => {
      const user = userEvent.setup();
      render(<UserProfileForm />);
      const newsletter = screen.getByRole('checkbox', { name: /newsletter/i });
      
      await user.click(newsletter);
      expect(newsletter).toBeChecked();
    });
  });

  /**
   * LEVEL 4: Complex Scenarios - Logic & Validation
   * Now we combine multiple events to test the "brain" of our component.
   */
  describe('Level 4: Advanced Scenarios', () => {
    test('submit button starts as disabled and only enables when form is valid', async () => {
      const user = userEvent.setup();
      render(<UserProfileForm />);
      const submitBtn = screen.getByRole('button', { name: /fields|registration/i });
      
      expect(submitBtn).toBeDisabled();

      // Fill Name -> still disabled
      await user.type(screen.getByLabelText(/full name/i), 'Alice');
      expect(submitBtn).toBeDisabled();

      // Select Role -> still disabled
      await user.selectOptions(screen.getByLabelText(/preferred role/i), 'designer');
      expect(submitBtn).toBeDisabled();

      // Choose Experience -> FINALLY ENABLED!
      await user.click(screen.getByLabelText(/senior/i));
      expect(submitBtn).toBeEnabled();
    });

    test('full flow: fill form, submit, and see success message', async () => {
      const user = userEvent.setup();
      render(<UserProfileForm />);
      
      // Rapid fire interactions!
      await user.type(screen.getByLabelText(/full name/i), 'Mario');
      await user.selectOptions(screen.getByLabelText(/preferred role/i), 'manager');
      await user.click(screen.getByLabelText(/junior/i));
      
      await user.click(screen.getByRole('button', { name: /registration/i }));
      
      // Success check
      const successMsg = await screen.findByTestId('success-message');
      expect(successMsg).toBeInTheDocument();
      expect(successMsg).toHaveTextContent(/mario/i);
    });
  });
});
