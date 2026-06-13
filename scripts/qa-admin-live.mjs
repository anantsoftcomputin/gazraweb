import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from 'firebase/storage';

const projectId = 'gazraweb-33d32';
const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const testEmail = `codex-qa-${runId}@gazra.test`;
const testPassword = `CodexQa-${runId}-A1!`;
const createdDocs = [];
const createdStorageRefs = [];

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

function getFirebaseConfig() {
  const env = loadEnv();
  return {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || env.VITE_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || env.VITE_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || env.VITE_FIREBASE_MEASUREMENT_ID
  };
}

function getFirebaseCliAccessToken() {
  execFileSync('firebase', ['projects:list', '--json'], { stdio: 'ignore' });
  const configPath = `${process.env.HOME}/.config/configstore/firebase-tools.json`;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.tokens.access_token;
}

function firestoreFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null) fields[key] = { nullValue: null };
    else if (typeof value === 'boolean') fields[key] = { booleanValue: value };
    else if (typeof value === 'number') fields[key] = { doubleValue: value };
    else if (Array.isArray(value)) {
      fields[key] = { arrayValue: { values: value.map((item) => ({ stringValue: String(item) })) } };
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return { fields };
}

async function createAuthUser(apiKey) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      returnSecureToken: true
    })
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Could not create Firebase Auth test user: ${JSON.stringify(body)}`);
  }
  return body;
}

async function deleteAuthUser(apiKey, idToken) {
  if (!idToken) return;
  await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ idToken })
  });
}

async function writeAdminMarker(uid) {
  const token = getFirebaseCliAccessToken();
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${uid}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(firestoreFields({
      email: testEmail,
      role: 'qa',
      createdBy: 'codex-live-qa',
      runId
    }))
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Could not create admin marker: ${JSON.stringify(body)}`);
  }
}

