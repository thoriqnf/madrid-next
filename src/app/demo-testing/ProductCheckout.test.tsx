import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCheckout from './ProductCheckout';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, animate, initial, exit, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ProductCheckout Component', () => {
  const setup = () => {
    const user = userEvent.setup();
    render(<ProductCheckout />);
    return { user };
  };

  it('renders available products with correct details', () => {
    setup();
    expect(screen.getByText('Available Gear')).toBeInTheDocument();
    expect(screen.getByText('Neon Cyber Deck')).toBeInTheDocument();
    expect(screen.getByText('Holographic Visor')).toBeInTheDocument();
    expect(screen.getByText('Quantum Chipset')).toBeInTheDocument();
    
    expect(screen.getByText('$129.00')).toBeInTheDocument();
    expect(screen.getByText('$59.50')).toBeInTheDocument();
    expect(screen.getByText('$299.99')).toBeInTheDocument();
  });

  it('shows empty cart state initially', () => {
    setup();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.queryByText('Proceed to Checkout')).not.toBeInTheDocument();
  });

  it('adds items to the cart and updates the total price', async () => {
    const { user } = setup();
    
    const addButtons = screen.getAllByLabelText(/Add .* to cart/i);
    
    // Add Neon Cyber Deck
    await user.click(addButtons[0]);
    expect(screen.getByText('Neon Cyber Deck', { selector: 'h4' })).toBeInTheDocument();
    expect(screen.getByText('$129.00 x 1')).toBeInTheDocument();
    expect(screen.getByText('$129.00', { selector: 'span.text-2xl' })).toBeInTheDocument();

    // Add another Neon Cyber Deck (Test increment logic)
    await user.click(addButtons[0]);
    expect(screen.getByText('$129.00 x 2')).toBeInTheDocument();
    expect(screen.getByText('$258.00', { selector: 'span.text-2xl' })).toBeInTheDocument();

    // Add Holographic Visor (Test multi-item total)
    await user.click(addButtons[1]);
    expect(screen.getByText('Holographic Visor', { selector: 'h4' })).toBeInTheDocument();
    // 258 + 59.50 = 317.50
    expect(screen.getByText('$317.50', { selector: 'span.text-2xl' })).toBeInTheDocument();
  });

  it('removes items from the cart', async () => {
    const { user } = setup();
    
    const addButtons = screen.getAllByLabelText(/Add .* to cart/i);
    await user.click(addButtons[0]); // Add Neon Cyber Deck
    await user.click(addButtons[1]); // Add Holographic Visor
    
    const removeButtons = screen.getAllByLabelText(/Remove .* from cart/i);
    
    // Remove Neon Cyber Deck
    await user.click(removeButtons[0]);
    expect(screen.queryByText('Neon Cyber Deck', { selector: 'h4' })).not.toBeInTheDocument();
    expect(screen.getByText('Holographic Visor', { selector: 'h4' })).toBeInTheDocument();
    expect(screen.getByText('$59.50', { selector: 'span.text-2xl' })).toBeInTheDocument();

    // Remove remaining item
    const lastRemoveBtn = screen.getByLabelText(/Remove Holographic Visor from cart/i);
    await user.click(lastRemoveBtn);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('navigates between cart and checkout form', async () => {
    const { user } = setup();
    
    // Add item to enable checkout
    await user.click(screen.getAllByLabelText(/Add .* to cart/i)[0]);
    
    // Go to checkout
    await user.click(screen.getByText('Proceed to Checkout'));
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    
    // Go back to cart
    await user.click(screen.getByText('Back'));
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Full Name/i)).not.toBeInTheDocument();
  });

  it('validates required fields in checkout form', async () => {
    const { user } = setup();
    
    await user.click(screen.getAllByLabelText(/Add .* to cart/i)[0]);
    await user.click(screen.getByText('Proceed to Checkout'));
    
    // Submit empty form
    await user.click(screen.getByText('Complete Order'));
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Address is required')).toBeInTheDocument();
  });

  it.skip('validates email format and shows error for invalid email', async () => {
    const { user } = setup();
    
    await user.click(screen.getAllByLabelText(/Add .* to cart/i)[0]);
    await user.click(screen.getByText('Proceed to Checkout'));
    
    // Fill fields with invalid email (no @ symbol)
    await user.type(screen.getByLabelText(/Full Name/i), 'Cyber Ronin');
    await user.type(screen.getByLabelText(/Email Address/i), 'notemail');
    await user.type(screen.getByLabelText(/Shipping Address/i), 'Sector 7');
    
    // Submit form
    await user.click(screen.getByText('Complete Order'));
    
    // Should show email validation error
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
  });


  it('processes checkout successfully and allows returning to shop', async () => {
    const { user } = setup();
    
    // Add item
    await user.click(screen.getAllByLabelText(/Add .* to cart/i)[0]);
    await user.click(screen.getByText('Proceed to Checkout'));
    
    // Fill form
    await user.type(screen.getByLabelText(/Full Name/i), 'Cyber Ronin');
    await user.type(screen.getByLabelText(/Email Address/i), 'ronin@neon.city');
    await user.type(screen.getByLabelText(/Shipping Address/i), 'Sector 7, Night City');
    
    // Submit
    await user.click(screen.getByText('Complete Order'));
    
    // Wait for success screen (simulated 500ms delay)
    await waitFor(() => {
      expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByText(/Your gear is being prepped for shipment/i)).toBeInTheDocument();

    // Return to shop
    await user.click(screen.getByText('Back to Shop'));
    expect(screen.getByText('Available Gear')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });
});

