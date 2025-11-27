import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Users, Tag, ExternalLink } from 'lucide-react';

const EventCard = ({ event }) => (
  <div className="group relative bg-white rounded-2xl overflow-hidden shadow-medium hover:shadow-hard transition-all duration-500 border border-neutral-100">
    {/* Event Tag */}
    <div className="absolute top-4 left-4 z-10">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-primary-600 shadow-soft">
        <Tag className="w-3 h-3 mr-1" />
        {event.category}
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
      <div className="grid grid-cols-2 gap-4 py-4 border-t border-neutral-100">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-neutral-600">
            <Calendar className="w-4 h-4 mr-2 text-primary-500" />
            {event.date}
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Clock className="w-4 h-4 mr-2 text-primary-500" />
            {event.time}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-neutral-600">
            <MapPin className="w-4 h-4 mr-2 text-primary-500" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Users className="w-4 h-4 mr-2 text-primary-500" />
            {event.capacity}
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
            to={`/events/${event.id}`}
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
  const upcomingEvents = [
    {
      id: 1,
      title: "SAM-AAJ",
      category: "Theater & Dance",
      date: "Thursday, 10th April",
      time: "8:00 PM Onwards",
      location: "Hosted by GAZRA",
      capacity: "Limited Seats",
      image: "/images/samaaj.png",
      description: "Join us for a groundbreaking dance-theater production that challenges norms and celebrates authenticity. Two Gujarati men confront their deepest insecurities and societal expectations while navigating love and self-discovery. A powerful blend of dance, poetry, and original music by Shivansh Jindal.",
      externalLink: "https://in.bookmyshow.com/events/sam-aaj/ET00436340"
    },
    {
      id: 2,
      title: "Gazra Resource Workshop",
      category: "Workshop",
      date: "April 1st, 2025",
      time: "4:00 PM To 6:00 PM",
      location: "Gazra Cafe",
      capacity: "50 spots",
      image: "/images/sweekar.png",
      description: "Calling all professionals committed to equality! Join us to create a holistic support network for Women and the LGBTQIA+ community through the Resources initiative."
    },
    {
      id: 3,
      title: "Art Therapy Session",
      category: "Therapy",
      date: "June 25, 2024",
      time: "3:00 PM",
      location: "Gazra Studio",
      capacity: "30 spots",
      image: "/images/art-therapy.png",
      description: "Express yourself through art in our therapeutic creative session led by professional art therapists."
    }
  ];

  return (
    <section 
      className="py-12 relative"
      style={{ 
        background: 'url("/images/background.jpg") center/cover no-repeat'
      }}
    >
      
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center px-4 py-1 bg-primary-100 rounded-full text-primary-600 text-sm font-medium mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming Events
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-6 px-4 py-2 bg-white/80 rounded-lg inline-block">
            Join Our Community Events
          </h2>
          <p className="text-xl text-neutral-700 bg-white/80 p-4 rounded-lg">
            Connect, learn, and grow with our diverse community through these carefully curated events.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
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