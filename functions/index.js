const { onRequest, onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const crypto = require('crypto');

admin.initializeApp();

const db = admin.firestore();
const region = 'us-central1';
const smtpPassword = defineSecret('SMTP_PASS');

const emailSecrets = [smtpPassword];
const otpTtlMs = 10 * 60 * 1000;
const enforceAppCheck = process.env.ENFORCE_APP_CHECK === 'true';
const callableOptions = { region, enforceAppCheck };
const callableEmailOptions = { region, secrets: emailSecrets, enforceAppCheck };
const publicSubmissionCollections = {
  contact: 'contactMessages',
  volunteer: 'volunteers',
  support: 'supportRequests',
  newsletter: 'newsletter',
  cafeBooking: 'cafeBookings',
  skillsEnrollment: 'skillsEnrollments'
};

function cleanString(value, maxLength = 500) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function cleanStringArray(value, maxItems = 20, maxLength = 120) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => cleanString(item, maxLength)).filter(Boolean);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function required(value, field) {
  if (!value) throw new HttpsError('invalid-argument', `${field} is required.`);
  return value;
}

function sanitizePublicSubmission(type, input = {}) {
  const email = cleanString(input.email, 254).toLowerCase();

  if (type === 'newsletter') {
    if (!validEmail(email)) throw new HttpsError('invalid-argument', 'Enter a valid email address.');
    return { email, source: cleanString(input.source, 80) || 'website' };
  }

  if (type === 'contact') {
    required(cleanString(input.name, 120), 'Name');
    if (!validEmail(email)) throw new HttpsError('invalid-argument', 'Enter a valid email address.');
    return {
      name: cleanString(input.name, 120), email, phone: cleanString(input.phone, 30),
      subject: required(cleanString(input.subject, 180), 'Subject'),
      message: required(cleanString(input.message, 4000), 'Message'), status: 'new'
    };
  }

  if (type === 'cafeBooking') {
    const date = required(cleanString(input.date, 10), 'Date');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new HttpsError('invalid-argument', 'Enter a valid booking date.');
    if (!validEmail(email)) throw new HttpsError('invalid-argument', 'Enter a valid email address.');
    const partySize = Math.min(Math.max(Number.parseInt(input.partySize, 10) || 1, 1), 30);
    return {
      name: required(cleanString(input.name, 120), 'Name'), email,
      phone: required(cleanString(input.phone, 30), 'Phone'), date,
      time: required(cleanString(input.time, 20), 'Time'), partySize: String(partySize),
      specialRequests: cleanString(input.specialRequests, 1000), status: 'pending',
      phoneVerified: input.phoneVerified === true
    };
  }

  if (type === 'skillsEnrollment') {
    if (!validEmail(email)) throw new HttpsError('invalid-argument', 'Enter a valid email address.');
    return {
      fullName: required(cleanString(input.fullName, 120), 'Full name'), email,
      phoneNumber: required(cleanString(input.phoneNumber, 30), 'Phone'),
      dateOfBirth: cleanString(input.dateOfBirth, 20), address: cleanString(input.address, 500),
      education: cleanString(input.education, 160), gender: cleanString(input.gender, 80),
      courseSelected: required(cleanString(input.courseSelected, 180), 'Course'),
      batchTiming: cleanString(input.batchTiming, 120), priorExperience: cleanString(input.priorExperience, 120),
      experienceDetails: cleanString(input.experienceDetails, 1000), employmentStatus: cleanString(input.employmentStatus, 120),
      motivation: cleanString(input.motivation, 2000), heardFrom: cleanString(input.heardFrom, 160),
      accommodations: cleanString(input.accommodations, 1000), commitment: cleanString(input.commitment, 120),
      commitmentDetails: cleanString(input.commitmentDetails, 1000), status: 'pending'
    };
  }

  if (type === 'volunteer') {
    if (!validEmail(email)) throw new HttpsError('invalid-argument', 'Enter a valid email address.');
    return {
      name: required(cleanString(input.name, 120), 'Name'), email,
      phone: required(cleanString(input.phone, 30), 'Phone'),
      contributions: cleanStringArray(input.contributions), otherContribution: cleanString(input.otherContribution, 500),
      availability: cleanStringArray(input.availability), experienceLevel: cleanString(input.experienceLevel, 120),
      message: cleanString(input.message, 3000), selectedRole: cleanString(input.selectedRole, 160) || 'Not specified',
      status: 'pending'
    };
  }

  if (type === 'support') {
    if (!validEmail(email)) throw new HttpsError('invalid-argument', 'Enter a valid email address.');
    return {
      fullName: required(cleanString(input.fullName, 120), 'Full name'), email,
      age: cleanString(input.age, 3), gender: cleanString(input.gender, 80),
      phoneNumber: required(cleanString(input.phoneNumber, 30), 'Phone'), address: cleanString(input.address, 500),
      city: cleanString(input.city, 120), state: cleanString(input.state, 120), pincode: cleanString(input.pincode, 10),
      supportType: required(cleanString(input.supportType, 160), 'Support type'),
      supportDescription: required(cleanString(input.supportDescription, 4000), 'Support description'),
      amountRequested: cleanString(input.amountRequested, 40), urgencyLevel: cleanString(input.urgencyLevel, 80),
      previousAssistance: cleanString(input.previousAssistance, 1000), employmentStatus: cleanString(input.employmentStatus, 120),
      monthlyIncome: cleanString(input.monthlyIncome, 40), dependents: cleanString(input.dependents, 20),
      householdSize: cleanString(input.householdSize, 20), medicalConditions: cleanString(input.medicalConditions, 2000),
      currentChallenges: cleanString(input.currentChallenges, 3000), declaration: input.declaration === true,
      status: 'pending'
    };
  }

  throw new HttpsError('invalid-argument', 'Unsupported submission type.');
}

