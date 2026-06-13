import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '../lib/routerCompat';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Share2,
  ArrowLeft, ExternalLink, Phone, Briefcase, MessageSquare
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import QRCode from 'qrcode';
import { useFirestore } from '../hooks/useFirestore';
import { EVENT_CATEGORIES, formatEventDate, getEventCategoryStyle } from '../utils/eventUtils';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpTicket, setRsvpTicket] = useState(null);
  const [eventQr, setEventQr] = useState('');
  const { getDocument } = useFirestore('events');
  const { addDocument: addRsvp } = useFirestore('eventRsvps');

  useEffect(() => {
    loadEvent();
  }, [id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    QRCode.toDataURL(window.location.href, { margin: 1, width: 220 })
      .then(setEventQr)
      .catch((error) => console.error('Event QR generation failed:', error));
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const result = await getDocument(id);
      if (result.success) {
        setEvent(result.data);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?[1-9]\d{9,14}$/;

  const validateEmail = (value) => emailPattern.test(value.trim());
  const validatePhone = (value) => phonePattern.test(value.trim());

  const handleSubmitRsvp = async (submitEvent) => {
    submitEvent.preventDefault();
    setRsvpLoading(true);
    setFormErrors({});

    const errors = {};
    if (!name.trim()) errors.name = 'Enter your full name';
    if (!validateEmail(email)) errors.email = 'Enter a valid email address';
    if (!validatePhone(phone)) errors.phone = 'Enter a valid phone number including country code';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setRsvpLoading(false);
      return;
    }

    const duplicateKey = `eventRsvp:${id}:${email.trim().toLowerCase()}`;
    if (window.localStorage.getItem(duplicateKey)) {
      setRsvpSubmitted(true);
      setFormMessage('You have already RSVPed for this event from this browser.');
      setRsvpLoading(false);
      return;
    }

    try {
      const rsvpId = crypto.randomUUID();
      const qrToken = crypto.randomUUID();
      const qrPayload = JSON.stringify({
        type: 'gazra-event-rsvp',
        eventId: id,
        rsvpId,
        qrToken
      });
      const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 260 });
      const result = await addRsvp({
        rsvpId,
        qrToken,
        eventId: id,
        eventTitle: event.title,
        eventDate: event.dateIso || event.date || '',
        eventTime: event.time || '',
        location: event.location || '',
        locationId: event.locationId || '',
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status: 'confirmed',
        attendanceStatus: 'not_checked_in',
        checkedIn: false,
        reminderStatus: 'pending'
      });
      if (result.success) {
        window.localStorage.setItem(duplicateKey, 'true');
        setRsvpTicket({
          id: result.id,
          rsvpId,
          qrToken,
          qrCodeDataUrl,
          name: name.trim(),
          email: email.trim()
        });
        setRsvpSubmitted(true);
        setFormMessage('RSVP confirmed! Save this QR code for event check-in.');
      } else {
        setFormMessage('Unable to save RSVP. Please try again.');
      }
    } catch (error) {
      console.error('RSVP submission failed:', error);
      setFormMessage('Unable to save RSVP. Please try again later.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const shareEvent = (platform) => {
    const url = window.location.href;
    const text = `Check out this event: ${event?.title}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      instagram: url
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Event Not Found</h2>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const categoryInfo = EVENT_CATEGORIES.find(cat => cat.id === event.category);
  const categoryStyle = getEventCategoryStyle(event.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-hard overflow-hidden">
            {/* Image Header */}
            <div className="h-64 sm:h-96 relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

              {/* Category Tag */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-soft ${categoryStyle.bg}`}>
                  {categoryInfo?.name || "Event"}
                </span>
              </div>

              {/* Share Button */}
              <div className="absolute top-4 right-4">
                <div className="relative group">
                  <button className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors duration-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                  
                  {/* Share Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-hard opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => shareEvent('facebook')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <FaFacebook className="w-5 h-5 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => shareEvent('twitter')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <FaTwitter className="w-5 h-5 text-blue-400" />
                        Twitter
                      </button>
                      <button
                        onClick={() => shareEvent('whatsapp')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <FaWhatsapp className="w-5 h-5 text-green-500" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Title & Basic Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl sm:text-5xl font-display font-bold mb-2">{event.title}</h1>
                {event.fullDetails && event.fullDetails.subtitle && (
                  <p className="text-lg text-white/90 mb-4">{event.fullDetails.subtitle}</p>
                )}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatEventDate(event)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Location & Price */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-50 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-neutral-800 mb-1">Location</h3>
                        <p className="text-neutral-600 text-sm">{event.location}</p>
                        {event.locationDetails?.address && (
                          <p className="mt-2 text-neutral-500 text-sm">{event.locationDetails.address}</p>
                        )}
                        {event.locationDetails?.googleMapLink && (
                          <a href={event.locationDetails.googleMapLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-sm text-primary-600 hover:text-primary-700">
                            Open Google Map
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-secondary-50 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-secondary-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-neutral-800 mb-1">Capacity & Price</h3>
                        <p className="text-neutral-600 text-sm">{event.capacity}</p>
                        <p className="text-primary-600 font-semibold mt-1">{event.price}</p>
                        {event.ticketsLeft && (
                          <p className="text-xs text-neutral-500 mt-1">{event.ticketsLeft}</p>
                        )}
                        {event.locationDetails?.infrastructure?.length > 0 && (
                          <p className="text-xs text-neutral-500 mt-2">
                            {event.locationDetails.infrastructure.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {eventQr && (
                  <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
                    <h3 className="text-lg font-semibold text-neutral-900">Event RSVP QR</h3>
                    <p className="mt-1 text-sm text-neutral-600">Share this code to open this event page quickly.</p>
                    <img src={eventQr} alt={`${event.title} QR code`} className="mt-4 h-36 w-36 rounded-xl border border-neutral-100" />
                  </div>
                )}

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-display font-bold text-neutral-800">About This Event</h2>
                  <p className="text-neutral-700 leading-relaxed">{event.description}</p>
                </motion.div>

                {/* Full Details Section */}
                {event.fullDetails && (
                  <>
                    {/* Target Audience */}
                    {event.fullDetails.targetAudience && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                      >
                        <h3 className="text-xl font-semibold text-neutral-800">Who Should Attend?</h3>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {event.fullDetails.targetAudience.map((audience, index) => (
                            <li key={index} className="flex items-start gap-2 text-neutral-700">
                              <Briefcase className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                              <span>{audience}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Highlights */}
                    {event.fullDetails.highlights && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-semibold text-neutral-800">Event Highlights</h3>
                        <div className="grid gap-4">
                          {event.fullDetails.highlights.map((highlight, index) => (
                            <div key={index} className="bg-white border border-neutral-200 rounded-xl p-5">
                              <h4 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary-500" />
                                {highlight.title}
                              </h4>
                              <p className="text-neutral-600 text-sm">{highlight.description}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Special Guests */}
                    {event.fullDetails.specialGuests && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                      >
                        <h3 className="text-xl font-semibold text-neutral-800">Special Session By</h3>
                        {event.fullDetails.specialGuests.map((guest, index) => (
                          <div key={index} className="flex items-center gap-3 bg-secondary-50 p-4 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-secondary-200 flex items-center justify-center">
                              <Users className="w-6 h-6 text-secondary-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-neutral-800">{guest.name}</h4>
                              <p className="text-neutral-600 text-sm">{guest.title}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Additional Info */}
                    {event.fullDetails.additionalInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-6 bg-primary-50 rounded-xl"
                      >
                        <p className="text-neutral-700">{event.fullDetails.additionalInfo}</p>
                      </motion.div>
                    )}

                    {/* Included Perks */}
                    {event.fullDetails.includedPerks && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                      >
                        <h3 className="text-xl font-semibold text-neutral-800">What&apos;s Included</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.fullDetails.includedPerks.map((perk, index) => (
                            <span key={index} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-full text-sm">
                              {perk}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Call to Action */}
                    {event.fullDetails.callToAction && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-center p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl"
                      >
                        <h3 className="text-2xl font-display font-bold text-primary-600">{event.fullDetails.callToAction}</h3>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Contact & RSVP */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-8 border-t border-neutral-200 pt-8"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    {event.organizer && (
                      <div>
                        <h3 className="font-semibold text-neutral-800 mb-2">Organized By</h3>
                        <p className="text-neutral-600">{event.organizer}</p>
                      </div>
                    )}

                    {event.contactPhone && (
                      <div>
                        <h3 className="font-semibold text-neutral-800 mb-2">Contact</h3>
                        <a href={`tel:${event.contactPhone}`} className="flex items-center text-primary-600 hover:text-primary-700">
                          <Phone className="w-4 h-4 mr-2" />
                          {event.contactPhone}
                        </a>
                        {event.rsvpDeadline && (
                          <p className="text-sm text-neutral-500 mt-1">RSVP Deadline: {event.rsvpDeadline}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900">RSVP for this Event</h3>
                        <p className="text-sm text-neutral-600">Share your contact details and we will confirm your participation.</p>
                      </div>
                    </div>

                    {formMessage && (
                      <div className="mt-4 rounded-2xl bg-primary-50 border border-primary-100 p-4 text-sm text-primary-700">
                        {formMessage}
                      </div>
                    )}

                    {rsvpTicket && (
                      <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-5">
                        <div className="grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
                          <img src={rsvpTicket.qrCodeDataUrl} alt="Your RSVP QR code" className="h-40 w-40 rounded-2xl border border-white bg-white p-2" />
                          <div>
                            <h4 className="text-lg font-semibold text-green-900">Your Check-In QR Code</h4>
                            <p className="mt-1 text-sm text-green-800">Show this QR code at arrival. A copy can also be sent by email once email delivery is configured.</p>
                            <p className="mt-3 text-xs text-green-700">Ticket: {rsvpTicket.rsvpId}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmitRsvp} className="mt-6 grid gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-neutral-700">Full Name</label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                          placeholder="Your full name"
                        />
                        {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                          placeholder="name@example.com"
                        />
                        {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="phone" className="text-sm font-medium text-neutral-700">Phone Number</label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                          placeholder="+919876543210"
                        />
                        {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                        disabled={rsvpLoading || rsvpSubmitted}
                      >
                        {rsvpLoading ? 'Submitting...' : 'Confirm RSVP'}
                      </button>
                    </form>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4 pt-6"
                >
                  {event.externalLink && (
                    <a
                      href={event.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl shadow-colored hover:shadow-glow transition-all duration-300 font-semibold"
                    >
                      Register Now
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  
                  <button
                    onClick={() => navigate('/events')}
                    className="flex-1 px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-700 rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all duration-300 font-semibold"
                  >
                    View All Events
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail;
