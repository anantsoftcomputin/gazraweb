const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const db = admin.firestore();
const region = 'us-central1';
const smtpPassword = defineSecret('SMTP_PASS');

const emailSecrets = [smtpPassword];

function getSmtpConfig() {
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || 'support@gazra.org';
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || smtpPassword.value();

  return {
    host: process.env.SMTP_HOST || 'gazra.org',
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: user && pass ? { user, pass } : null,
    from: process.env.SMTP_FROM || `Project Gazra <${user}>`,
    replyTo: process.env.SMTP_REPLY_TO || user
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
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://gazra.org';
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

function confirmationHtml(rsvp) {
  return emailShell({
    eyebrow: 'RSVP Confirmed',
    title: `You are confirmed for ${rsvp.eventTitle || 'our event'}`,
    intro: `Hi ${rsvp.name || 'there'}, thank you for RSVPing. Your spot has been confirmed.`,
    body: `${detailsTable(rsvp)}
      <p style="font-size:15px;line-height:1.6;color:#444;">Please keep your RSVP QR code ready at arrival. You can reopen the event page from the button below and show your ticket at check-in.</p>
      ${tokenBlock(rsvp)}`,
    ctaLabel: 'Open Event Page',
    ctaUrl: eventUrl(rsvp),
    footerNote: 'If your plans change, reply to this email so the Gazra team can update the event list.'
  });
}

function reminderHtml(rsvp) {
  return emailShell({
    eyebrow: 'Event Reminder',
    title: `${rsvp.eventTitle || 'Your Gazra event'} is coming up`,
    intro: `Hi ${rsvp.name || 'there'}, this is a reminder for the event you RSVPed to.`,
    body: `${detailsTable(rsvp)}
      <p style="font-size:15px;line-height:1.6;color:#444;">Please arrive a few minutes early and keep your RSVP QR code ready for a quick check-in.</p>`,
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

function emailSubject(rsvp, type) {
  if (type === 'reminder') return `Reminder: ${rsvp.eventTitle || 'Project Gazra event'}`;
  if (type === 'checkin') return `Checked in: ${rsvp.eventTitle || 'Project Gazra event'}`;
  return `RSVP confirmed: ${rsvp.eventTitle || 'Project Gazra event'}`;
}

function emailHtml(rsvp, type) {
  if (type === 'reminder') return reminderHtml(rsvp);
  if (type === 'checkin') return checkInHtml(rsvp);
  return confirmationHtml(rsvp);
}

async function queueEmail({ rsvp, type, status, error = '' }) {
  await db.collection('mailQueue').add({
    type,
    to: rsvp.email || '',
    eventId: rsvp.eventId || '',
    rsvpId: rsvp.rsvpId || '',
    runId: rsvp.runId || '',
    status,
    error,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
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
  await createTransporter().sendMail({
    from: config.from,
    replyTo: config.replyTo,
    to: rsvp.email,
    subject,
    html: emailHtml(rsvp, type),
    text: `${subject}

Hi ${rsvp.name || 'there'},

Event: ${rsvp.eventTitle || 'Project Gazra event'}
Date: ${rsvp.eventDate || 'To be announced'}
Time: ${rsvp.eventTime || 'To be announced'}
Location: ${rsvp.location || 'To be announced'}
Ticket: ${rsvp.rsvpId || ''}
Event page: ${eventUrl(rsvp)}
QR payload: ${checkInPayload(rsvp)}

Project Gazra`
  });

  await queueEmail({ rsvp, type, status: 'sent' });
  return { sent: true, status: 'sent' };
}

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

exports.onEventRsvpCreated = onDocumentCreated(
  { region, document: 'eventRsvps/{rsvpDocId}', secrets: emailSecrets },
  async (event) => {
    const rsvp = event.data?.data();
    if (!rsvp) return;

    try {
      const emailResult = await sendRsvpEmail(rsvp, 'confirmation');
      await event.data.ref.update({
        confirmationEmailStatus: emailResult.status,
        confirmationEmailSentAt: emailResult.sent ? admin.firestore.FieldValue.serverTimestamp() : null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      logger.error('RSVP confirmation email failed', { error: error.message, rsvpId: rsvp.rsvpId });
      await queueEmail({ rsvp, type: 'confirmation', status: 'failed', error: error.message });
      await event.data.ref.update({
        confirmationEmailStatus: 'failed',
        confirmationEmailError: error.message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }
);

exports.onEventRsvpCheckedIn = onDocumentUpdated(
  { region, document: 'eventRsvps/{rsvpDocId}', secrets: emailSecrets },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!after || before?.checkedIn === true || after.checkedIn !== true) return;

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
