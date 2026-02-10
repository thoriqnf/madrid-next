import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DemoComponent from './DemoComponent';
import '@testing-library/jest-dom';

describe('DemoComponent', () => {
  test('renders the title', () => {
    render(<DemoComponent title="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('button is clickable', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<DemoComponent title="Test" />);
    fireEvent.click(screen.getByText('Click me'));
    expect(consoleSpy).toHaveBeenCalledWith('clicked');
    consoleSpy.mockRestore();
  });
});
