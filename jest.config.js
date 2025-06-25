module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/\._.*', // Ignora archivos ocultos de macOS
  ],
};
