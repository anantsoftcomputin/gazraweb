import React, { useState, useEffect } from 'react';
import { Phone, Check, AlertCircle, Loader } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../config/firebase';

const PhoneVerification = ({ onVerified, phoneNumber, onPhoneChange }) => {
  const [verificationId, setVerificationId] = useState(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (err) {
          console.error('reCAPTCHA cleanup error:', err);
        }
      }
    };
  }, []);

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Clean up any existing reCAPTCHA first
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (clearErr) {
          console.log('Previous reCAPTCHA cleared');
        }
      }

      // Wait a moment before creating new reCAPTCHA
      await new Promise(resolve => setTimeout(resolve, 100));

      // Initialize reCAPTCHA v2 when sending OTP
      try {
        // Use visible reCAPTCHA for development to avoid MALFORMED errors
        const recaptchaSize = import.meta.env.DEV ? 'normal' : 'invisible';
        
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: recaptchaSize,
          callback: (token) => {
            console.log('reCAPTCHA solved successfully, token:', token ? 'received' : 'none');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            setError('reCAPTCHA expired. Please try again.');
            setLoading(false);
          },
          'error-callback': (error) => {
            console.error('reCAPTCHA error:', error);
            setError('reCAPTCHA verification failed. Please refresh the page and try again.');
            setLoading(false);
          }
        });
        
        // Render the reCAPTCHA widget
        await window.recaptchaVerifier.render();
        console.log('RecaptchaVerifier initialized and rendered successfully');
        
        // Wait a moment after rendering
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (initError) {
        console.error('Failed to initialize RecaptchaVerifier:', initError);
        
        // If it's a development environment and reCAPTCHA fails, provide helpful message
        if (import.meta.env.DEV && initError.code === 'auth/invalid-app-credential') {
          throw new Error('reCAPTCHA configuration issue. Please ensure your Firebase project has Phone Authentication enabled and reCAPTCHA v2 (not Enterprise) is configured. For localhost testing, add your domain to Firebase Console → Authentication → Settings → Authorized domains.');
        } else {
          throw new Error('reCAPTCHA initialization failed. Please refresh the page and try again.');
        }
      }

      // Format phone number for India (+91)
      const formattedPhone = phoneNumber.startsWith('+91') 
        ? phoneNumber 
        : `+91${phoneNumber.replace(/\D/g, '')}`;

      console.log('Sending OTP to:', formattedPhone);
      
      const appVerifier = window.recaptchaVerifier;
      
      if (!appVerifier) {
        throw new Error('reCAPTCHA verifier not initialized');
      }
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      setConfirmationResult(result);
      setOtpSent(true);
      setError('');
      
      console.log('OTP sent successfully');
    } catch (err) {
      console.error('OTP send error:', err);
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (err.code === 'auth/captcha-check-failed') {
        errorMessage = 'reCAPTCHA verification failed. Please refresh the page and try again.';
        console.error('reCAPTCHA MALFORMED error - this usually means reCAPTCHA was not properly initialized');
      } else if (err.code === 'auth/invalid-app-credential') {
        errorMessage = 'Firebase reCAPTCHA configuration issue. Please ensure reCAPTCHA v2 (not Enterprise) is enabled in Firebase Console → Authentication → Settings. For localhost, add localhost to Authorized domains.';
        console.error('SOLUTION 1: Go to Firebase Console → Authentication → Settings → App Verification, and switch from Enterprise to Standard reCAPTCHA v2');
        console.error('SOLUTION 2: Go to Firebase Console → Authentication → Settings → Authorized domains, and add localhost:5173 or localhost:3000');
      }
      
      setError(errorMessage);
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (clearErr) {
          console.error('Error clearing reCAPTCHA:', clearErr);
        }
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(otp);
      setVerified(true);
      setError('');
      onVerified(phoneNumber);
    } catch (err) {
      console.error('OTP verification error:', err);
      let errorMessage = 'Invalid OTP. Please try again.';
      
      if (err.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code';
      } else if (err.code === 'auth/code-expired') {
        errorMessage = 'OTP expired. Please request a new one.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setOtp('');
    setOtpSent(false);
    setError('');
    await sendOTP();
  };

  if (verified) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-green-900">Phone Number Verified</p>
          <p className="text-sm text-green-700">{phoneNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      {/* Phone Number Input */}
      {!otpSent ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number * (10 digits)
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    onPhoneChange(value);
                  }}
                  placeholder="9876543210"
                  maxLength="10"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={sendOTP}
              disabled={loading || phoneNumber.length !== 10}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
          
          {/* reCAPTCHA Container - positioned after send OTP button */}
          <div id="recaptcha-container" className="flex justify-center mt-4"></div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP sent to +91 {phoneNumber}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              placeholder="123456"
              maxLength="6"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg tracking-widest"
              disabled={loading}
            />
            <button
              type="button"
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Verify'
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={resendOTP}
            disabled={loading}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Resend OTP
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Info */}
      {!otpSent && (
        <p className="text-xs text-gray-500">
          You will receive a 6-digit OTP on this number for verification
        </p>
      )}
    </div>
  );
};

export default PhoneVerification;
