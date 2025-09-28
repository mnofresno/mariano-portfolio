// jest.setup.js
// Setup file for Jest tests

// Mock global objects that might be used in tests
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3500',
    origin: 'http://localhost:3500',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

// Mock cancelAnimationFrame
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // Reset global variables
  delete window.ChatbotWidgetLoaded;
  delete window.ChatbotRAGLoaded;
  delete window.ChatbotDemoLoaded;
  delete window.RAGChatbot;
  delete window.chatbotDemoSend;
  delete window.__CHATBOT_WIDGET_TEST__;
});
