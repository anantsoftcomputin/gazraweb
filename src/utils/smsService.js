// SMS Service using Twilio or Firebase Extensions
// This file provides utilities for sending SMS notifications

export const sendBookingConfirmationSMS = async (phoneNumber, bookingDetails) => {
  try {
    // Format phone number
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    
    // SMS message
    const message = `Your booking at Gazra Cafe is confirmed! We look forward to serving you on ${bookingDetails.date} at ${bookingDetails.time}. Please reach 10 minutes early to avoid waiting. To cancel, call us at least 30 minutes beforehand: 82003 06871`;

    // Call Cloud Function to send SMS
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: formattedPhone,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }

    return { success: true };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
};

// For testing without actual SMS service
export const mockSendSMS = (phoneNumber, message) => {
  console.log('=== MOCK SMS ===');
  console.log('To:', phoneNumber);
  console.log('Message:', message);
  console.log('===============');
  return { success: true };
};
