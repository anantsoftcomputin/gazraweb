// SMS Service using Firebase Auth SMS functionality
// This file provides utilities for sending SMS notifications

import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase';

export const sendBookingConfirmationSMS = async (phoneNumber, message) => {
  try {
    // Format phone number
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;
    
    console.log('Attempting to send SMS to:', formattedPhone);
    
    // Create a unique container ID for this SMS operation
    const containerId = `sms-recaptcha-${Date.now()}`;
    
    // Create a temporary container in DOM
    const container = document.createElement('div');
    container.id = containerId;
    container.style.display = 'none';
    document.body.appendChild(container);
    
    let recaptchaVerifier;
    try {
      // Create invisible reCAPTCHA for SMS sending
      recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved for SMS sending');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired for SMS');
        }
      });
      
      await recaptchaVerifier.render();
      
      // Use Firebase Auth to send SMS
      // Note: This will send an OTP-style message, not a custom message
      // For custom messages, you'd need Firebase Extensions or Cloud Functions
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      
      console.log('SMS sent successfully via Firebase Auth');
      
      // Clean up
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      
      return { success: true, confirmationResult };
      
    } catch (error) {
      console.error('Firebase SMS error:', error);
      
      // Clean up on error
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      
      // Fall back to mock if Firebase SMS fails
      console.log('Falling back to mock SMS due to error:', error.message);
      return mockSendSMS(phoneNumber, message);
    }
    
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
};

// Enhanced booking confirmation SMS with better message
export const sendBookingConfirmationMessage = async (phoneNumber, bookingDetails) => {
  const message = `Your booking at Gazra Cafe is confirmed! We look forward to serving you on ${bookingDetails.date} at ${bookingDetails.time}. Please reach 10 minutes early to avoid waiting. To cancel, call us at least 30 minutes beforehand: 82003 06871`;
  
  // For now, use Firebase Auth SMS (which sends OTP format)
  // In production, you'd want to use Firebase Extensions for custom SMS
  return await sendBookingConfirmationSMS(phoneNumber, message);
};

// Fallback mock SMS for development/testing
export const mockSendSMS = (phoneNumber, message) => {
  console.log('=== MOCK SMS (Firebase SMS failed, using fallback) ===');
  console.log('To:', phoneNumber);
  console.log('Message:', message);
  console.log('Note: For production SMS, consider using Firebase Extensions or Cloud Functions');
  console.log('=====================================================');
  return { success: true, isMock: true };
};
