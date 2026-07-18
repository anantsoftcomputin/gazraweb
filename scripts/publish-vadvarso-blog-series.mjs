import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { vadvarsoBlogSeries } from '../content/vadvarso-blog-series.mjs';

const projectId = 'gazraweb-33d32';
const minimumWords = 1000;

function getFirebaseCliAccessToken() {
  execFileSync('firebase', ['projects:list', '--json'], { stdio: 'ignore' });
  const configPath = `${process.env.HOME}/.config/configstore/firebase-tools.json`;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.tokens.access_token;
}

function firestoreFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'boolean') fields[key] = { booleanValue: value };
    else if (typeof value === 'number') fields[key] = { integerValue: String(value) };
    else fields[key] = { stringValue: String(value ?? '') };
  }
  return { fields };
}

const slugify = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

function wordCount(content) {
  return content.trim() ? content.trim().split(/\s+/).length : 0;
}

async function publishPost(token, post, index) {
  const slug = slugify(post.title);
  const publishedDate = new Date(Date.UTC(2026, 6, 10 + index, 6, 0, 0)).toISOString();
  const payload = {
    ...post,
    slug,
    author: 'Project Gazra Editorial Team',
    status: 'published',
    publishedDate,
    createdAt: publishedDate,
    updatedAt: new Date().toISOString(),
    wordCount: wordCount(post.content),
    series: 'Vadvarso',
    seriesOrder: index + 1,
  };
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs/${slug}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(firestoreFields(payload)),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`Failed to publish "${post.title}": ${JSON.stringify(result)}`);
  return result;
}

async function main() {
  if (vadvarsoBlogSeries.length !== 10) {
    throw new Error(`Expected 10 Vadvarso posts, found ${vadvarsoBlogSeries.length}.`);
  }
  for (const post of vadvarsoBlogSeries) {
    const words = wordCount(post.content);
    if (words < minimumWords) throw new Error(`"${post.title}" has only ${words} words.`);
    const imagePath = `public${post.featuredImage}`;
    if (!fs.existsSync(imagePath)) throw new Error(`Missing image: ${imagePath}`);
  }
  if (process.argv.includes('--dry-run')) {
    for (const post of vadvarsoBlogSeries) console.log(`✓ ${wordCount(post.content)} words — ${post.title}`);
    console.log('Dry run complete; no Firestore documents were changed.');
    return;
  }

  const token = getFirebaseCliAccessToken();
  console.log(`Publishing ${vadvarsoBlogSeries.length} Vadvarso posts to ${projectId}...`);
  for (let index = 0; index < vadvarsoBlogSeries.length; index += 1) {
    const post = vadvarsoBlogSeries[index];
    await publishPost(token, post, index);
    console.log(`✓ ${wordCount(post.content)} words — ${post.title}`);
  }
  console.log('Vadvarso blog series published.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
