/**
 * __tests__/seo-validation.test.js
 * Tests for SEO, sitemap, robots.txt, LLM context, and JSON-LD
 */

const { describe, test, expect } = require('@jest/globals');
const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

describe('Robots.txt validation', () => {
  test('exists and is valid', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf-8');
    expect(content).toMatch(/User-agent:\s*\*/);
    expect(content).toMatch(/Sitemap:\s*https:\/\/mariano\.fresno\.ar\/sitemap\.xml/);
  });

  test('does not disallow any paths', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'robots.txt'), 'utf-8');
    const disallowLines = content.split('\n').filter(l => l.match(/^Disallow:\s*\S+/i));
    expect(disallowLines).toEqual([]);
  });
});

describe('Sitemap.xml validation', () => {
  test('is valid XML with urlset', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf-8');
    expect(content).toMatch(/^<\?xml/);
    expect(content).toMatch(/<\/urlset>\s*$/);
  });

  test('contains home page with https canonical', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf-8');
    expect(content).toMatch(/<loc>https:\/\/mariano\.fresno\.ar\/<\/loc>/);
  });

  test('all loc values use canonical domain', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf-8');
    const locs = content.match(/<loc>([^<]+)<\/loc>/g) || [];
    for (const loc of locs) {
      const url = loc.replace(/<loc>|<\/loc>/g, '');
      expect(url.startsWith('https://mariano.fresno.ar/')).toBe(true);
    }
  });
});

describe('LLM context files', () => {
  test('llms.txt mentions identity', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'llms.txt'), 'utf-8');
    expect(content).toMatch(/mariano.*fresno/i);
  });

  test('llms.txt includes canonical links', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'llms.txt'), 'utf-8');
    expect(content).toMatch(/https:\/\/mariano\.fresno\.ar/);
  });

  test('llms-full.txt includes identity and services', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), 'utf-8');
    expect(content).toMatch(/mariano.*fresno/i);
    expect(content.toLowerCase()).toMatch(/service/i);
  });

  test('llms files do not contain private information', () => {
    const llms = fs.readFileSync(path.join(PUBLIC_DIR, 'llms.txt'), 'utf-8');
    const llmsFull = fs.readFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), 'utf-8');
    for (const content of [llms, llmsFull]) {
      expect(content).not.toMatch(/TODO_REQUIRES_MARIANO_APPROVAL/);
      expect(content).not.toMatch(/192\.168\./);
      expect(content).not.toMatch(/-----BEGIN/);
    }
  });
});

describe('JSON-LD structured data', () => {
  test('index.html contains JSON-LD script tag', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf-8');
    expect(content).toMatch(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/);
  });

  test('JSON-LD is valid JSON and contains Person type', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf-8');
    const match = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/);
    expect(match).toBeTruthy();
    const data = JSON.parse(match[1]);
    const items = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    const hasPerson = items.some(item => item['@type'] === 'Person');
    expect(hasPerson).toBe(true);
  });

  test('JSON-LD does not contain unapproved claims', () => {
    const content = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf-8');
    expect(content).not.toMatch(/TODO_REQUIRES_MARIANO_APPROVAL/);
  });
});

describe('Page title and description uniqueness', () => {
  const pages = [
    { name: 'home', file: 'index.html' },
    { name: 'about', file: 'about/index.html' },
    { name: 'labs', file: 'labs/index.html' },
  ];

  test('all pages have unique titles', () => {
    const titles = pages.map(p => {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, p.file), 'utf-8');
      const match = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      return match ? match[1].trim() : null;
    });
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
    titles.forEach(t => expect(t).not.toBeNull());
  });

  test('all pages have meta descriptions', () => {
    for (const p of pages) {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, p.file), 'utf-8');
      expect(/<meta[^>]*name=["']description["'][^>]*content=["'][^"]+["']/i.test(content)).toBe(true);
    }
  });

  test('canonical URLs use trailing slash', () => {
    for (const p of pages) {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, p.file), 'utf-8');
      const match = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"]+)["']/i);
      if (match) {
        expect(match[1].endsWith('/')).toBe(true);
      }
    }
  });
});
