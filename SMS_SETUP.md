# SMS Service Setup Guide

## Current Status
- Phone verification is implemented using Firebase Phone Authentication ✅
- SMS confirmation is mocked (console.log) - needs real SMS service

## Option 1: Twilio (Recommended)

### Steps:
1. Sign up at https://www.twilio.com/
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add to `.env`:
```env
VITE_TWILIO_ACCOUNT_SID=your_account_sid
VITE_TWILIO_AUTH_TOKEN=your_auth_token
VITE_TWILIO_PHONE_NUMBER=+1234567890
```

5. Install Twilio SDK:
```bash
npm install twilio
```

6. Create Firebase Cloud Function (`functions/index.js`):
```javascript
const functions = require('firebase-functions');
const twilio = require('twilio');

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const client = twilio(accountSid, authToken);

exports.sendSMS = functions.https.onCall(async (data, context) => {
  const { to, message } = data;
  
  try {
    const result = await client.messages.create({
      body: message,
      from: functions.config().twilio.phone,
      to: to
    });
    
    return { success: true, sid: result.sid };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

7. Deploy function:
```bash
firebase functions:config:set twilio.sid="YOUR_SID" twilio.token="YOUR_TOKEN" twilio.phone="YOUR_NUMBER"
firebase deploy --only functions
```

8. Update `smsService.js`:
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

export const sendBookingConfirmationSMS = async (phoneNumber, bookingDetails) => {
  const functions = getFunctions();
  const sendSMS = httpsCallable(functions, 'sendSMS');
  
  const message = `Your booking at Gazra Cafe is confirmed!...`;
  
  const result = await sendSMS({
    to: phoneNumber,
    message: message
  });
  
  return result.data;
};
```

## Option 2: Firebase Extensions - Twilio

1. Install extension:
```bash
firebase ext:install twilio/send-message
```

2. Configure during installation
3. No code changes needed - extension handles SMS

## Option 3: Fast2SMS (Indian Service)

1. Sign up at https://www.fast2sms.com/
2. Get API key
3. Similar setup to Twilio but optimized for India

## Testing

Currently using `mockSendSMS` which logs to console:
```javascript
mockSendSMS('+919876543210', 'Your booking is confirmed!');
// Outputs to console instead of sending real SMS
```

## Cost Estimates

- **Twilio**: ~₹0.50 per SMS
- **Fast2SMS**: ~₹0.15 per SMS
- **Firebase Extension**: Free extension + Twilio costs

## Next Steps

1. Choose SMS provider
2. Set up account and get credentials
3. Implement Cloud Function
4. Replace `mockSendSMS` with real implementation
5. Test with your phone number first
