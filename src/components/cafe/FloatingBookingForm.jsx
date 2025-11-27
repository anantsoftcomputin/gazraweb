import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, MessageSquare, User, Mail, CheckCircle, AlertCircle, X, CalendarCheck } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import PhoneVerification from '../shared/PhoneVerification';

const FloatingBookingForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: '2',
    specialRequests: ''
  });
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [closedDates, setClosedDates] = useState([]);
  const [dateWarning, setDateWarning] = useState('');

  const { addDocument } = useFirestore('cafeBookings');
  const { getDocuments: getClosedDates } = useFirestore('cafeClosedDates');

  // Load closed dates
  useEffect(() => {
    const loadClosedDates = async () => {
      const result = await getClosedDates();
      if (result.success && result.data) {
        setClosedDates(result.data.map(item => item.date));
      }
    };
    loadClosedDates();
  }, []);

  // Listen for open booking form event from mobile nav
  useEffect(() => {
    const handleOpenBooking = () => {
      setIsOpen(true);
    };

    window.addEventListener('openBookingForm', handleOpenBooking);
    return () => window.removeEventListener('openBookingForm', handleOpenBooking);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Check if selected date is closed
    if (name === 'date') {
      const closedDate = closedDates.find(d => d === value);
      if (closedDate) {
        setDateWarning('⚠️ The cafe is closed on this date. Please select another date.');
      } else {
        setDateWarning('');
      }
    }
  };

  const validateBookingTime = () => {
    const now = new Date();
    const selectedDateTime = new Date(`${formData.date}T${convertTo24Hour(formData.time)}`);
    
    const diffMinutes = (selectedDateTime - now) / (1000 * 60);
    
    if (diffMinutes < 30) {
      return 'Bookings must be made at least 30 minutes in advance.';
    }
    
    return null;
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneVerified) {
      setError('Please verify your phone number first');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Check if date is closed
      if (closedDates.includes(formData.date)) {
        setError('Sorry, the cafe is closed on the selected date. Please choose another date.');
        setSubmitting(false);
        return;
      }

      // Validate booking time (30 minutes advance)
      const timeError = validateBookingTime();
      if (timeError) {
        setError(timeError);
        setSubmitting(false);
        return;
      }

      // Create booking object
      const bookingData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        time: formData.time,
        partySize: String(formData.partySize),
        specialRequests: formData.specialRequests ? formData.specialRequests.trim() : '',
        status: 'pending',
        phoneVerified: true
      };

      console.log('Submitting booking data:', bookingData);
      const result = await addDocument(bookingData);
      console.log('Booking result:', result);

      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          partySize: '2',
          specialRequests: ''
        });
        setPhoneVerified(false);

        // Reset success message and close form after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setIsOpen(false);
        }, 3000);
      } else {
        console.error('Booking failed:', result.error);
        setError(result.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking error details:', err);
      setError(`Error: ${err.message || 'An error occurred. Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-24 lg:bottom-6 z-40 bg-primary-600 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 transition-all duration-300 hover:scale-110 group"
      >
        <CalendarCheck className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Book a Table
        </span>
      </motion.button>

      {/* Floating Form Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Form Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-primary-600 text-white p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold">Reserve Your Table</h2>
                  <p className="text-primary-100 text-sm">Book your dining experience</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Success Message */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="m-6 p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Booking Submitted!</h3>
                    <p className="text-green-700 text-sm">
                      We'll confirm your reservation via SMS shortly.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone Verification */}
                <PhoneVerification
                  phoneNumber={formData.phone}
                  onPhoneChange={(phone) => setFormData({ ...formData, phone })}
                  onVerified={(phone) => {
                    setPhoneVerified(true);
                    setFormData({ ...formData, phone });
                  }}
                />

                {/* Party Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Party Size *
                  </label>
                  <select
                    name="partySize"
                    value={formData.partySize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6 People</option>
                    <option value="7">7 People</option>
                    <option value="8">8 People</option>
                    <option value="9+">9+ People</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      dateWarning ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {dateWarning && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{dateWarning}</span>
                    </div>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Bookings must be made at least 30 minutes in advance
                  </p>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any dietary restrictions, special occasions, or preferences..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !phoneVerified}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Book Table'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By booking, you agree to our terms and conditions. We'll send a confirmation SMS.
                </p>
              </form>

              {/* Contact Info */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Need immediate assistance? Call us at{' '}
                  <a href="tel:8200306871" className="text-primary-600 font-semibold hover:underline">
                    82003 06871
                  </a>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingBookingForm;
