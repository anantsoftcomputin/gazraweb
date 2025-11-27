import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Heart, Share2,
  ArrowLeft, ExternalLink, Phone, Tag, Briefcase, MessageSquare
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useFirestore } from '../hooks/useFirestore';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getDocuments } = useFirestore('events');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      if (result.success) {
        const foundEvent = result.data.find(e => e.id === id);
        setEvent(foundEvent);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
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

  const eventCategories = [
    { id: "theater", name: "Theater & Dance", color: "bg-accent-terracotta" },
    { id: "workshop", name: "Workshops", color: "bg-accent-sage" },
    { id: "therapy", name: "Therapy", color: "bg-accent-ochre" },
    { id: "community", name: "Community", color: "bg-accent-slate" },
  ];

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

  const categoryInfo = eventCategories.find(cat => cat.id === event.category);

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
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-soft ${categoryInfo?.color || 'bg-primary-500'}`}>
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
                    <span>{event.date}</span>
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
                      </div>
                    </div>
                  </motion.div>
                </div>

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
                        <h3 className="text-xl font-semibold text-neutral-800">What's Included</h3>
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
                  className="border-t border-neutral-200 pt-8"
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
