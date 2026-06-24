import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const now = new Date().toISOString();

function loadEnv() {
  const env = {};
  const raw = fs.readFileSync('.env', 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return env;
}

function getProjectId() {
  const env = loadEnv();
  return env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID;
}

function getFirebaseCliAccessToken() {
  execFileSync('firebase', ['projects:list', '--json'], { stdio: 'ignore' });
  const configPath = `${process.env.HOME}/.config/configstore/firebase-tools.json`;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.tokens.access_token;
}

function createEventSlug(title = '') {
  return String(title || 'event')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'event';
}

function firestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: value } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(firestoreValue) } };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  return { stringValue: String(value) };
}

function fromFirestoreValue(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ('timestampValue' in value) return value.timestampValue;
  return null;
}

function fromFirestoreDocument(document) {
  const id = document.name.split('/').pop();
  const fields = {};
  for (const [key, value] of Object.entries(document.fields || {})) {
    fields[key] = fromFirestoreValue(value);
  }
  return { id, path: document.name, ...fields };
}

async function firestoreRequest(path, options = {}) {
  const response = await fetch(`https://firestore.googleapis.com/v1/${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed: ${JSON.stringify(body)}`);
  }
  return body;
}

async function listCollection(collectionName) {
  const body = await firestoreRequest(`${databasePath}/documents/${collectionName}?pageSize=1000`);
  return (body.documents || []).map(fromFirestoreDocument);
}

async function batchWrite(writes) {
  if (writes.length === 0) return {};
  return firestoreRequest(`${databasePath}/documents:batchWrite`, {
    method: 'POST',
    body: JSON.stringify({ writes })
  });
}

const projectId = getProjectId();
if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env');
}

const token = getFirebaseCliAccessToken();
const databasePath = `projects/${projectId}/databases/(default)`;

console.log(`Using Firebase project ${projectId}`);
console.log('Reading existing events...');
const events = await listCollection('events');

const usedSlugs = new Set();
const writes = [];

for (const event of events) {
  let slug = event.slug || createEventSlug(event.title);
  if (usedSlugs.has(slug)) {
    const baseSlug = createEventSlug(event.title);
    let suffix = 2;
    while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
      suffix += 1;
    }
    slug = `${baseSlug}-${suffix}`;
  }
  usedSlugs.add(slug);

  if (event.slug !== slug) {
    writes.push({
      update: {
        name: event.path,
        fields: {
          slug: firestoreValue(slug),
          updatedAt: firestoreValue(now)
        }
      },
      updateMask: {
        fieldPaths: ['slug', 'updatedAt']
      }
    });
  }
}

console.log(`Writing ${writes.length} event slug update${writes.length === 1 ? '' : 's'}...`);
await batchWrite(writes);

console.log(JSON.stringify({
  totalEvents: events.length,
  updated: writes.length
}, null, 2));
