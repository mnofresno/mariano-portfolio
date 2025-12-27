# Mariano Fresno Portfolio

This repository contains the personal portfolio website of Mariano Fresno, full-stack developer and technical leader. The site is built as a static, dependency-free webapp with a modular architecture and a focus on performance, accessibility, and easy extensibility.

**✨ Modernized for 2026** - The portfolio has been updated with modern design trends, dark mode, improved accessibility, and performance optimizations. See [MEJORAS_IMPLEMENTADAS.md](./MEJORAS_IMPLEMENTADAS.md) for details.

## Quick Start

### Development Server

Start a local development server to test the portfolio:

```bash
npm run web
```

Or use the alternative commands:
```bash
npm start    # Same as npm run web
npm run dev  # Same as npm run web
```

The server will start on `http://localhost:3500` (or the port specified in `PORT` environment variable).

**Features:**
- ✅ Built-in Node.js server (no external dependencies)
- ✅ SPA routing support (falls back to index.html)
- ✅ Proper MIME types for all file types
- ✅ Security headers
- ✅ CORS enabled for development
- ✅ Colored request logging
- ✅ Graceful shutdown

## Project Structure

- `public/` — All static assets, HTML, CSS, JS, images, and the chatbot widget.
  - `assets/css/modern-enhancements.css` — Modern CSS enhancements (variables, dark mode, microinteractions)
  - `assets/js/theme-toggle.js` — Dark mode toggle functionality
  - `assets/js/accessibility-enhancements.js` — Accessibility improvements
  - `assets/js/performance-optimizations.js` — Performance optimizations
- `server.js` — Node.js static file server (no dependencies required).
- `README.md` — (this file) General documentation for the project.
- `MODERNIZACION_2026.md` — Detailed modernization plan based on 2026 web design trends.
- `MEJORAS_IMPLEMENTADAS.md` — Documentation of implemented improvements.

---

## 🚀 Chatbot Modular Component

### Overview

The chatbot is a fully decoupled, zero-dependency, vanilla JS widget. It can be added or removed from `index.html` with a single line. If the chatbot is not loaded, the rest of the site works perfectly.

### Features

- **Modular:** Add/remove with one script tag.
- **No dependencies:** Pure JS, no React, no frameworks.
- **Floating UI:** Modern, responsive, and non-intrusive.
- **Multi-language:** UI and demo flow adapt to the site's language, and update dynamically if the user switches language.
- **Demo/Backend mode:** Easily switch between a mock/demo workflow and a real backend connection.
- **WhatsApp CTA:** In demo mode, the bot offers a WhatsApp contact with a styled icon and prefilled message.
- **Dynamic language param:** When using a backend, the current language is sent as a query parameter and updates live if the user switches language.

### Usage

Add this before `</body>` in your `index.html`:

```html
<!-- Chatbot Widget -->
<script type="module" src="/chatbot/chatbot-widget.js"></script>
```

### Configuration

All configuration is done inside `public/chatbot/chatbot-widget.js`:

```js
const config = {
  demoMode: true, // true = demo/mock, false = real backend
  backendUrl: 'https://example.com/chatbot', // Backend endpoint
};
```

- **Demo mode:** If `demoMode` is `true`, the widget loads a mock workflow from `chatbot-demo.js`.
- **Backend mode:** If `demoMode` is `false`, the widget sends user messages to the backend via POST, including the current language as a `lang` query parameter.
- **Language sync:** The widget listens for language changes and updates the backend param and UI texts in real time.

### How to use with a real backend

1. Set `demoMode: false` in `chatbot-widget.js`.
2. Set `backendUrl` to your server endpoint.
3. The backend should accept POST requests with `{ message: string }` and respond with `{ reply: string }`.
4. The current language is sent as a `lang` query parameter (e.g. `/chatbot?lang=es`).
5. The widget will update the language param if the user switches language after opening the chat.

### How to use with the demo/mock

- Leave `demoMode: true` (default).
- The widget will load `chatbot-demo.js` dynamically and use a simple greeting + WhatsApp CTA flow.
- The WhatsApp number and CTA text are easily editable in `chatbot-demo.js`.

### Customization

- **UI colors, icon, and position** can be changed in `chatbot-widget.js`.
- **WhatsApp number** and CTA are in `chatbot-demo.js`.
- **Multi-language texts** are centralized in both files for easy editing.

### What we did

- Migrated all static files to `public/`.
- Created a pure Node.js static server.
- Built a modular, dependency-free chatbot widget.
- Implemented demo and backend modes, with dynamic language support.
- Made the WhatsApp CTA visually consistent with the rest of the site.
- Ensured all UI and bot messages update live when the language changes.
- Documented all configuration and extension points.

### To Do / Improvements

- [x] Add accessibility improvements (ARIA roles, keyboard navigation) - ✅ Implemented
- [ ] Add more advanced backend integration (e.g. streaming, typing indicators from server).
- [ ] Add more demo flows or FAQ.
- [ ] Add tests for the widget logic.

---

## 🎨 Modern Enhancements (2026 Trends)

The portfolio has been modernized with the following improvements:

### Design System
- **CSS Variables**: Modern design system with customizable colors, typography, and spacing
- **Dark Mode**: Automatic system preference detection + manual toggle
- **Responsive Typography**: Fluid typography using `clamp()` for optimal readability
- **Microinteractions**: Smooth hover effects and 3D transforms
- **Modern Visual Effects**: Glassmorphism, gradients, and elevation shadows

### Accessibility
- **WCAG 2.1 AA Compliance**: Improved contrast ratios and keyboard navigation
- **ARIA Labels**: Automatic ARIA labels for better screen reader support
- **Skip Links**: Quick navigation to main content
- **Focus Indicators**: Visible focus states for keyboard users

### Performance
- **Lazy Loading**: Images load as they enter viewport
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Resource Hints**: DNS prefetch and preconnect for faster loading
- **Layout Shift Prevention**: Aspect ratios and optimized loading

### How to Use

All enhancements are automatically loaded when you include the files in `index.html`. The dark mode toggle button appears in the bottom-right corner.

For detailed information, see:
- [MODERNIZACION_2026.md](./MODERNIZACION_2026.md) - Complete modernization plan
- [MEJORAS_IMPLEMENTADAS.md](./MEJORAS_IMPLEMENTADAS.md) - Implementation details

---

## Available Scripts

- `npm run web` or `npm start` or `npm run dev` - Start development server
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:all` - Run all test suites
- `npm run test:widget` - Run chatbot widget tests only
- `npm run test:rag` - Run chatbot RAG tests only
- `npm run test:integration` - Run integration tests

## License

This project is open source and free to use for personal and educational purposes. See LICENSE for details.

---

For any questions or suggestions, contact Mariano Fresno via the WhatsApp link on the site or open an issue.
