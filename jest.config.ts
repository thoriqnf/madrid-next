import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-fixed-jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// We wrap it to override transformIgnorePatterns (next/jest adds its own that blocks MSW ESM deps)
const jestConfig = createJestConfig(config)

export default async function () {
  const resolvedConfig = await jestConfig()
  resolvedConfig.transformIgnorePatterns = [
    // Allow MSW and its ESM dependencies to be transformed by Jest
    '/node_modules/(?!.pnpm)(?!(msw|@mswjs|until-async|@bundled-es-modules|geist)/)',
    '/node_modules/.pnpm/(?!(msw|@mswjs|until-async|@bundled-es-modules|geist)@)',
    '^.+\\.module\\.(css|sass|scss)$',
  ]
  return resolvedConfig
}
