/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link } from '../../lib/routerCompat';
import { Calendar, Clock, MapPin, ArrowRight, Users, Tag, ExternalLink } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { formatEventDate, getEventCategory, getEventPath, getUpcomingEvents } from '../../utils/eventUtils';

const EventCard = ({ event }) => (
  <div className="group relative heritage-paper overflow-hidden rounded-lg border border-neutral-300 shadow-lg hover:shadow-xl hover:border-primary-500 hover:-translate-y-2 transition-all duration-400">
    <div className="heritage-rule absolute left-0 top-0 z-10 h-1 w-full" />
    {/* Event Tag */}
    <div className="absolute top-4 left-4 z-10">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-primary-600 shadow-soft">
        <Tag className="w-3 h-3 mr-1" />
        {getEventCategory(event.category)?.name || event.category || 'Event'}
      </span>
    </div>
    
    {/* Image Container */}
    <div className="aspect-w-16 aspect-h-10 relative">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    
    {/* Content */}
    <div className="p-6 space-y-4">
      {/* Title and Description */}
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300">
          {event.title}
        </h3>
        <p className="text-neutral-600 line-clamp-3">{event.description}</p>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-2 gap-4 py-4 border-t border-[rgba(184,121,44,0.12)]">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-neutral-600">
            <Calendar className="w-4 h-4 mr-2 text-primary-500" />
            {formatEventDate(event)}
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Clock className="w-4 h-4 mr-2 text-primary-500" />
            {event.time}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-neutral-600">
            <MapPin className="w-4 h-4 mr-2 text-primary-500" />
            {event.location || 'Location TBA'}
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Users className="w-4 h-4 mr-2 text-primary-500" />
            {event.capacity || 'Open'}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between pt-2">
        {event.externalLink ? (
          <a
            href={event.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-xl text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
          >
            Book Tickets
            <ExternalLink className="ml-2 w-4 h-4" />
          </a>
        ) : (
          <Link
            to={getEventPath(event)}
            className="inline-flex items-center px-4 py-2 rounded-xl text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        )}
        <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors duration-300">
          {event.externalLink ? "Share" : "RSVP"}
        </button>
      </div>
    </div>
  </div>
);

const EventsPreview = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getDocuments } = useFirestore('events');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const result = await getDocuments();
        if (result.success) {
          setUpcomingEvents(getUpcomingEvents(result.data, 3));
        }
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <section className="py-12 relative">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center px-4 py-1 bg-primary-100 rounded-full text-primary-600 text-sm font-medium mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming Events
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 mb-5">
            Join Our Community Events
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            Connect, learn, and grow with our diverse community through these carefully curated events.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-96 bg-white/80 rounded-2xl shadow-medium animate-pulse" />
            ))
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 bg-[rgba(251,244,231,0.85)] rounded-lg border border-[rgba(184,121,44,0.2)] p-8 text-center backdrop-blur-md">
              <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600">No upcoming events yet. Check back soon.</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/events"
            className="inline-flex items-center px-8 py-4 bg-primary-500 text-white rounded-xl shadow-colored hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
          >
            View All Events
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
