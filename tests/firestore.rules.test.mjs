import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  assertFails, assertSucceeds, initializeTestEnvironment
} from '@firebase/rules-unit-testing';
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getBytes, ref, uploadBytes } from 'firebase/storage';

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-gazra',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
    storage: { rules: readFileSync('storage.rules', 'utf8') }
  });
});

beforeEach(async () => env.clearFirestore());
after(async () => env.cleanup());

async function seed(path, data) {
  await env.withSecurityRulesDisabled((context) => setDoc(doc(context.firestore(), path), data));
}

test('public content remains readable', async () => {
  await seed('events/event-1', { title: 'Community event', status: 'approved' });
  const snapshot = await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), 'events/event-1')));
  assert.equal(snapshot.data().title, 'Community event');
});

test('direct public form and RSVP writes are denied', async () => {
  const db = env.unauthenticatedContext().firestore();
  for (const name of ['contactMessages', 'volunteers', 'supportRequests', 'newsletter', 'cafeBookings', 'skillsEnrollments', 'eventRsvps']) {
    await assertFails(addDoc(collection(db, name), { email: 'person@example.com' }));
  }
});

test('an authenticated non-admin cannot manage content', async () => {
  const db = env.authenticatedContext('ordinary-user').firestore();
  await assertFails(setDoc(doc(db, 'events/event-1'), { title: 'Unauthorized' }));
});

test('an admin document grants content management access', async () => {
  await seed('admins/admin-user', { role: 'admin' });
  const db = env.authenticatedContext('admin-user').firestore();
  await assertSucceeds(setDoc(doc(db, 'events/event-1'), { title: 'Authorized' }));
  await assertSucceeds(updateDoc(doc(db, 'events/event-1'), { title: 'Updated' }));
});

test('resource view updates cannot alter protected fields', async () => {
  await seed('resources/resource-1', { title: 'Safe title', viewCount: 1 });
  const ref = doc(env.unauthenticatedContext().firestore(), 'resources/resource-1');
  await assertSucceeds(updateDoc(ref, { viewCount: 2 }));
  await assertFails(updateDoc(ref, { title: 'Tampered', viewCount: 3 }));
});

test('OTP and rate-limit records are never client accessible', async () => {
  await seed('emailOtpVerifications/otp-1', { status: 'verified' });
  await seed('_rateLimits/rate-1', { count: 1 });
  const db = env.authenticatedContext('admin-user').firestore();
  await assertFails(getDoc(doc(db, 'emailOtpVerifications/otp-1')));
  await assertFails(getDoc(doc(db, '_rateLimits/rate-1')));
});

test('admins can upload event, event-location, and blog images', async () => {
  await seed('admins/storage-admin', { role: 'admin' });
  const storage = env.authenticatedContext('storage-admin').storage();
  const bytes = new Uint8Array([137, 80, 78, 71]);
  for (const path of ['events/test.png', 'eventLocations/test.png', 'blogs/test.png']) {
    await assertSucceeds(uploadBytes(ref(storage, path), bytes, { contentType: 'image/png' }));
  }
});

test('non-admin image uploads and all direct private-resume access are denied', async () => {
  const bytes = new Uint8Array([137, 80, 78, 71]);
  await assertFails(uploadBytes(
    ref(env.authenticatedContext('ordinary-user').storage(), 'events/test.png'),
    bytes,
    { contentType: 'image/png' }
  ));
  await assertFails(getBytes(ref(
    env.authenticatedContext('ordinary-user').storage(),
    'private/volunteer-resumes/resume.pdf'
  )));
});
