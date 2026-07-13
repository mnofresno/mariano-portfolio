/**
 * __tests__/smoke.test.js
 * Smoke tests for key pages and HTML structure
 */

const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// Pages that must exist and be served
const PAGES = [
  '/',
  '/about/',
  '/labs/',
];

// SEO resources that should exist
const SEO_RESOURCES = [
  '/favicon.ico',
];

/**
 * Minimal HTML validation for each page.
 * Checks for required elements and attributes.
 */
function validatePageHtml(content, pageName) {
  const errors = [];

  // Check for <title>
  if (!/<title>[^<]+<\/title>/i.test(content)) {
    errors.push(`${pageName}: missing <title>`);
  }

  // Check for <h1>
  if (!/<h1[^>]*>.*?<\/h1>/is.test(content)) {
    errors.push(`${pageName}: missing <h1>`);
  }

  // Check for meta description
  if (!/<meta[^>]*name=["']description["'][^>]*>/i.test(content)) {
    errors.push(`${pageName}: missing meta description`);
  }

  return errors;
}

describe('Smoke Tests - Key Pages', () => {
  for (const page of PAGES) {
    const filePath = page === '/' ? 'index.html' : page + 'index.html';
    const fullPath = path.join(PUBLIC_DIR, filePath);

    test(`${page} file exists`, () => {
      expect(fs.existsSync(fullPath)).toBe(true);
    });

    test(`${page} is not empty`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content.length).toBeGreaterThan(100);
    });

    test(`${page} has valid HTML structure`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const errors = validatePageHtml(content, page);
      expect(errors).toEqual([]);
    });

    test(`${page} has a canonical URL`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(/<link[^>]*rel=["']canonical["'][^>]*>/i.test(content)).toBe(true);
    });

    test(`${page} has Open Graph tags`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(/<meta[^>]*property=["']og:[^"]+["'][^>]*>/i.test(content)).toBe(true);
    });
  }

  test('server.js exists', () => {
    expect(fs.existsSync(path.join(PROJECT_ROOT, 'server.js'))).toBe(true);
  });

  test('package.json has required scripts', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf-8'));
    expect(pkg.scripts).toHaveProperty('start');
    expect(pkg.scripts).toHaveProperty('test');
    expect(pkg.scripts).toHaveProperty('dev');
    expect(pkg.scripts).toHaveProperty('web');
  });
});

describe('Smoke Tests - SEO Resources', () => {
  test('favicon exists', () => {
    const faviconPath = path.join(PUBLIC_DIR, 'favicon.ico');
    const faviconPng = path.join(PUBLIC_DIR, 'assets', 'img', 'favicon.png');
    // Either .ico or .png is acceptable
    expect(fs.existsSync(faviconPath) || fs.existsSync(faviconPng)).toBe(true);
  });

  test('apple touch icon exists', () => {
    const touchIcon = path.join(PUBLIC_DIR, 'assets', 'img', 'apple-touch-icon.png');
    expect(fs.existsSync(touchIcon)).toBe(true);
  });
});
