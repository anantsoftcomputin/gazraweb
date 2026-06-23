import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock, 
  MapPin, 
  Users,
  X
} from 'lucide-react';
import { Link } from '../lib/routerCompat';
import { useFirestore } from '../hooks/useFirestore';
import {
  EVENT_CATEGORIES,
  formatEventDate,
  getEventCategoryStyle,
  getEventDateIso,
  sortEventsByDate
} from '../utils/eventUtils';

const EventCalendarPage = () => {
  // State for the current date and selected date
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getDocuments } = useFirestore('events');
  const { addDocument: addNewsletterSubscriber } = useFirestore('newsletter');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success' | 'error' | null

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterSubmitting(true);
    setNewsletterStatus(null);
    const result = await addNewsletterSubscriber({ email: newsletterEmail.trim().toLowerCase(), source: 'calendar-page' });
    setNewsletterSubmitting(false);

    if (result.success) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } else {
      setNewsletterStatus('error');
    }
  };

  // Event categories matching the main events page
  const eventCategories = [
    { id: "all", name: "All Events", color: "primary-500" },
    ...EVENT_CATEGORIES,
  ];

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const result = await getDocuments();
        if (result.success) {
          setEvents(sortEventsByDate(result.data).filter((event) => getEventDateIso(event)));
        }
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter events by category if one is selected
  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  // Function to get all dates with events in the current month
  const getDatesWithEvents = () => {
    return filteredEvents.map(event => {
      return getEventDateIso(event);
    });
  };

  // Get all event dates
  const eventDates = getDatesWithEvents();

  // Function to get events for a specific date
  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    return filteredEvents.filter(event => {
      return getEventDateIso(event) === dateString;
    });
  };

  // Function to navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Function to navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get the day of week for the first day of the month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate the calendar grid
  const generateCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const grid = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`} className="h-24 border border-neutral-100 bg-neutral-50/50"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const hasEvents = eventDates.includes(dateString);
      const isSelected = selectedDate && dateString === selectedDate.toISOString().split('T')[0];
      const isToday = new Date().toISOString().split('T')[0] === dateString;
      
      // Get events for this date
      const dayEvents = getEventsForDate(date);

      grid.push(
        <div 
          key={day}
          className={`relative h-24 md:h-32 border border-neutral-100 p-1 transition-all duration-200 overflow-hidden ${
            isSelected 
              ? 'bg-primary-50 border-primary-200' 
              : hasEvents 
                ? 'bg-white hover:bg-primary-50/30 cursor-pointer' 
                : 'bg-white'
            } ${
              isToday ? 'ring-1 ring-primary-300' : ''
            }`}
          onClick={() => {
            if (hasEvents) {
              setSelectedDate(date);
            }
          }}
        >
          <div className="flex justify-between">
            <span className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center ${
              isToday ? 'bg-primary-500 text-white' : ''
            }`}>
              {day}
            </span>
            
            {hasEvents && (
              <span className="flex space-x-1">
                {/* Show colored dots for each event category */}
                {Array.from(new Set(dayEvents.map(e => e.category))).map((category, i) => (
                  <span 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${getEventCategoryStyle(category).dot}`}
                  ></span>
                ))}
              </span>
            )}
          </div>

          {/* Show max 2 events with truncated titles */}
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id}
                className={`text-xs truncate p-1 rounded border-l-2 ${getEventCategoryStyle(event.category).softBg} ${getEventCategoryStyle(event.category).text} ${getEventCategoryStyle(event.category).border}`}
              >
                {event.time?.split(' ')[0] || 'Time'} • {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-neutral-500 pl-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return grid;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Events for the selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-r from-primary-100 to-primary-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-xl"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent-sage/20 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-2">Event Calendar</h1>
              <p className="text-neutral-600">See all our upcoming events in a monthly view</p>
            </div>
            
            <Link to="/events" className="flex items-center px-4 py-2 bg-white rounded-xl border border-neutral-200 text-primary-600 hover:bg-primary-50 transition-all duration-200">
              <span>Switch to List View</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Calendar Controls */}
      <section className="py-4 sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-neutral-100 shadow-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-primary-50 transition-all duration-200"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <h2 className="text-xl font-display font-bold text-neutral-800">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-primary-50 transition-all duration-200"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
              
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="ml-2 px-4 py-2 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-all duration-200"
              >
                Today
              </button>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-primary-50 transition-all duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>Filter: {selectedCategory === 'all' ? 'All Events' : eventCategories.find(cat => cat.id === selectedCategory)?.name}</span>
              </button>
              
              {showCategoryFilter && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-medium border border-neutral-100 p-2 z-50">
                  {eventCategories.map(category => (
                    <button
                      key={category.id}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${
                        selectedCategory === category.id 
                          ? `${getEventCategoryStyle(category.id).bg} text-white` 
                          : 'hover:bg-neutral-50'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowCategoryFilter(false);
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Calendar Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map(day => (
              <div key={day} className="text-center font-medium text-neutral-600">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {generateCalendarGrid()}
            </div>
          )}
          
          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-neutral-700">Categories:</span>
            {eventCategories.filter(cat => cat.id !== 'all').map(category => (
              <div key={category.id} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getEventCategoryStyle(category.id).dot}`}></span>
                <span className="text-sm text-neutral-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Selected Date Events */}
      {selectedDate && selectedDateEvents.length > 0 && (
        <section className="py-8 bg-neutral-50/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Events on {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <button 
                onClick={() => setSelectedDate(null)}
                className="p-2 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedDateEvents.map(event => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-soft overflow-hidden border border-neutral-100"
                >
                  {/* Image */}
                  {event.image && (
                    <div className="h-40 relative">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                      {/* Category Tag */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-block px-3 py-1 bg-white/90 backdrop-blur-sm ${getEventCategoryStyle(event.category).text} text-xs font-medium rounded-full`}>
                          {eventCategories.find(cat => cat.id === event.category)?.name}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-neutral-800 mb-2">{event.title}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2 mb-4">{event.description}</p>
                    <p className="text-xs font-medium text-neutral-500 mb-3">{formatEventDate(event)}</p>
                    
                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-neutral-600">
                        <Clock className="w-4 h-4 mr-2 text-primary-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      {event.capacity && (
                        <div className="flex items-center text-sm text-neutral-600">
                          <Users className="w-4 h-4 mr-2 text-primary-500" />
                          <span>{event.capacity}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                      <span className="text-sm font-medium text-primary-600">{event.price}</span>
                      {event.externalLink ? (
                        <a
                          href={event.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg"
                        >
                          Book Tickets
                        </a>
                      ) : (
                        <Link to={`/events/${event.id}`} className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg">
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Newsletter Section - Matching the one from Events page */}
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
            {newsletterStatus === 'success' ? (
              <div className="flex items-center justify-center gap-2 max-w-md mx-auto px-5 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                You're subscribed! Thanks for joining us.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  disabled={newsletterSubmitting}
                  className="flex-1 px-6 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-300"
                />
                <motion.button
                  type="submit"
                  disabled={newsletterSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl shadow-colored hover:shadow-glow disabled:opacity-60 transition-all duration-300"
                >
                  {newsletterSubmitting ? 'Subscribing…' : 'Subscribe'}
                </motion.button>
              </form>
            )}
            {newsletterStatus === 'error' && (
              <p className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EventCalendarPage;
