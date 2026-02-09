import React from 'react'
import { render, screen } from '@testing-library/react'
import { DemoComponent } from './DemoComponent'

describe('DemoComponent', () => {
  test('renders the heading', ()=> {
    render(<DemoComponent/>)

    const heading1 = screen.getByText(/Testing Demo/i)
    expect(heading1).toBeInTheDocument()
  })

  test('renders the paragraph', ()=> {
    render(<DemoComponent/>)

    const heading1 = screen.getByText(/This is a super simple component for testing./i)
    expect(heading1).toBeInTheDocument()
  })

  test('renders the button', ()=> {
    render(<DemoComponent/>)

    const heading1 = screen.getByRole('button', {name: /Click Me/i})
    expect(heading1).toBeInTheDocument()
  })
})
