/**
 * __tests__/public-content-validation.test.js
 * Tests for the public content validator
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

let tempPublicDir;

describe('Public Content Validator', () => {
  beforeEach(() => {
    tempPublicDir = path.join(PROJECT_ROOT, 'public', '__test_fixtures__');
    fs.mkdirSync(tempPublicDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tempPublicDir)) {
      fs.rmSync(tempPublicDir, { recursive: true, force: true });
    }
  });

  test('should pass with clean content', () => {
    const result = execSync('node scripts/validate-public-content.mjs', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    });
    expect(result).toContain('No privacy violations detected');
  });

  test('should detect private keys in HTML files', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'private-key.html'),
      '<pre>-----BEGIN RSA PRIVATE KEY-----</pre>'
    );
    let error;
    try { execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' }); } catch (e) { error = e; }
    expect(error).toBeTruthy();
    expect(error.message).toContain('private-key');
  });

  test('should detect Bearer tokens', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'bearer.html'),
      '<script>const t = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";</script>'
    );
    let error;
    try { execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' }); } catch (e) { error = e; }
    expect(error).toBeTruthy();
    expect(error.message).toContain('bearer-token');
  });

  test('should detect TODO_REQUIRES_MARIANO_APPROVAL markers', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'pending.html'),
      '<p>TODO_REQUIRES_MARIANO_APPROVAL: revenue claim</p>'
    );
    let error;
    try { execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' }); } catch (e) { error = e; }
    expect(error).toBeTruthy();
    expect(error.message).toContain('todo-requires-approval');
  });

  test('should not flag legitimate URLs with /users/ path', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'url.html'),
      '<a href="https://cults3d.com/en/users/mnofresno/3d-models">Profile</a>'
    );
    const result = execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    expect(result).toContain('No privacy violations detected');
  });

  test('should validate claims.json structure', () => {
    const claimsPath = path.join(PROJECT_ROOT, 'content', 'claims.json');
    const data = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'));
    expect(data).toHaveProperty('claims');
    expect(Array.isArray(data.claims)).toBe(true);
  });

  test('should detect GitHub tokens', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'gh-token.html'),
      '<script>const t = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn";</script>'
    );
    let error;
    try { execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' }); } catch (e) { error = e; }
    expect(error).toBeTruthy();
    expect(error.message).toContain('github-token');
  });

  test('should detect AWS access keys', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'aws.html'),
      '<script>const k = "AKIAIOSFODNN7EXAMPLE";</script>'
    );
    let error;
    try { execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' }); } catch (e) { error = e; }
    expect(error).toBeTruthy();
    expect(error.message).toContain('aws-access-key');
  });

  test('should detect URLs with embedded credentials', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'url-creds.html'),
      '<script>const u = "https://user:pass@api.example.com";</script>'
    );
    let error;
    try { execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' }); } catch (e) { error = e; }
    expect(error).toBeTruthy();
    expect(error.message).toContain('url-with-credentials');
  });

  test('should detect private IP addresses', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'ip.html'),
      '<script>const ip = "192.168.1.100";</script>'
    );
    let error;
    try { execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' }); } catch (e) { error = e; }
    expect(error).toBeTruthy();
    expect(error.message).toContain('private-ip');
  });

  test('should detect API key assignments', () => {
    fs.writeFileSync(
      path.join(tempPublicDir, 'api-key.html'),
      '<script>const apiKey = "abcdefghijklmnop1234";</script>'
    );
    let error;
    try { execSync('node scripts/validate-public-content.mjs', { cwd: PROJECT_ROOT, encoding: 'utf-8' }); } catch (e) { error = e; }
    expect(error).toBeTruthy();
    expect(error.message).toContain('token-generic');
  });
});
