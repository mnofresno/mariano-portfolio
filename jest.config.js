module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/\._.*', // Ignora archivos ocultos de macOS
  ],
  collectCoverageFrom: [
    'public/chatbot/**/*.js',
    '!public/chatbot/**/*.min.js',
    '!public/chatbot/**/vendor/**',
    '!public/chatbot/chatbot-bundle.js',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/public/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ]
};
