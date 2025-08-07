module.exports = {
  // Test environment for Node.js (Adobe App Builder actions)
  testEnvironment: 'node',

  // Setup files to run after Jest environment is set up
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Directories to search for tests and modules (only existing directories)
  roots: ['<rootDir>/test', '<rootDir>/actions'],

  // Test file patterns (using testMatch, not testRegex) - excludes e2e
  testMatch: [
    '**/test/**/*.+(js|jsx)',
    '**/*.(test|spec).+(js|jsx)',
    '**/__tests__/**/*.+(js|jsx)',
  ],

  // Note: testRegex is commented out to avoid conflict with testMatch
  // testRegex: "./e2e",

  // Transform configuration for different file types
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Files to include in coverage collection (includes future directories)
  collectCoverageFrom: [
    'actions/**/*.{js,jsx}',
    'src/**/*.{js,jsx}',
    'scripts/**/*.{js,jsx}',
    'lib/**/*.{js,jsx}',
    '!**/*.config.js',
    '!**/*.setup.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/e2e/**',
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage report formats
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Coverage thresholds (adjusted for Adobe App Builder project)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Specific thresholds for actions
    'actions/**/*.js': {
      branches: 85,
      functions: 90,
      lines: 85,
      statements: 85,
    },
  },

  // Module name mapping for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@actions/(.*)$': '<rootDir>/actions/$1',
    '^@scripts/(.*)$': '<rootDir>/scripts/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@utils/(.*)$': '<rootDir>/actions/utils',
  },

  // Test timeout (matches your jest.setup.js)
  testTimeout: 10000,

  // Ignore patterns for test discovery
  testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/', '/build/', '/web-src/'],

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output for better debugging
  verbose: true,

  // Detect open handles to prevent hanging tests
  detectOpenHandles: true,

  // Adobe App Builder specific configurations
  globals: {
    // Environment variables that might be used in actions
    __OW_ACTION_NAME: 'test-action',
    __OW_NAMESPACE: 'test-namespace',
  },

  // Setup for Adobe I/O Runtime environment simulation
  testEnvironmentOptions: {
    // Node.js environment options
  },
};
