#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const dataFile = path.resolve(process.cwd(), 'public/data/projects.json');
const token = process.env.GITHUB_TOKEN || process.env.TOKEN_GITHUB || '';

function repoFromUrl(url) {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

async function fetchRepoMeta(owner, repo) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${owner}/${repo} -> ${res.status} ${body.slice(0, 140)}`);
  }
  return res.json();
}

async function run() {
  const raw = await fs.readFile(dataFile, 'utf8');
  const payload = JSON.parse(raw);
  const out = { ...payload, generatedAt: new Date().toISOString() };

  for (const project of out.projects) {
    const parsed = repoFromUrl(project.repoUrl);
    if (!parsed) continue;

    try {
      const meta = await fetchRepoMeta(parsed.owner, parsed.repo);
      project.updatedAt = meta.updated_at || project.updatedAt;
      project.stars = meta.stargazers_count ?? project.stars;
      project.forks = meta.forks_count ?? project.forks;
      project.visibility = meta.private ? 'private' : 'public';
      console.log(`updated ${parsed.owner}/${parsed.repo}`);
    } catch (err) {
      console.warn(`skip ${parsed.owner}/${parsed.repo}: ${err.message}`);
    }
  }

  await fs.writeFile(dataFile, JSON.stringify(out, null, 2) + '\n');
  console.log(`written ${dataFile}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