async function enforceRateLimit(request, action, limit = 8, windowMs = 60 * 60 * 1000) {
  const ip = request.rawRequest?.ip || request.rawRequest?.headers?.['x-forwarded-for'] || 'unknown';
  const identity = request.auth?.uid || String(ip).split(',')[0].trim();
  const key = crypto.createHash('sha256').update(`${action}:${identity}`).digest('hex');
  const ref = db.collection('_rateLimits').doc(key);
  const now = Date.now();

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data() || {};
    const windowStartedAt = data.windowStartedAt?.toMillis?.() || 0;
    const activeWindow = now - windowStartedAt < windowMs;
    const count = activeWindow ? Number(data.count || 0) : 0;
    if (count >= limit) throw new HttpsError('resource-exhausted', 'Too many requests. Please try again later.');
    transaction.set(ref, {
      action, count: count + 1,
      windowStartedAt: activeWindow ? data.windowStartedAt : admin.firestore.Timestamp.fromMillis(now),
      expiresAt: admin.firestore.Timestamp.fromMillis(now + windowMs * 2),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
}

async function requireAdmin(request) {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in is required.');
  const adminDoc = await db.collection('admins').doc(request.auth.uid).get();
  if (!adminDoc.exists) throw new HttpsError('permission-denied', 'Admin access is required.');
  return request.auth.uid;
}

function publicDownloadUrl(bucketName, objectPath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

function getSmtpConfig() {
  // Rebind point: bump this comment to force Cloud Functions to re-resolve SMTP_PASS to its latest secret version.
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || 'support@gazra.org';
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || smtpPassword.value();

  return {
    host: process.env.SMTP_HOST || 'gazra.org',
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: user && pass ? { user, pass } : null,
    from: process.env.SMTP_FROM || `Project Gazra <${user}>`,
    replyTo: process.env.SMTP_REPLY_TO || user,
    adminEmail: process.env.EVENT_ADMIN_EMAIL || user
  };
}

function canSendEmail() {
  const config = getSmtpConfig();
  return Boolean(config.host && config.auth?.user && config.auth?.pass);
}

function createTransporter() {
  const config = getSmtpConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function createOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashOtp({ email, code, verificationId }) {
  return crypto
    .createHash('sha256')
    .update(`${normalizeEmail(email)}:${verificationId}:${code}`)
    .digest('hex');
}

function otpHtml({ name, code, eventTitle }) {
  return emailShell({
    eyebrow: 'Email Verification',
    title: 'Your RSVP verification code',
    intro: `Hi ${name || 'there'}, use this code to verify your email for ${eventTitle || 'the event'}.`,
    body: `<div style="background:#f6f3ef;border:1px solid #eadfd1;border-radius:14px;padding:22px;text-align:center;margin:18px 0;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#777;margin-bottom:10px;">One-time code</div>
        <div style="font-size:36px;letter-spacing:8px;font-weight:bold;color:#134e4a;">${escapeHtml(code)}</div>
        <div style="font-size:13px;color:#777;margin-top:12px;">This code expires in 10 minutes.</div>
      </div>
      <p style="font-size:15px;line-height:1.6;color:#444;">If you did not request this RSVP verification, you can ignore this email.</p>`,
    ctaLabel: 'Open Gazra',
    ctaUrl: process.env.SITE_URL || 'https://gazra.org',
    footerNote: 'For your security, do not share this code with anyone.'
  });
}

async function sendOtpEmail({ email, name, code, eventTitle }) {
  if (!canSendEmail()) {
    throw new HttpsError('failed-precondition', 'Email delivery is not configured yet.');
  }

  const config = getSmtpConfig();
  const subject = `Your Gazra RSVP verification code: ${code}`;
  await createTransporter().sendMail({
    from: config.from,
    replyTo: config.replyTo,
    to: email,
    subject,
    html: otpHtml({ name, code, eventTitle }),
    text: `${subject}

Hi ${name || 'there'},

Use this code to verify your email for ${eventTitle || 'the event'}:

${code}

This code expires in 10 minutes.

Project Gazra`
  });
}

function eventDateTime(rsvp) {
  const rawDate = rsvp.eventDate || rsvp.dateIso || rsvp.date;
  if (!rawDate) return null;

  const rawTime = rsvp.eventTime || rsvp.time || '00:00';
  const normalizedTime = rawTime
    .replace(/\s+/g, ' ')
    .replace(/(\d)(AM|PM)$/i, '$1 $2')
    .trim();
  const candidate = new Date(`${rawDate} ${normalizedTime}`);
  if (!Number.isNaN(candidate.getTime())) return candidate;

  const dateOnly = new Date(rawDate);
  return Number.isNaN(dateOnly.getTime()) ? null : dateOnly;
}

function checkInPayload(rsvp) {
  return JSON.stringify({
    type: 'gazra-event-rsvp',
    eventId: rsvp.eventId || '',
    rsvpId: rsvp.rsvpId || '',
    qrToken: rsvp.qrToken || ''
  });
}

function eventUrl(rsvp) {
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://gazraweb.netlify.app';
  return rsvp.eventId ? `${baseUrl.replace(/\/$/, '')}/events/${encodeURIComponent(rsvp.eventId)}` : baseUrl;
}

function emailShell({ eyebrow, title, intro, body, ctaLabel, ctaUrl, footerNote }) {
  const safeCtaUrl = escapeHtml(ctaUrl || 'https://gazra.org');
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f6f3ef;font-family:Arial,Helvetica,sans-serif;color:#222;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ef;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #eadfd1;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#134e4a;padding:24px 28px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:.78;">${escapeHtml(eyebrow)}</div>
                <h1 style="margin:8px 0 0;font-size:26px;line-height:1.25;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="font-size:16px;line-height:1.6;margin:0 0 20px;">${escapeHtml(intro)}</p>
                ${body}
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                  <tr>
                    <td style="border-radius:10px;background:#d97706;">
                      <a href="${safeCtaUrl}" style="display:inline-block;padding:13px 20px;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:10px;">${escapeHtml(ctaLabel)}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#666;">${escapeHtml(footerNote || 'For any questions, reply to this email and the Gazra team will help you.')}</p>
              </td>
            </tr>
            <tr>
              <td style="background:#faf8f5;border-top:1px solid #eadfd1;padding:18px 28px;font-size:12px;color:#777;">
                Project Gazra · support@gazra.org
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailsTable(rsvp) {
  const details = [
    ['Event', rsvp.eventTitle || 'Project Gazra event'],
    ['Date', rsvp.eventDate || 'To be announced'],
    ['Time', rsvp.eventTime || 'To be announced'],
    ['Location', rsvp.location || 'To be announced'],
    ['Ticket ID', rsvp.rsvpId || rsvp.id || '']
  ];

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfd1;border-radius:12px;overflow:hidden;margin:18px 0;">
    ${details.map(([label, value], index) => `
      <tr>
        <td style="width:120px;background:${index % 2 ? '#ffffff' : '#faf8f5'};padding:12px 14px;color:#666;font-size:13px;border-bottom:1px solid #f1e8dd;">${escapeHtml(label)}</td>
        <td style="background:${index % 2 ? '#ffffff' : '#faf8f5'};padding:12px 14px;color:#222;font-size:14px;border-bottom:1px solid #f1e8dd;"><strong>${escapeHtml(value)}</strong></td>
      </tr>
    `).join('')}
  </table>`;
}

function tokenBlock(rsvp) {
  return `<div style="background:#f6f3ef;border:1px dashed #d8c8b5;border-radius:12px;padding:14px;margin-top:18px;">
    <div style="font-size:12px;text-transform:uppercase;color:#777;margin-bottom:8px;">Check-in QR payload</div>
    <div style="font-family:Consolas,Monaco,monospace;font-size:12px;line-height:1.5;word-break:break-all;color:#333;">${escapeHtml(checkInPayload(rsvp))}</div>
  </div>`;
}

function attendeeQrBlock(rsvp, qrCid) {
  if (!qrCid) return tokenBlock(rsvp);

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;">
    <tr>
      <td align="center" style="background:#f6f3ef;border:1px solid #eadfd1;border-radius:14px;padding:18px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.8px;color:#777;margin-bottom:12px;">Your check-in QR code</div>
        <img src="cid:${escapeHtml(qrCid)}" width="220" height="220" alt="RSVP check-in QR code" style="display:block;width:220px;height:220px;border:8px solid #ffffff;border-radius:12px;background:#ffffff;" />
        <div style="font-size:12px;color:#777;margin-top:12px;">Ticket ID: ${escapeHtml(rsvp.rsvpId || rsvp.id || '')}</div>
      </td>
    </tr>
  </table>`;
}

function confirmationHtml(rsvp, options = {}) {
  return emailShell({
    eyebrow: 'RSVP Confirmed',
    title: `You are confirmed for ${rsvp.eventTitle || 'our event'}`,
    intro: `Hi ${rsvp.name || 'there'}, thank you for RSVPing. Your spot has been confirmed.`,
    body: `${detailsTable(rsvp)}
      <p style="font-size:15px;line-height:1.6;color:#444;">Please keep this RSVP QR code ready at arrival. The team will scan it at check-in.</p>
      ${attendeeQrBlock(rsvp, options.qrCid)}`,
    ctaLabel: 'Open Event Page',
    ctaUrl: eventUrl(rsvp),
    footerNote: 'If your plans change, reply to this email so the Gazra team can update the event list.'
  });
}

function reminderHtml(rsvp, options = {}) {
  return emailShell({
    eyebrow: 'Event Reminder',
    title: `${rsvp.eventTitle || 'Your Gazra event'} is coming up`,
    intro: `Hi ${rsvp.name || 'there'}, this is a reminder for the event you RSVPed to.`,
    body: `${detailsTable(rsvp)}
      <p style="font-size:15px;line-height:1.6;color:#444;">Please arrive a few minutes early and keep this QR code ready for a quick check-in.</p>
      ${attendeeQrBlock(rsvp, options.qrCid)}`,
    ctaLabel: 'View Event Details',
    ctaUrl: eventUrl(rsvp),
    footerNote: 'We look forward to seeing you there.'
  });
}

function checkInHtml(rsvp) {
  return emailShell({
    eyebrow: 'Attendance Confirmed',
    title: `Checked in for ${rsvp.eventTitle || 'Project Gazra event'}`,
    intro: `Hi ${rsvp.name || 'there'}, your attendance has been marked successfully.`,
    body: `${detailsTable(rsvp)}
      <p style="font-size:15px;line-height:1.6;color:#444;">Thank you for joining us. We hope the event is meaningful and useful for you.</p>`,
    ctaLabel: 'Explore Gazra',
    ctaUrl: process.env.SITE_URL || 'https://gazra.org',
    footerNote: 'Thank you for being part of the Gazra community.'
  });
}

function bookingDecisionHtml(booking) {
  const approved = booking.status === 'approved';
  return emailShell({
    eyebrow: approved ? 'Location Booking Approved' : 'Location Booking Not Approved',
    title: `${booking.eventTitle || 'Your event'} at ${booking.locationName || 'the requested location'} ${approved ? 'is approved' : 'was not approved'}`,
    intro: `Hi ${booking.requesterName || 'there'}, your location booking request has been reviewed.`,
    body: `${detailsTable({
      eventTitle: booking.eventTitle || 'Requested event',
      eventDate: booking.dateIso || booking.date || 'To be announced',
      eventTime: `${booking.startTime || ''}${booking.endTime ? ` - ${booking.endTime}` : ''}`.trim() || 'To be announced',
      location: booking.locationName || 'To be announced',
      rsvpId: booking.id || ''
    })}
      ${booking.decisionNote ? `<p style="font-size:15px;line-height:1.6;color:#444;"><strong>Note:</strong> ${escapeHtml(booking.decisionNote)}</p>` : ''}
      <p style="font-size:15px;line-height:1.6;color:#444;">${approved ? 'The event can now be published and accepted for RSVPs.' : 'Please coordinate with the event management team before sharing this event publicly.'}</p>`,
    ctaLabel: 'Open Events Admin',
    ctaUrl: `${(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://gazraweb.netlify.app').replace(/\/$/, '')}/admin/events`,
    footerNote: 'This message was generated by the Project Gazra location booking workflow.'
  });
}

function eventCancellationHtml(rsvp) {
  return emailShell({
    eyebrow: 'Event Cancelled',
    title: `${rsvp.eventTitle || 'Project Gazra event'} has been cancelled`,
    intro: `Hi ${rsvp.name || 'there'}, we are sorry to inform you that this event has been cancelled.`,
    body: `${detailsTable(rsvp)}
      <p style="font-size:15px;line-height:1.6;color:#444;">Your RSVP is no longer active. If the event is rescheduled, the Gazra team will share fresh details.</p>`,
    ctaLabel: 'View Other Events',
    ctaUrl: `${(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://gazraweb.netlify.app').replace(/\/$/, '')}/events`,
    footerNote: 'For questions, reply to this email and the Gazra team will help.'
  });
}

function registrationCancellationHtml(rsvp) {
  return emailShell({
    eyebrow: 'Registration Cancelled',
    title: `Your registration for ${rsvp.eventTitle || 'Project Gazra event'} has been cancelled`,
    intro: `Hi ${rsvp.name || 'there'}, your RSVP registration has been cancelled by the event team.`,
    body: `${detailsTable(rsvp)}
      ${rsvp.cancellationReason ? `<p style="font-size:15px;line-height:1.6;color:#444;"><strong>Reason:</strong> ${escapeHtml(rsvp.cancellationReason)}</p>` : ''}
      <p style="font-size:15px;line-height:1.6;color:#444;">This QR code will no longer be accepted at check-in.</p>`,
    ctaLabel: 'View Events',
    ctaUrl: `${(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://gazraweb.netlify.app').replace(/\/$/, '')}/events`,
    footerNote: 'For questions, reply to this email and the Gazra team will help.'
  });
}

function emailSubject(rsvp, type) {
  if (type === 'event_cancelled') return `Cancelled: ${rsvp.eventTitle || 'Project Gazra event'}`;
  if (type === 'registration_cancelled') return `Registration cancelled: ${rsvp.eventTitle || 'Project Gazra event'}`;
  if (type === 'reminder') return `Reminder: ${rsvp.eventTitle || 'Project Gazra event'}`;
  if (type === 'checkin') return `Checked in: ${rsvp.eventTitle || 'Project Gazra event'}`;
  return `RSVP confirmed: ${rsvp.eventTitle || 'Project Gazra event'}`;
}

function emailHtml(rsvp, type, options = {}) {
  if (type === 'event_cancelled') return eventCancellationHtml(rsvp);
  if (type === 'registration_cancelled') return registrationCancellationHtml(rsvp);
  if (type === 'reminder') return reminderHtml(rsvp, options);
  if (type === 'checkin') return checkInHtml(rsvp);
  return confirmationHtml(rsvp, options);
}

async function queueEmail({ rsvp, type, status, error = '', to = '' }) {
  await db.collection('mailQueue').add({
    type,
    to: to || rsvp.email || '',
    eventId: rsvp.eventId || '',
    rsvpId: rsvp.rsvpId || '',
    runId: rsvp.runId || '',
    status,
    error,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

async function createQrAttachment(rsvp) {
  const payload = checkInPayload(rsvp);
  const buffer = await QRCode.toBuffer(payload, {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 440
  });
  const cid = `rsvp-${rsvp.rsvpId || rsvp.id || Date.now()}@gazra`;

  return {
    qrCid: cid,
    attachment: {
      filename: `gazra-rsvp-${rsvp.rsvpId || 'ticket'}.png`,
      content: buffer,
      contentType: 'image/png',
      cid
    }
  };
}

function shouldAttachQr(type) {
  return type === 'confirmation' || type === 'reminder';
}

function isActiveRsvp(rsvp = {}) {
  return (rsvp.status || 'confirmed') === 'confirmed';
}

async function sendRsvpEmail(rsvp, type) {
  if (!rsvp.email) {
    await queueEmail({ rsvp, type, status: 'skipped', error: 'Missing recipient email' });
    return { sent: false, status: 'skipped' };
  }

  if (!canSendEmail()) {
    await queueEmail({ rsvp, type, status: 'pending_smtp_config' });
    return { sent: false, status: 'pending_smtp_config' };
  }

  const config = getSmtpConfig();
  const subject = emailSubject(rsvp, type);
  const qr = shouldAttachQr(type) ? await createQrAttachment(rsvp) : null;
  const textQrLine = qr
    ? `Your QR code is attached as gazra-rsvp-${rsvp.rsvpId || 'ticket'}.png.`
    : type === 'checkin'
      ? 'Your attendance has been marked successfully.'
      : 'This registration QR code is no longer active.';
  await createTransporter().sendMail({
    from: config.from,
    replyTo: config.replyTo,
    to: rsvp.email,
    subject,
    html: emailHtml(rsvp, type, { qrCid: qr?.qrCid }),
    attachments: qr ? [qr.attachment] : [],
    text: `${subject}

Hi ${rsvp.name || 'there'},

Event: ${rsvp.eventTitle || 'Project Gazra event'}
Date: ${rsvp.eventDate || 'To be announced'}
Time: ${rsvp.eventTime || 'To be announced'}
Location: ${rsvp.location || 'To be announced'}
Ticket: ${rsvp.rsvpId || ''}
Event page: ${eventUrl(rsvp)}
${textQrLine}

Project Gazra`
  });

  await queueEmail({ rsvp, type, status: 'sent' });
  return { sent: true, status: 'sent' };
}

function adminRsvpHtml(rsvp) {
  return emailShell({
    eyebrow: 'New RSVP',
    title: `New RSVP for ${rsvp.eventTitle || 'Project Gazra event'}`,
    intro: `${rsvp.name || 'Someone'} just RSVPed to an event.`,
    body: `${detailsTable(rsvp)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfd1;border-radius:12px;overflow:hidden;margin:18px 0;">
        <tr>
          <td style="width:120px;background:#faf8f5;padding:12px 14px;color:#666;font-size:13px;border-bottom:1px solid #f1e8dd;">Name</td>
          <td style="background:#faf8f5;padding:12px 14px;color:#222;font-size:14px;border-bottom:1px solid #f1e8dd;"><strong>${escapeHtml(rsvp.name || 'Not provided')}</strong></td>
        </tr>
        <tr>
          <td style="width:120px;background:#ffffff;padding:12px 14px;color:#666;font-size:13px;border-bottom:1px solid #f1e8dd;">Email</td>
          <td style="background:#ffffff;padding:12px 14px;color:#222;font-size:14px;border-bottom:1px solid #f1e8dd;"><strong>${escapeHtml(rsvp.email || 'Not provided')}</strong></td>
        </tr>
        <tr>
          <td style="width:120px;background:#faf8f5;padding:12px 14px;color:#666;font-size:13px;">Phone</td>
          <td style="background:#faf8f5;padding:12px 14px;color:#222;font-size:14px;"><strong>${escapeHtml(rsvp.phone || 'Not provided')}</strong></td>
        </tr>
      </table>
      <p style="font-size:15px;line-height:1.6;color:#444;">Open the admin RSVP list to review this participant or mark attendance during check-in.</p>`,
    ctaLabel: 'Open Admin Events',
    ctaUrl: `${(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://gazraweb.netlify.app').replace(/\/$/, '')}/admin/events`,
    footerNote: 'This admin notification was sent because a new event RSVP was created.'
  });
}

async function sendAdminRsvpNotification(rsvp) {
  if (!canSendEmail()) {
    await queueEmail({ rsvp, type: 'admin_rsvp', status: 'pending_smtp_config', to: getSmtpConfig().adminEmail });
    return { sent: false, status: 'pending_smtp_config' };
  }

  const config = getSmtpConfig();
  const to = config.adminEmail;
  if (!to) {
    await queueEmail({ rsvp, type: 'admin_rsvp', status: 'skipped', error: 'Missing admin recipient email' });
    return { sent: false, status: 'skipped' };
  }

  const subject = `New RSVP: ${rsvp.eventTitle || 'Project Gazra event'} - ${rsvp.name || rsvp.email || 'Guest'}`;
  await createTransporter().sendMail({
    from: config.from,
    replyTo: rsvp.email || config.replyTo,
    to,
    subject,
    html: adminRsvpHtml(rsvp),
    text: `${subject}

Event: ${rsvp.eventTitle || 'Project Gazra event'}
Date: ${rsvp.eventDate || 'To be announced'}
Time: ${rsvp.eventTime || 'To be announced'}
Location: ${rsvp.location || 'To be announced'}

Name: ${rsvp.name || 'Not provided'}
Email: ${rsvp.email || 'Not provided'}
Phone: ${rsvp.phone || 'Not provided'}
Ticket: ${rsvp.rsvpId || ''}

Admin: ${(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://gazraweb.netlify.app').replace(/\/$/, '')}/admin/events

Project Gazra`
  });

  await queueEmail({ rsvp, type: 'admin_rsvp', status: 'sent', to });
  return { sent: true, status: 'sent' };
}

async function sendBookingDecisionEmail(booking) {
  if (!booking.requesterEmail) {
    await queueEmail({ rsvp: booking, type: 'location_booking_decision', status: 'skipped', error: 'Missing requester email' });
    return { sent: false, status: 'skipped' };
  }

  if (!canSendEmail()) {
    await queueEmail({ rsvp: booking, type: 'location_booking_decision', status: 'pending_smtp_config', to: booking.requesterEmail });
    return { sent: false, status: 'pending_smtp_config' };
  }

  const config = getSmtpConfig();
  const approved = booking.status === 'approved';
  const subject = `${approved ? 'Approved' : 'Not approved'}: ${booking.eventTitle || 'Location booking request'} at ${booking.locationName || 'Gazra location'}`;
  await createTransporter().sendMail({
    from: config.from,
    replyTo: config.replyTo,
    to: booking.requesterEmail,
    subject,
    html: bookingDecisionHtml(booking),
    text: `${subject}

Event: ${booking.eventTitle || 'Requested event'}
Date: ${booking.dateIso || booking.date || 'To be announced'}
Time: ${booking.startTime || 'To be announced'}${booking.endTime ? ` - ${booking.endTime}` : ''}
Location: ${booking.locationName || 'To be announced'}
Status: ${booking.status}
${booking.decisionNote ? `Note: ${booking.decisionNote}` : ''}

Project Gazra`
  });

  await queueEmail({ rsvp: booking, type: 'location_booking_decision', status: 'sent', to: booking.requesterEmail });
  return { sent: true, status: 'sent' };
}

async function sendRsvpCancellationEmail(rsvp, type) {
  return sendRsvpEmail(rsvp, type);
}

/* ── Generic form-submission notifications (volunteer, support fund, skills, cafe bookings, contact) ── */

function adminUrl(path) {
  return `${(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://gazraweb.netlify.app').replace(/\/$/, '')}${path}`;
}

function genericFieldsTable(fields) {
  const rows = fields.filter(([, value]) => value !== undefined && value !== null && value !== '');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfd1;border-radius:12px;overflow:hidden;margin:18px 0;">
    ${rows.map(([label, value], index) => `
      <tr>
        <td style="width:160px;background:${index % 2 ? '#ffffff' : '#faf8f5'};padding:12px 14px;color:#666;font-size:13px;border-bottom:1px solid #f1e8dd;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="background:${index % 2 ? '#ffffff' : '#faf8f5'};padding:12px 14px;color:#222;font-size:14px;border-bottom:1px solid #f1e8dd;"><strong>${escapeHtml(String(value))}</strong></td>
      </tr>
    `).join('')}
  </table>`;
}

function fieldsText(fields) {
  return fields.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join('\n');
}

async function sendFormAdminNotification({ formLabel, fields, recipientName, recipientEmail, adminCtaPath, logType }) {
  if (!canSendEmail()) {
    await queueEmail({ rsvp: { email: recipientEmail }, type: logType, status: 'pending_smtp_config', to: getSmtpConfig().adminEmail });
    return { sent: false, status: 'pending_smtp_config' };
  }

  const config = getSmtpConfig();
  const to = config.adminEmail;
  if (!to) {
    await queueEmail({ rsvp: { email: recipientEmail }, type: logType, status: 'skipped', error: 'Missing admin recipient email' });
    return { sent: false, status: 'skipped' };
  }

  const subject = `New ${formLabel}: ${recipientName || recipientEmail || 'Guest'}`;
  const html = emailShell({
    eyebrow: `New ${formLabel}`,
    title: `New ${formLabel} submission`,
    intro: `${recipientName || 'Someone'} just submitted the ${formLabel} form.`,
    body: genericFieldsTable(fields),
    ctaLabel: 'Open Admin Dashboard',
    ctaUrl: adminUrl(adminCtaPath),
    footerNote: `This admin notification was sent because a new ${formLabel} entry was created.`
  });
  const text = `${subject}\n\n${fieldsText(fields)}\n\nAdmin: ${adminUrl(adminCtaPath)}\n\nProject Gazra`;

  await createTransporter().sendMail({ from: config.from, replyTo: recipientEmail || config.replyTo, to, subject, html, text });
  await queueEmail({ rsvp: { email: recipientEmail }, type: logType, status: 'sent', to });
  return { sent: true, status: 'sent' };
}

async function sendFormConfirmationEmail({ formLabel, fields, recipientName, recipientEmail, confirmationIntro, logType }) {
  if (!recipientEmail) {
    return { sent: false, status: 'skipped' };
  }

  if (!canSendEmail()) {
    await queueEmail({ rsvp: { email: recipientEmail }, type: logType, status: 'pending_smtp_config' });
    return { sent: false, status: 'pending_smtp_config' };
  }

  const config = getSmtpConfig();
  const subject = `We received your ${formLabel.toLowerCase()} submission`;
  const intro = confirmationIntro || `We've received your ${formLabel.toLowerCase()} submission and the Gazra team will be in touch soon.`;
  const html = emailShell({
    eyebrow: formLabel,
    title: `Thanks, ${recipientName || 'there'}!`,
    intro,
    body: genericFieldsTable(fields),
    ctaLabel: 'Visit Gazra',
    ctaUrl: process.env.SITE_URL || 'https://gazra.org',
    footerNote: 'If anything here looks incorrect, reply to this email and we will update it.'
  });
  const text = `${subject}\n\nHi ${recipientName || 'there'},\n\n${intro}\n\n${fieldsText(fields)}\n\nProject Gazra`;

  await createTransporter().sendMail({ from: config.from, replyTo: config.replyTo, to: recipientEmail, subject, html, text });
  await queueEmail({ rsvp: { email: recipientEmail }, type: logType, status: 'sent', to: recipientEmail });
  return { sent: true, status: 'sent' };
}

function registerSubmissionNotifications({ exportName, collectionPath, formLabel, adminCtaPath, buildFields, getEmail, getName, confirmationIntro }) {
  const logSlug = formLabel.toLowerCase().replace(/\s+/g, '_');

  exports[exportName] = onDocumentCreated(
    { region, document: collectionPath, secrets: emailSecrets },
    async (event) => {
      const data = event.data?.data();
      if (!data) return;

      const fields = buildFields(data);
      const recipientEmail = getEmail(data);
      const recipientName = getName(data);
      const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };

      try {
        const result = await sendFormAdminNotification({
          formLabel, fields, recipientName, recipientEmail, adminCtaPath,
          logType: `${logSlug}_admin`
        });
        updates.adminNotificationStatus = result.status;
        updates.adminNotificationSentAt = result.sent ? admin.firestore.FieldValue.serverTimestamp() : null;
      } catch (error) {
        logger.error(`${formLabel} admin notification failed`, { error: error.message });
        updates.adminNotificationStatus = 'failed';
        updates.adminNotificationError = error.message;
      }

      try {
        const result = await sendFormConfirmationEmail({
          formLabel, fields, recipientName, recipientEmail, confirmationIntro,
          logType: `${logSlug}_confirmation`
        });
        updates.confirmationEmailStatus = result.status;
        updates.confirmationEmailSentAt = result.sent ? admin.firestore.FieldValue.serverTimestamp() : null;
      } catch (error) {
        logger.error(`${formLabel} confirmation email failed`, { error: error.message });
        updates.confirmationEmailStatus = 'failed';
        updates.confirmationEmailError = error.message;
      }

      await event.data.ref.update(updates);
    }
  );
}

registerSubmissionNotifications({
  exportName: 'onVolunteerApplicationCreated',
  collectionPath: 'volunteers/{docId}',
  formLabel: 'Volunteer Application',
  adminCtaPath: '/admin/volunteers',
  buildFields: (data) => [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Contribution areas', Array.isArray(data.contributions) ? data.contributions.join(', ') : data.contributions],
    ['Other contribution', data.otherContribution],
    ['Availability', Array.isArray(data.availability) ? data.availability.join(', ') : data.availability],
    ['Experience level', data.experienceLevel],
    ['Message', data.message]
  ],
  getEmail: (data) => data.email,
  getName: (data) => data.name,
  confirmationIntro: 'Thank you for offering to volunteer with Project Gazra. Our team will review your application and reach out soon.'
});

exports.onVolunteerApplicationDeleted = onDocumentDeleted(
  { region, document: 'volunteers/{docId}' },
  async (event) => {
    const resumePath = cleanString(event.data?.data()?.resumePath, 500);
    if (resumePath.startsWith('private/volunteer-resumes/')) {
      await admin.storage().bucket().file(resumePath).delete({ ignoreNotFound: true });
    }
  }
);

registerSubmissionNotifications({
  exportName: 'onSupportRequestCreated',
  collectionPath: 'supportRequests/{docId}',
  formLabel: 'Support Fund Request',
  adminCtaPath: '/admin/support-requests',
  buildFields: (data) => [
    ['Full name', data.fullName],
    ['Age', data.age],
    ['Gender', data.gender],
    ['Phone', data.phoneNumber],
    ['Email', data.email],
    ['Address', data.address],
    ['City', data.city],
    ['State', data.state],
    ['Pincode', data.pincode],
    ['Support type', data.supportType],
    ['Support description', data.supportDescription],
    ['Amount requested', data.amountRequested],
    ['Urgency level', data.urgencyLevel],
    ['Employment status', data.employmentStatus],
    ['Monthly income', data.monthlyIncome]
  ],
  getEmail: (data) => data.email,
  getName: (data) => data.fullName,
  confirmationIntro: 'We have received your support fund request. Our team will review it and contact you soon.'
});

registerSubmissionNotifications({
  exportName: 'onSkillsEnrollmentCreated',
  collectionPath: 'skillsEnrollments/{docId}',
  formLabel: 'Skill Hub Enrollment',
  adminCtaPath: '/admin/skills/enrollments',
  buildFields: (data) => [
    ['Full name', data.fullName],
    ['Email', data.email],
    ['Phone', data.phoneNumber],
    ['Course', data.courseSelected],
    ['Batch timing', data.batchTiming],
    ['Employment status', data.employmentStatus],
    ['Prior experience', data.priorExperience],
    ['Motivation', data.motivation]
  ],
  getEmail: (data) => data.email,
  getName: (data) => data.fullName,
  confirmationIntro: 'Thank you for enrolling in a Gazra Skill Hub course. Our team will confirm your seat soon.'
});

registerSubmissionNotifications({
  exportName: 'onCafeBookingCreated',
  collectionPath: 'cafeBookings/{docId}',
  formLabel: 'Cafe Table Booking',
  adminCtaPath: '/admin/cafe/bookings',
  buildFields: (data) => [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Date', data.date],
    ['Time', data.time],
    ['Party size', data.partySize],
    ['Special requests', data.specialRequests]
  ],
  getEmail: (data) => data.email,
  getName: (data) => data.name,
  confirmationIntro: 'Thank you for booking a table at Gazra Cafe. We look forward to hosting you.'
});

registerSubmissionNotifications({
  exportName: 'onContactMessageCreated',
  collectionPath: 'contactMessages/{docId}',
  formLabel: 'Contact Message',
  adminCtaPath: '/admin/messages',
  buildFields: (data) => [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Subject', data.subject],
    ['Message', data.message]
  ],
  getEmail: (data) => data.email,
  getName: (data) => data.name,
  confirmationIntro: "Thanks for reaching out to Project Gazra. We'll get back to you as soon as possible."
});

exports.health = onRequest({ region }, (request, response) => {
  logger.info('Health check requested', {
    method: request.method,
    path: request.path
  });

  response.status(200).json({
    ok: true,
    service: 'gazra-functions'
  });
});

exports.submitPublicForm = onCall(callableOptions, async (request) => {
  const type = cleanString(request.data?.type, 40);
  const collectionName = publicSubmissionCollections[type];
  if (!collectionName) throw new HttpsError('invalid-argument', 'Unsupported submission type.');

  await enforceRateLimit(request, `public:${type}`, type === 'newsletter' ? 5 : 8);
  const data = sanitizePublicSubmission(type, request.data?.data || {});

  if (type === 'volunteer' && request.data?.resume) {
    const resume = request.data.resume;
    const allowedTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]);
    const contentType = cleanString(resume.contentType, 120);
    if (!allowedTypes.has(contentType)) throw new HttpsError('invalid-argument', 'Resume must be a PDF or Word document.');

    let buffer;
    try {
      buffer = Buffer.from(String(resume.base64 || ''), 'base64');
    } catch {
      throw new HttpsError('invalid-argument', 'Resume file is invalid.');
    }
    if (!buffer.length || buffer.length > 5 * 1024 * 1024) {
      throw new HttpsError('invalid-argument', 'Resume must be smaller than 5 MB.');
    }

    const extension = contentType === 'application/pdf' ? 'pdf'
      : contentType === 'application/msword' ? 'doc' : 'docx';
    const objectPath = `private/volunteer-resumes/${crypto.randomUUID()}.${extension}`;
    await admin.storage().bucket().file(objectPath).save(buffer, {
      resumable: false,
      metadata: { contentType, cacheControl: 'private, max-age=0, no-store' }
    });
    data.resumePath = objectPath;
    data.resumeName = cleanString(resume.name, 180) || `resume.${extension}`;
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  const docRef = await db.collection(collectionName).add({ ...data, createdAt: now, updatedAt: now });
  return { success: true, id: docRef.id };
});

exports.createEventRsvp = onCall(callableEmailOptions, async (request) => {
  await enforceRateLimit(request, 'event:rsvp', 10);
  const input = request.data || {};
  const eventId = required(cleanString(input.eventId, 180), 'Event');
  const email = cleanString(input.email, 254).toLowerCase();
  const verificationId = required(cleanString(input.verificationId, 180), 'Verification');
  const verificationToken = required(cleanString(input.verificationToken, 180), 'Verification token');
  const name = required(cleanString(input.name, 120), 'Name');
  const phone = required(cleanString(input.phone, 30), 'Phone');
  if (!validEmail(email)) throw new HttpsError('invalid-argument', 'Enter a valid email address.');

  const eventRef = db.collection('events').doc(eventId);
  const verificationRef = db.collection('emailOtpVerifications').doc(verificationId);
  const rsvpDocId = crypto.createHash('sha256').update(`${eventId}:${email}`).digest('hex');
  const rsvpRef = db.collection('eventRsvps').doc(rsvpDocId);
  const rsvpId = crypto.randomUUID();
  const qrToken = crypto.randomUUID();

  await db.runTransaction(async (transaction) => {
    const [eventDoc, verificationDoc, existingRsvp] = await Promise.all([
      transaction.get(eventRef), transaction.get(verificationRef), transaction.get(rsvpRef)
    ]);
    if (!eventDoc.exists) throw new HttpsError('not-found', 'Event not found.');
    if (existingRsvp.exists && isActiveRsvp(existingRsvp.data())) {
      throw new HttpsError('already-exists', 'This email is already registered for the event.');
    }

    const eventData = eventDoc.data();
    if (!verificationDoc.exists) throw new HttpsError('permission-denied', 'Email verification is invalid or has already been used.');
    const verification = verificationDoc.data();
    if (verification.status !== 'verified' || verification.email !== email ||
        verification.verificationToken !== verificationToken || verification.eventId !== eventId) {
      throw new HttpsError('permission-denied', 'Email verification is invalid or has already been used.');
    }
    const verifiedAt = verification.verifiedAt?.toMillis?.() || 0;
    if (!verifiedAt || Date.now() - verifiedAt > otpTtlMs) {
      throw new HttpsError('deadline-exceeded', 'Email verification has expired. Request a new code.');
    }
    if ((eventData.status || 'approved') !== 'approved') {
      throw new HttpsError('failed-precondition', 'RSVPs are not open for this event.');
    }

    const capacity = Number(String(eventData.capacity || '').match(/\d+/)?.[0] || 0);
    const registrationCount = Number(eventData.registrationCount || 0);
    if (capacity > 0 && registrationCount >= capacity) {
      throw new HttpsError('resource-exhausted', 'This event is fully booked.');
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    transaction.set(rsvpRef, {
      rsvpId, qrToken, eventId, eventTitle: cleanString(eventData.title, 180),
      eventDate: cleanString(eventData.dateIso || eventData.date, 80), eventTime: cleanString(eventData.time, 80),
      location: cleanString(eventData.location, 300), locationId: cleanString(eventData.locationId, 180),
      name, email, phone, emailVerified: true, emailVerificationId: verificationId,
      status: 'confirmed', attendanceStatus: 'not_checked_in', checkedIn: false,
      reminderStatus: 'pending', countedAtCreation: true, createdAt: now, updatedAt: now
    });
    transaction.update(eventRef, {
      registrationCount: admin.firestore.FieldValue.increment(1), updatedAt: now
    });
    transaction.update(verificationRef, {
      status: 'consumed', consumedAt: now, rsvpDocId, updatedAt: now
    });
  });

  return { success: true, id: rsvpDocId, rsvpId, qrToken };
});

exports.uploadAdminFile = onCall(callableOptions, async (request) => {
  await requireAdmin(request);
  await enforceRateLimit(request, 'admin:upload', 200);
  const folder = cleanString(request.data?.folder, 80);
  const allowedFolders = new Set(['events', 'eventLocations', 'gallery', 'menu', 'cafeMoments', 'testimonials', 'instagram', 'initiatives', 'blogs']);
  if (!allowedFolders.has(folder)) throw new HttpsError('invalid-argument', 'Upload folder is not allowed.');

  const contentType = cleanString(request.data?.contentType, 120);
  if (!contentType.startsWith('image/')) throw new HttpsError('invalid-argument', 'Only image uploads are allowed.');
  const buffer = Buffer.from(String(request.data?.base64 || ''), 'base64');
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) throw new HttpsError('invalid-argument', 'Image must be smaller than 5 MB.');

  const safeName = cleanString(request.data?.name, 160).replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
  const objectPath = `${folder}/${Date.now()}_${safeName}`;
  const token = crypto.randomUUID();
  const bucket = admin.storage().bucket();
  await bucket.file(objectPath).save(buffer, {
    resumable: false,
    metadata: { contentType, cacheControl: 'public, max-age=31536000, immutable', metadata: { firebaseStorageDownloadTokens: token } }
  });
  return { success: true, path: objectPath, url: publicDownloadUrl(bucket.name, objectPath, token) };
});

exports.deleteAdminFile = onCall(callableOptions, async (request) => {
  await requireAdmin(request);
  const objectPath = cleanString(request.data?.path, 500);
  if (!objectPath || objectPath.startsWith('private/')) throw new HttpsError('invalid-argument', 'File path is not allowed.');
  await admin.storage().bucket().file(objectPath).delete({ ignoreNotFound: true });
  return { success: true };
});

exports.getPrivateResume = onCall(callableOptions, async (request) => {
  await requireAdmin(request);
  const volunteerId = required(cleanString(request.data?.volunteerId, 180), 'Volunteer');
  const volunteerDoc = await db.collection('volunteers').doc(volunteerId).get();
  if (!volunteerDoc.exists) throw new HttpsError('not-found', 'Volunteer application not found.');
  const resumePath = cleanString(volunteerDoc.data().resumePath, 500);
  if (!resumePath.startsWith('private/volunteer-resumes/')) throw new HttpsError('not-found', 'Resume not found.');
  const file = admin.storage().bucket().file(resumePath);
  const [[buffer], [metadata]] = await Promise.all([file.download(), file.getMetadata()]);
  return {
    base64: buffer.toString('base64'),
    contentType: cleanString(metadata.contentType, 120) || 'application/octet-stream',
    name: cleanString(volunteerDoc.data().resumeName, 180) || 'resume'
  };
});

exports.sendRsvpEmailOtp = onCall(
  callableEmailOptions,
  async (request) => {
    const email = normalizeEmail(request.data?.email);
    const name = String(request.data?.name || '').trim().slice(0, 120);
    const eventId = String(request.data?.eventId || '').trim();
    const eventTitle = String(request.data?.eventTitle || '').trim().slice(0, 180);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpsError('invalid-argument', 'Enter a valid email address.');
    }

    const recentSnapshot = await db.collection('emailOtpVerifications')
      .where('email', '==', email)
      .where('status', '==', 'pending')
      .limit(5)
      .get();

    const now = Date.now();
    const recentAttempts = recentSnapshot.docs.filter((docSnap) => {
      const createdAt = docSnap.data().createdAt?.toMillis?.() || 0;
      return now - createdAt < 60 * 1000;
    });

    if (recentAttempts.length >= 2) {
      throw new HttpsError('resource-exhausted', 'Please wait a minute before requesting another OTP.');
    }

    const code = createOtpCode();
    const verificationRef = db.collection('emailOtpVerifications').doc();
    const expiresAt = admin.firestore.Timestamp.fromMillis(now + otpTtlMs);

    await verificationRef.set({
      email,
      name,
      eventId,
      eventTitle,
      codeHash: hashOtp({ email, code, verificationId: verificationRef.id }),
      status: 'pending',
      attempts: 0,
      expiresAt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    try {
      await sendOtpEmail({ email, name, code, eventTitle });
      await verificationRef.update({
        emailStatus: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      await verificationRef.update({
        status: 'failed',
        emailStatus: 'failed',
        error: error.message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      logger.error('RSVP email OTP failed', { error: error.message, email, eventId });
      throw new HttpsError('internal', error.message || 'Unable to send verification email.');
    }

    return {
      verificationId: verificationRef.id,
      expiresAt: expiresAt.toMillis()
    };
  }
);

exports.verifyRsvpEmailOtp = onCall(
  callableOptions,
  async (request) => {
    const email = normalizeEmail(request.data?.email);
    const code = String(request.data?.code || '').trim();
    const verificationId = String(request.data?.verificationId || '').trim();

    if (!verificationId || !/^\d{6}$/.test(code) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpsError('invalid-argument', 'Enter the 6-digit verification code.');
    }

    const verificationRef = db.collection('emailOtpVerifications').doc(verificationId);
    const result = await db.runTransaction(async (transaction) => {
      const verificationDoc = await transaction.get(verificationRef);

      if (!verificationDoc.exists) {
        throw new HttpsError('not-found', 'Verification code not found. Request a new OTP.');
      }

      const verification = verificationDoc.data();
      if (verification.email !== email) {
        throw new HttpsError('permission-denied', 'This code does not match the email address.');
      }

      if (verification.status !== 'pending') {
        throw new HttpsError('failed-precondition', 'This code is no longer active. Request a new OTP.');
      }

      if ((verification.expiresAt?.toMillis?.() || 0) < Date.now()) {
        transaction.update(verificationRef, {
          status: 'expired',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        throw new HttpsError('deadline-exceeded', 'This code has expired. Request a new OTP.');
      }

      if (Number(verification.attempts || 0) >= 5) {
        transaction.update(verificationRef, {
          status: 'locked',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        throw new HttpsError('resource-exhausted', 'Too many incorrect attempts. Request a new OTP.');
      }

      const expectedHash = hashOtp({ email, code, verificationId });
      if (verification.codeHash !== expectedHash) {
        transaction.update(verificationRef, {
          attempts: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        throw new HttpsError('unauthenticated', 'Invalid verification code.');
      }

      const verificationToken = crypto.randomBytes(24).toString('hex');
      transaction.update(verificationRef, {
        status: 'verified',
        verificationToken,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { verificationToken };
    });

    return {
      verified: true,
      verificationId,
      verificationToken: result.verificationToken
    };
  }
);

exports.onEventRsvpCreated = onDocumentCreated(
  { region, document: 'eventRsvps/{rsvpDocId}', secrets: emailSecrets },
  async (event) => {
    const rsvp = event.data?.data();
    if (!rsvp) return;

    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (isActiveRsvp(rsvp) && rsvp.eventId && rsvp.countedAtCreation !== true) {
      await db.collection('events').doc(rsvp.eventId).set({
        registrationCount: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    try {
      const emailResult = await sendRsvpEmail(rsvp, 'confirmation');
      updates.confirmationEmailStatus = emailResult.status;
      updates.confirmationEmailSentAt = emailResult.sent ? admin.firestore.FieldValue.serverTimestamp() : null;
    } catch (error) {
      logger.error('RSVP confirmation email failed', { error: error.message, rsvpId: rsvp.rsvpId });
      await queueEmail({ rsvp, type: 'confirmation', status: 'failed', error: error.message });
      Object.assign(updates, {
        confirmationEmailStatus: 'failed',
        confirmationEmailError: error.message
      });
    }

    try {
      const adminEmailResult = await sendAdminRsvpNotification(rsvp);
      updates.adminNotificationStatus = adminEmailResult.status;
      updates.adminNotificationSentAt = adminEmailResult.sent ? admin.firestore.FieldValue.serverTimestamp() : null;
    } catch (error) {
      logger.error('Admin RSVP notification failed', { error: error.message, rsvpId: rsvp.rsvpId });
      await queueEmail({ rsvp, type: 'admin_rsvp', status: 'failed', error: error.message, to: getSmtpConfig().adminEmail });
      Object.assign(updates, {
        adminNotificationStatus: 'failed',
        adminNotificationError: error.message
      });
    }

    await event.data.ref.update(updates);
  }
);

exports.onEventRsvpCheckedIn = onDocumentUpdated(
  { region, document: 'eventRsvps/{rsvpDocId}', secrets: emailSecrets },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!after) return;

    const beforeActive = isActiveRsvp(before);
    const afterActive = isActiveRsvp(after);
    if (beforeActive !== afterActive && after.eventId) {
      await db.collection('events').doc(after.eventId).set({
        registrationCount: admin.firestore.FieldValue.increment(afterActive ? 1 : -1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    if (beforeActive && !afterActive && after.status === 'cancelled' && before?.status !== 'cancelled') {
      try {
        const emailResult = await sendRsvpCancellationEmail(after, 'registration_cancelled');
        await event.data.after.ref.update({
          cancellationEmailStatus: emailResult.status,
          cancellationEmailSentAt: emailResult.sent ? admin.firestore.FieldValue.serverTimestamp() : null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (error) {
        logger.error('RSVP cancellation email failed', { error: error.message, rsvpId: after.rsvpId });
        await queueEmail({ rsvp: after, type: 'registration_cancelled', status: 'failed', error: error.message });
        await event.data.after.ref.update({
          cancellationEmailStatus: 'failed',
          cancellationEmailError: error.message,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    if (before?.checkedIn === true || after.checkedIn !== true) return;

    try {
      const emailResult = await sendRsvpEmail(after, 'checkin');
      await event.data.after.ref.update({
        checkInEmailStatus: emailResult.status,
        checkInEmailSentAt: emailResult.sent ? admin.firestore.FieldValue.serverTimestamp() : null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      logger.error('RSVP check-in email failed', { error: error.message, rsvpId: after.rsvpId });
      await queueEmail({ rsvp: after, type: 'checkin', status: 'failed', error: error.message });
      await event.data.after.ref.update({
        checkInEmailStatus: 'failed',
        checkInEmailError: error.message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }
);

exports.onLocationBookingUpdated = onDocumentUpdated(
  { region, document: 'eventLocationBookings/{bookingId}', secrets: emailSecrets },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!after || before?.status === after.status || !['approved', 'not_approved'].includes(after.status)) return;

    const booking = { id: event.params.bookingId, ...after };
    const updates = {
      decisionEmailStatus: 'pending',
      decisionEmailSentAt: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (after.eventId) {
      await db.collection('events').doc(after.eventId).set({
        status: after.status === 'approved' ? 'approved' : 'not_approved',
        approvalStatus: after.status,
        approvedAt: after.status === 'approved' ? admin.firestore.FieldValue.serverTimestamp() : null,
        rejectionReason: after.status === 'not_approved' ? (after.decisionNote || '') : '',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    try {
      const emailResult = await sendBookingDecisionEmail(booking);
      updates.decisionEmailStatus = emailResult.status;
      updates.decisionEmailSentAt = emailResult.sent ? admin.firestore.FieldValue.serverTimestamp() : null;
    } catch (error) {
      logger.error('Location booking decision email failed', { error: error.message, bookingId: event.params.bookingId });
      await queueEmail({ rsvp: booking, type: 'location_booking_decision', status: 'failed', error: error.message, to: booking.requesterEmail });
      updates.decisionEmailStatus = 'failed';
      updates.decisionEmailError = error.message;
    }

    await event.data.after.ref.update(updates);
  }
);

exports.onEventStatusUpdated = onDocumentUpdated(
  { region, document: 'events/{eventId}', secrets: emailSecrets },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!after || before?.status === after.status || after.status !== 'cancelled') return;

    const eventId = event.params.eventId;
    const snapshot = await db.collection('eventRsvps')
      .where('eventId', '==', eventId)
      .where('status', '==', 'confirmed')
      .limit(500)
      .get();

    const tasks = snapshot.docs.map(async (rsvpDoc) => {
      const rsvp = {
        id: rsvpDoc.id,
        ...rsvpDoc.data(),
        eventTitle: after.title || rsvpDoc.data().eventTitle,
        eventDate: after.dateIso || after.date || rsvpDoc.data().eventDate,
        eventTime: after.time || rsvpDoc.data().eventTime,
        location: after.location || rsvpDoc.data().location
      };

      try {
        await sendRsvpCancellationEmail(rsvp, 'event_cancelled');
        await rsvpDoc.ref.update({
          status: 'event_cancelled',
          eventCancellationEmailStatus: 'sent',
          eventCancellationEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (error) {
        logger.error('Event cancellation email failed', { error: error.message, eventId, rsvpId: rsvp.rsvpId });
        await queueEmail({ rsvp, type: 'event_cancelled', status: 'failed', error: error.message });
        await rsvpDoc.ref.update({
          eventCancellationEmailStatus: 'failed',
          eventCancellationEmailError: error.message,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    await Promise.all(tasks);
    await event.data.after.ref.update({
      registrationCount: 0,
      cancellationNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
);

exports.sendEventReminderSweep = onSchedule(
  { region, schedule: 'every 60 minutes', timeZone: 'Asia/Kolkata', secrets: emailSecrets },
  async () => {
    const now = new Date();
    const reminderWindowMs = 24 * 60 * 60 * 1000;
    const snapshot = await db
      .collection('eventRsvps')
      .where('reminderStatus', '==', 'pending')
      .limit(100)
      .get();

    const tasks = [];
    snapshot.forEach((docSnapshot) => {
      const rsvp = { id: docSnapshot.id, ...docSnapshot.data() };
      if (rsvp.status !== 'confirmed') return;

      const startsAt = eventDateTime(rsvp);
      if (!startsAt) return;

      const diff = startsAt.getTime() - now.getTime();
      if (diff <= 0 || diff > reminderWindowMs) return;

      tasks.push((async () => {
        try {
          const emailResult = await sendRsvpEmail(rsvp, 'reminder');
          await docSnapshot.ref.update({
            reminderStatus: emailResult.status === 'sent' ? 'sent' : emailResult.status,
            reminderSentAt: emailResult.sent ? admin.firestore.FieldValue.serverTimestamp() : null,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (error) {
          logger.error('RSVP reminder email failed', { error: error.message, rsvpId: rsvp.rsvpId });
          await queueEmail({ rsvp, type: 'reminder', status: 'failed', error: error.message });
          await docSnapshot.ref.update({
            reminderStatus: 'failed',
            reminderError: error.message,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      })());
    });

    await Promise.all(tasks);
    logger.info('Event reminder sweep completed', { checked: snapshot.size, queued: tasks.length });
  }
);
