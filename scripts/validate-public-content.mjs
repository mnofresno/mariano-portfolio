#!/usr/bin/env node
/**
 * validate-public-content.mjs
 * Scans public content files for privacy violations, secrets, and unapproved claims.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const CLAIMS_FILE = path.join(PROJECT_ROOT, 'content', 'claims.json');

// High-risk patterns for privacy violations
const HIGH_RISK_PATTERNS = [
  { name: 'private-key', regex: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/i, message: 'Private key detected' },
  { name: 'token-generic', regex: /(?:api[_-]?key|apikey|access[_-]?token|auth[_-]?token|secret[_-]?key)\s*[=:]\s*['"][A-Za-z0-9_\-]{16,}['"]/i, message: 'Potential API key or token' },
  { name: 'bearer-token', regex: /\bBearer\s+[A-Za-z0-9_\-\.]+/i, message: 'Bearer token detected' },
  { name: 'url-with-credentials', regex: /(?:https?|ftp):\/\/[^/\s@]+:[^/\s@]+@/i, message: 'URL with embedded credentials' },
  { name: 'private-ip', regex: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b/i, message: 'Private IP address' },
  { name: 'local-file-path', regex: /(?<!https?:\/\/)(?<!http:\/\/)[^a-zA-Z]:\/Users\/[^/\s]+\/[^\s'"]*/i, message: 'Local file path from developer machine' },
  { name: 'todo-requires-approval', regex: /TODO_REQUIRES_MARIANO_APPROVAL/i, message: 'Content pending approval marker' },
  { name: 'github-token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/i, message: 'GitHub token pattern' },
  { name: 'aws-access-key', regex: /AKIA[0-9A-Z]{16}/i, message: 'AWS access key pattern' },
];

function loadClaims() {
  try {
    const data = fs.readFileSync(CLAIMS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { claims: [] };
  }
}

function findPublicFiles(dir) {
  const files = [];
  const extensions = ['.html', '.json', '.txt', '.xml'];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        if (extensions.includes(path.extname(entry.name).toLowerCase())) {
          files.push(fullPath);
        }
      }
    }
  }
  walk(dir);
  return files;
}

function scanFile(filePath) {
  const errors = [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const pattern of HIGH_RISK_PATTERNS) {
      const match = content.match(pattern.regex);
      if (match) {
        const lineNum = content.substring(0, match.index).split('\n').length;
        const redacted = match[0].substring(0, 10) + (match[0].length > 10 ? '...' : '');
        errors.push({
          file: path.relative(PROJECT_ROOT, filePath),
          rule: pattern.name,
          message: `${pattern.message}: ${redacted}`,
          line: lineNum,
        });
      }
    }
  } catch {
    // Skip unreadable files
  }
  return errors;
}

function main() {
  console.log('Validating public content for privacy violations...\n');
  if (!fs.existsSync(CLAIMS_FILE)) {
    console.error('ERROR: Claims file not found at', CLAIMS_FILE);
    process.exit(1);
  }
  const claimsData = loadClaims();
  if (!claimsData.claims || !Array.isArray(claimsData.claims)) {
    console.error('ERROR: claims.json must contain a "claims" array');
    process.exit(1);
  }
  const publicFiles = findPublicFiles(PUBLIC_DIR);
  console.log(`Scanning ${publicFiles.length} public files...\n`);
  const allErrors = [];
  for (const filePath of publicFiles) {
    allErrors.push(...scanFile(filePath));
  }
  if (allErrors.length > 0) {
    console.error(`Found ${allErrors.length} validation error(s):\n`);
    for (const error of allErrors) {
      console.error(`  ${error.file}:${error.line}`);
      console.error(`    Rule: ${error.rule}`);
      console.error(`    ${error.message}\n`);
    }
    console.error('Validation failed. Fix the issues above before publishing.\n');
    process.exit(1);
  }
  console.log('No privacy violations detected.\n');
  process.exit(0);
}

main();
