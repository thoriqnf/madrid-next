import React from 'react'
import { render, screen } from '@testing-library/react'
import { DemoComponent } from './DemoComponent'

describe('DemoComponent', () => {
  it('renders the component correctly', () => {
    render(<DemoComponent />)
    
    // Check if the heading is in the document
    const heading = screen.getByText(/Testing Demo/i)
    expect(heading).toBeInTheDocument()
    
    // Check if the paragraph text exists
    const paragraph = screen.getByText(/This is a super simple component for testing./i)
    expect(paragraph).toBeInTheDocument()
    
    // Check if the button exists by role
    const button = screen.getByRole('button', { name: /Click Me/i })
    expect(button).toBeInTheDocument()
  })
})
