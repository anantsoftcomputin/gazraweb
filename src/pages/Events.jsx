import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Music, Coffee, Users,
  Clock, MapPin, Heart, ArrowRight,
  Filter, Tag, ExternalLink, Share2
} from "lucide-react";
import { useFirestore } from "../hooks/useFirestore";

const EventsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const { getDocuments } = useFirestore('events');

  const eventCategories = [
    { id: "all", name: "All Events", icon: Calendar, color: "bg-primary-500" },
    { id: "theater", name: "Theater & Dance", icon: Music, color: "bg-accent-terracotta" },
    { id: "workshop", name: "Workshops", icon: Coffee, color: "bg-accent-sage" },
    { id: "therapy", name: "Therapy", icon: Heart, color: "bg-accent-ochre" },
    { id: "community", name: "Community", icon: Users, color: "bg-accent-slate" },
  ];

  const months = [
    { id: "all", name: "All Months" },
    { id: "april", name: "April" },
    { id: "may", name: "May" },
    { id: "june", name: "June" },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    (selectedCategory === "all" || event.category === selectedCategory) &&
    (selectedMonth === "all" || event.month === selectedMonth)
  );

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);

  // Event Card Component
  const EventCard = ({ event }) => {
    const CategoryIcon = eventCategories.find(cat => cat.id === event.category)?.icon || Calendar;

    return (
      <motion.div
        layoutId={`event-${event.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group"
        onClick={() => navigate(`/events/${event.id}`)}
      >
        <div className="h-full relative bg-white rounded-2xl overflow-hidden shadow-medium hover:shadow-hard transition-all duration-500 border border-neutral-100 cursor-pointer">
          {/* Event Tag */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-primary-600 shadow-soft">
              <CategoryIcon className="w-3 h-3 mr-1" />
              {eventCategories.find(cat => cat.id === event.category)?.name || "Event"}
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
          <div className="p-5 space-y-3">
            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-1">
                {event.title}
              </h3>
              <p className="text-neutral-600 text-sm line-clamp-2">{event.description}</p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100">
              <div className="space-y-2">
                <div className="flex items-center text-xs text-neutral-600">
                  <Calendar className="w-3 h-3 mr-2 text-primary-500 flex-shrink-0" />
                  <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center text-xs text-neutral-600">
                  <Clock className="w-3 h-3 mr-2 text-primary-500 flex-shrink-0" />
                  <span className="truncate">{event.time}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-neutral-600">
                  <MapPin className="w-3 h-3 mr-2 text-primary-500 flex-shrink-0" />
                  <span className="truncate">{event.location.split(",")[0]}</span>
                </div>
                <div className="flex items-center text-xs text-neutral-600">
                  <Users className="w-3 h-3 mr-2 text-primary-500 flex-shrink-0" />
                  <span className="truncate">{event.capacity}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-medium text-primary-600">
                {event.price}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors duration-300"
              >
                View Details
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section with Video */}
      <section className="relative overflow-hidden h-[60vh] min-h-[500px]">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video/event.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50 backdrop-filter backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming Events
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Join Our Community Events
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Connect, learn, and grow with our diverse community through these carefully curated events.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary-500 text-white rounded-xl shadow-colored hover:shadow-glow transition-all duration-300"
              onClick={() => {
                const filtersSection = document.getElementById("filters-section");
                filtersSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Events
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section id="filters-section" className="py-6 sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-neutral-100 shadow-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {eventCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${selectedCategory === category.id
                      ? `${category.color} text-white`
                      : "bg-white border border-neutral-200 text-neutral-600 hover:bg-primary-50"
                    }`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-neutral-200 rounded-xl px-4 py-2 text-neutral-600 focus:outline-none focus:border-primary-500"
              >
                {months.map((month) => (
                  <option key={month.id} value={month.id}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-neutral-800">Featured Events</h2>
              <span className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center cursor-pointer">
                <span>See All</span>
                <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatePresence>
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Regular Events Grid */}
      <section className="py-12 bg-primary-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-display font-bold text-neutral-800">
              {selectedCategory === "all"
                ? "All Events"
                : `${eventCategories.find(cat => cat.id === selectedCategory)?.name || "Events"}`
              }
            </h2>

            {regularEvents.length > 0 && (
              <span className="text-neutral-500 text-sm">
                Showing {regularEvents.length} event{regularEvents.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {regularEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {regularEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-soft">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-neutral-600 mb-2">No events found</h3>
              <p className="text-neutral-500 mb-6">Try changing your filters or check back later.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedMonth("all");
                }}
                className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300"
              >
                View All Events
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-300/5" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary-200/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Never Miss an Event
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Subscribe to our newsletter and stay updated with the latest events and community happenings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary-500 text-white rounded-xl shadow-colored hover:shadow-glow transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Event Calendar",
                description: "View our complete calendar of upcoming events",
                link: "/calendar",
              },
              {
                icon: Coffee,
                title: "Gazra Cafe",
                description: "Visit our inclusive community cafe space",
                link: "/cafe",
              },
              {
                icon: Heart,
                title: "Get Involved",
                description: "Volunteer opportunities and ways to contribute",
                link: "/volunteer",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-neutral-100"
              >
                <div className="w-12 h-12 mb-4 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600 mb-4">{item.description}</p>
                <motion.a
                  href={item.link}
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;