async function deleteAdminMarker(uid) {
  const token = getFirebaseCliAccessToken();
  await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${uid}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` }
  });
}

const qaPayloads = {
  events: {
    title: `Codex QA Event ${runId}`,
    category: 'community',
    dateIso: '2026-07-01',
    date: 'July 1, 2026',
    time: '10:00 AM',
    location: 'Codex QA Location',
    capacity: '10',
    description: 'Temporary event created by live QA.',
    price: 'Free',
    featured: false,
    image: 'https://gazra.org/logo.png'
  },
  eventLocations: {
    name: `Codex QA Location ${runId}`,
    address: 'Temporary QA address',
    googleMapLink: 'https://maps.google.com/?q=Gazra',
    email: testEmail,
    phone: '+919999999999',
    capacity: 25,
    infrastructure: ['Projector', 'Sound System'],
    image: 'https://gazra.org/logo.png',
    active: true
  },
  eventRsvps: {
    rsvpId: `codex-qa-rsvp-${runId}`,
    qrToken: `codex-qa-token-${runId}`,
    eventId: `codex-qa-event-${runId}`,
    eventTitle: `Codex QA Event ${runId}`,
    eventDate: '2026-07-01',
    eventTime: '10:00 AM',
    location: 'Codex QA Location',
    name: `Codex QA RSVP ${runId}`,
    email: testEmail,
    phone: '+919999999999',
    status: 'confirmed',
    attendanceStatus: 'not_checked_in',
    checkedIn: false,
    reminderStatus: 'pending'
  },
  menuItems: {
    name: `Codex QA Menu ${runId}`,
    description: 'Temporary menu item created by live QA.',
    price: '₹1',
    category: 'starters',
    spiceLevel: 'mild',
    images: ['https://gazra.org/logo.png'],
    image: 'https://gazra.org/logo.png',
    tags: ['QA'],
    available: true
  },
  cafeFeatures: {
    title: `Codex QA Feature ${runId}`,
    description: 'Temporary cafe feature.',
    icon: 'Coffee',
    active: true
  },
  cafeTestimonials: {
    name: `Codex QA Testimonial ${runId}`,
    quote: 'Temporary testimonial.',
    rating: 5,
    active: true,
    image: 'https://gazra.org/logo.png'
  },
  cafeMoments: {
    title: `Codex QA Moment ${runId}`,
    date: '2026-07-01',
    image: 'https://gazra.org/logo.png',
    active: true
  },
  cafeSettings: {
    name: `Codex QA Setting ${runId}`,
    value: 'enabled',
    active: true
  },
  cafeBookings: {
    name: `Codex QA Booking ${runId}`,
    email: testEmail,
    phone: '+919999999999',
    guests: '2',
    date: '2026-07-01',
    time: '10:00',
    status: 'pending'
  },
  cafeClosedDates: {
    date: '2026-07-02',
    reason: `Codex QA Closed ${runId}`,
    active: true
  },
  volunteers: {
    name: `Codex QA Volunteer ${runId}`,
    email: testEmail,
    phone: '+919999999999',
    status: 'new'
  },
  supportRequests: {
    name: `Codex QA Support ${runId}`,
    email: testEmail,
    phone: '+919999999999',
    category: 'education',
    status: 'new'
  },
  newsletter: {
    email: testEmail,
    source: 'codex-live-qa',
    status: 'subscribed'
  },
  contactMessages: {
    name: `Codex QA Message ${runId}`,
    email: testEmail,
    message: 'Temporary contact message.',
    status: 'new'
  },
  gallery: {
    title: `Codex QA Gallery ${runId}`,
    image: 'https://gazra.org/logo.png',
    category: 'qa',
    active: true
  },
  initiatives: {
    title: `Codex QA Initiative ${runId}`,
    description: 'Temporary initiative.',
    image: 'https://gazra.org/logo.png',
    active: true
  },
  skillsCourses: {
    title: `Codex QA Course ${runId}`,
    description: 'Temporary course.',
    duration: '1 day',
    active: true
  },
  skillsEnrollments: {
    name: `Codex QA Enrollment ${runId}`,
    email: testEmail,
    phone: '+919999999999',
    courseId: `qa-course-${runId}`,
    status: 'new'
  }
};

async function runFirestoreCrud(db) {
  const results = [];
  for (const [collectionName, payload] of Object.entries(qaPayloads)) {
    const ref = await addDoc(collection(db, collectionName), {
      ...payload,
      codexQa: true,
      runId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    createdDocs.push(ref);

    await updateDoc(ref, {
      qaUpdated: true,
      updatedAt: serverTimestamp()
    });

    const snapshot = await getDoc(ref);
    if (!snapshot.exists() || snapshot.data().qaUpdated !== true) {
      throw new Error(`CRUD verification failed for ${collectionName}`);
    }

    results.push({ collection: collectionName, id: ref.id, ok: true });
  }
  return results;
}

async function runStorageCrud(storage) {
  const path = `events/codex-qa-${runId}.png`;
  const objectRef = ref(storage, path);
  createdStorageRefs.push(objectRef);
  const bytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADgwGAlZ2f1QAAAABJRU5ErkJggg==',
    'base64'
  );
  await uploadBytes(objectRef, new Blob([bytes], { type: 'image/png' }), { contentType: 'image/png' });
  const url = await getDownloadURL(objectRef);
  if (!url.includes('codex-qa')) throw new Error('Storage upload URL did not include expected path');
  return { path, ok: true };
}

async function runBrowserChecks(db) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(`${page.url()} :: ${message.text()}`);
    });
    page.on('pageerror', (error) => {
      pageErrors.push(`${page.url()} :: ${error.message}`);
    });

    await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
    await page.getByLabel('Email Address').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('**/admin/dashboard', { timeout: 20000 });

    const uiCrudResult = await runEventUiCrud(page);
    const checkInResult = await runCheckInUiFlow(page, db);

    const routes = [
      '/',
      '/about',
      '/events',
      '/cafe',
      '/calendar',
      '/gallery',
      '/contact',
      '/gazra-support',
      '/gazra-skills',
      '/admin',
      '/admin/dashboard',
      '/admin/events',
      '/admin/events/locations',
      '/admin/events/check-in',
      '/admin/cafe/menu',
      '/admin/cafe/features',
      '/admin/cafe/testimonials',
      '/admin/cafe/settings',
      '/admin/cafe/moments',
      '/admin/cafe/bookings',
      '/admin/cafe/closed-dates',
      '/admin/volunteers',
      '/admin/support-requests',
      '/admin/newsletter',
      '/admin/messages',
      '/admin/gallery',
      '/admin/initiatives',
      '/admin/skills/courses',
      '/admin/skills/enrollments'
    ];

    const routeResults = [];
    for (const route of routes) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(750);
      const status = response?.status() || 0;
      const finalUrl = page.url();
      const bodyText = await page.locator('body').innerText({ timeout: 5000 }).catch(() => '');
      routeResults.push({
        route,
        status,
        finalUrl,
        ok: status >= 200 && status < 400 && !bodyText.includes('Application error')
      });
    }

    return { routeResults, consoleErrors, pageErrors, uiCrudResult, checkInResult };
  } finally {
    await browser.close().catch(() => {});
  }
}

async function runCheckInUiFlow(page, db) {
  const qrToken = `codex-qa-checkin-token-${runId}`;
  const rsvpId = `codex-qa-checkin-rsvp-${runId}`;
  const ref = await addDoc(collection(db, 'eventRsvps'), {
    codexQa: true,
    runId,
    rsvpId,
    qrToken,
    eventId: `codex-qa-checkin-event-${runId}`,
    eventTitle: `Codex QA Check-In Event ${runId}`,
    eventDate: '2026-07-04',
    eventTime: '12:00 PM',
    location: 'Codex QA Location',
    name: `Codex QA Check-In Guest ${runId}`,
    email: testEmail,
    phone: '+919999999999',
    status: 'confirmed',
    attendanceStatus: 'not_checked_in',
    checkedIn: false,
    reminderStatus: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  createdDocs.push(ref);

  const payload = JSON.stringify({
    type: 'gazra-event-rsvp',
    eventId: `codex-qa-checkin-event-${runId}`,
    rsvpId,
    qrToken
  });

  await page.goto(`${baseUrl}/admin/events/check-in`, { waitUntil: 'domcontentloaded' });
  await page.locator('textarea').fill(payload);
  await page.getByRole('button', { name: /check in guest/i }).click();

  let snapshot = await getDoc(ref);
  for (let attempt = 0; attempt < 20 && snapshot.data()?.checkedIn !== true; attempt += 1) {
    await page.waitForTimeout(500);
    snapshot = await getDoc(ref);
  }

  const data = snapshot.data();
  const bodyText = await page.locator('body').innerText().catch(() => '');
  return {
    area: 'adminEventCheckInManual',
    ok: data?.checkedIn === true && data?.attendanceStatus === 'checked_in',
    rsvpId,
    checkedIn: data?.checkedIn === true,
    pageConfirmed: /checked in successfully/i.test(bodyText),
    pageText: data?.checkedIn === true ? '' : bodyText.slice(0, 500)
  };
}

async function runEventUiCrud(page) {
  const fileName = `codex-qa-${runId}.png`;
  const fileBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADgwGAlZ2f1QAAAABJRU5ErkJggg==',
    'base64'
  );

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.goto(`${baseUrl}/admin/events`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /add event/i }).first().click();
  await page.locator('input[name="title"]').fill(`Codex QA UI Event ${runId}`);
  await page.locator('select[name="category"]').selectOption('community');
  await page.locator('input[name="dateIso"]').fill('2026-07-03');
  await page.locator('input[name="time"]').fill('11:00 AM');
  await page.locator('input[name="capacity"]').fill('12');
  await page.locator('input[name="ticketsLeft"]').fill('12');
  await page.locator('input[name="organizer"]').fill('Codex QA');
  await page.locator('input[name="contactPhone"]').fill('+919999999999');
  await page.locator('input[name="location"]').fill('Codex QA Location');
  await page.locator('textarea[name="description"]').fill('Temporary UI event created by Codex QA.');
  await page.locator('input[name="price"]').fill('Free');
  await page.locator('input[name="externalLink"]').fill('https://example.com');
  await page.locator('input[type="file"]').setInputFiles({
    name: fileName,
    mimeType: 'image/png',
    buffer: fileBuffer
  });
  await page.getByRole('button', { name: /create event/i }).click();
  await page.waitForTimeout(2500);

  const body = await page.locator('body').innerText();
  const eventCard = page.locator('div', { hasText: `Codex QA UI Event ${runId}` }).first();
  const imagePresent = await eventCard.locator(`img[alt="Codex QA UI Event ${runId}"]`).count().catch(() => 0);
  return {
    area: 'adminEventsUiCreateWithUpload',
    ok: body.includes(`Codex QA UI Event ${runId}`) && imagePresent > 0,
    eventTitle: `Codex QA UI Event ${runId}`,
    fileName,
    imagePresent: imagePresent > 0
  };
}

async function cleanup(apiKey, authUser, app) {
  for (const storageRef of createdStorageRefs.reverse()) {
    await deleteObject(storageRef).catch(() => {});
  }
  if (app) {
    const db = getFirestore(app);
    const mailQueueSnapshot = await getDocs(query(collection(db, 'mailQueue'), where('runId', '==', runId))).catch(() => null);
    if (mailQueueSnapshot) {
      for (const mailDoc of mailQueueSnapshot.docs) {
        await deleteDoc(mailDoc.ref).catch(() => {});
      }
    }
  }
  for (const docRef of createdDocs.reverse()) {
    await deleteDoc(docRef).catch(() => {});
  }
  if (authUser?.uid) await deleteAdminMarker(authUser.uid).catch(() => {});
  const idToken = authUser?.idToken || (authUser?.firebaseUser ? await authUser.firebaseUser.getIdToken().catch(() => null) : null);
  await deleteAuthUser(apiKey, idToken).catch(() => {});
  if (app) await deleteApp(app).catch(() => {});
}

async function main() {
  const config = getFirebaseConfig();
  if (!config.apiKey) throw new Error('Missing Firebase API key from .env');

  let app;
  let authUser;
  const summary = {
    runId,
    testEmail,
    browserLogin: false,
    routes: [],
    firestoreCrud: [],
    storageCrud: null,
    uiCrud: null,
    checkInUi: null,
    failures: [],
    consoleErrors: [],
    pageErrors: []
  };

  try {
    authUser = await createAuthUser(config.apiKey);
    await writeAdminMarker(authUser.localId);

    app = initializeApp(config, `codex-qa-${runId}`);
    const auth = getAuth(app);
    const credential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    authUser.uid = credential.user.uid;
    authUser.firebaseUser = credential.user;

    const db = getFirestore(app);
    const storage = getStorage(app);

    try {
      const adminSnapshot = await getDoc(doc(db, 'admins', authUser.uid));
      if (!adminSnapshot.exists()) {
        throw new Error(`Admin marker was not readable for ${authUser.uid}`);
      }
      summary.firestoreCrud = await runFirestoreCrud(db);
    } catch (error) {
      summary.failures.push({ area: 'firestoreCrud', message: error.message });
    }

    try {
      await credential.user.getIdToken(true);
      summary.storageCrud = await runStorageCrud(storage);
    } catch (error) {
      summary.failures.push({ area: 'storageCrud', message: error.message, code: error.code || null });
    }

    try {
      const browser = await runBrowserChecks(db);
      summary.browserLogin = browser.routeResults.some((route) => route.route === '/admin/dashboard' && route.ok);
      summary.routes = browser.routeResults;
      summary.consoleErrors = browser.consoleErrors;
      summary.pageErrors = browser.pageErrors;
      summary.uiCrud = browser.uiCrudResult;
      summary.checkInUi = browser.checkInResult;
      if (!browser.uiCrudResult?.ok) {
        summary.failures.push({ area: 'adminEventsUiCreateWithUpload', message: 'Admin Events UI create/upload did not create the expected event card.' });
      }
      if (!browser.checkInResult?.ok) {
        summary.failures.push({ area: 'adminEventCheckInManual', message: 'Admin Event Check-In UI did not mark the RSVP as checked in.' });
      }
    } catch (error) {
      summary.failures.push({ area: 'browserChecks', message: error.message });
    }
  } finally {
    await cleanup(config.apiKey, authUser, app);
  }

  console.log(JSON.stringify(summary, null, 2));

  const failedRoutes = summary.routes.filter((route) => !route.ok);
  if (!summary.browserLogin || failedRoutes.length > 0 || summary.pageErrors.length > 0 || summary.failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
