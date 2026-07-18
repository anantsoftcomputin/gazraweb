# Security and Deployment Runbook

## Safe rollout order

Public Firestore creates are intentionally denied by the new rules. Deploy in
this order so the callable replacements exist before those rules become live:

1. `firebase deploy --only functions`
2. Confirm `health`, `submitPublicForm`, `createEventRsvp`, and
   `uploadAdminFile` in the Firebase console.
3. `firebase deploy --only firestore:rules,firestore:indexes,storage`
4. Deploy the Next.js frontend to Netlify.
5. Run `npm run test:e2e` against the deployed URL or complete the equivalent
   contact, booking, volunteer, newsletter, RSVP, and admin-upload smoke tests.

`npm run deploy:backend` implements steps 1 and 3 in the correct order.

## Firebase App Check

1. Register the web app with Firebase App Check using reCAPTCHA Enterprise.
2. Add the production, Netlify preview, and localhost domains as appropriate.
3. Set `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY` in Netlify.
4. Deploy the frontend while `ENFORCE_APP_CHECK=false`.
5. Confirm valid App Check requests appear in Firebase metrics.
6. Set `ENFORCE_APP_CHECK=true` for the Functions deployment environment and
   redeploy Functions.

Keeping enforcement off during the first frontend rollout prevents existing
sessions and cached frontend bundles from being cut off.

## Storage troubleshooting

Event, event-location, and blog image paths are explicitly covered by
`storage.rules`. An authenticated user must also have `admins/{uid}`. The
frontend first attempts a normal Firebase Storage upload and retries through
the admin-only `uploadAdminFile` callable when Storage returns an authorization
error.

New volunteer resumes are stored under `private/volunteer-resumes`. Client
Storage access is denied. Admins receive a ten-minute signed URL from
`getPrivateResume`, which streams the document only after an admin check. Deleting
the volunteer record also deletes its resume.

## Verification

```bash
npm ci
npm run lint
npm run test:rules
npx playwright install chromium
npm run test:e2e
npm run build
```
