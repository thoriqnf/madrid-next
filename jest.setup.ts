import '@testing-library/jest-dom'
import { server } from './src/app/demo-testing/mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
