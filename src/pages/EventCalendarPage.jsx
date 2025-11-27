import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock, 
  MapPin, 
  Users,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCalendarPage = () => {
  // State for the current date and selected date
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Event categories matching the main events page
  const eventCategories = [
    { id: "all", name: "All Events", color: "primary-500" },
    { id: "theater", name: "Theater & Dance", color: "accent-terracotta" },
    { id: "workshop", name: "Workshops", color: "accent-sage" },
    { id: "therapy", name: "Therapy", color: "accent-ochre" },
    { id: "community", name: "Community", color: "accent-slate" },
  ];

  // Dummy events data (same as your events page)
  const events = [
    {
      id: 1,
      title: "SAM-AAJ",
      category: "theater",
      date: "2024-04-10", // Changed to ISO format for easier date handling
      time: "8:00 PM Onwards",
      location: "Hosted by GAZRA",
      capacity: "Limited Seats",
      image: "/images/samaaj.png",
      description: "Join us for a groundbreaking dance-theater production that challenges norms and celebrates authenticity.",
      externalLink: "https://in.bookmyshow.com/events/sam-aaj/ET00436340",
      featured: true,
      price: "Tickets on BookMyShow",
      month: "april",
      ticketsLeft: "Limited seats available",
    },
    {
      id: 2,
      title: "Sweekar Awareness Drive",
      category: "workshop",
      date: "2025-04-01", // Note: Year is 2025
      time: "4:00 PM To 6:00 PM",
      location: "Gazra Cafe",
      capacity: "50 spots",
      image: "/images/sweekar.png",
      description: "Calling all professionals committed to equality! Join us to create a holistic support network.",
      month: "april",
      featured: true,
      price: "Free",
      ticketsLeft: "32 spots left",
    },
    {
      id: 3,
      title: "Art Therapy Session",
      category: "therapy",
      date: "2024-06-25",
      time: "3:00 PM",
      location: "Gazra Studio",
      capacity: "30 spots",
      image: "/images/image-five.jpg",
      description: "Express yourself through art in our therapeutic creative session led by professional art therapists.",
      month: "june",
      price: "₹500",
      ticketsLeft: "18 spots left",
    },
    {
      id: 4,
      title: "Pride Month Celebration",
      category: "community",
      date: "2024-06-15",
      time: "4:00 PM",
      location: "Gazra Cafe",
      capacity: "200 spots",
      image: "/images/image-one.jpg",
      description: "Join us for a vibrant celebration of Pride Month with music, art, and community activities.",
      month: "june",
      price: "Free Entry",
      ticketsLeft: "120 spots left",
    },
    {
      id: 5,
      title: "Mental Health Workshop",
      category: "workshop",
      date: "2024-05-20",
      time: "5:30 PM",
      location: "Community Center",
      capacity: "50 spots",
      image: "/images/image-two.jpg",
      description: "An interactive session focused on mental health awareness and support systems.",
      month: "may",
      price: "₹300",
      ticketsLeft: "27 spots left",
    },
    // Add a few more events to fill out the calendar
    {
      id: 6,
      title: "Open Mic Night",
      category: "community",
      date: "2024-04-15",
      time: "7:00 PM",
      location: "Gazra Cafe",
      capacity: "30 spots",
      description: "Share your poetry, music, or stories in a supportive environment.",
      month: "april",
      price: "Free Entry",
      ticketsLeft: "15 spots left",
    },
    {
      id: 7,
      title: "Gender Identity Workshop",
      category: "workshop",
      date: "2024-04-22",
      time: "2:00 PM",
      location: "Community Center",
      capacity: "40 spots",
      description: "Understanding gender identity and fostering inclusivity in our communities.",
      month: "april",
      price: "Free",
      ticketsLeft: "25 spots left",
    },
    {
      id: 8,
      title: "Film Screening: LGBTQ+ Stories",
      category: "community",
      date: "2024-05-05",
      time: "6:00 PM",
      location: "Gazra Studio",
      capacity: "80 spots",
      description: "A curated selection of short films highlighting LGBTQ+ experiences.",
      month: "may",
      price: "₹200",
      ticketsLeft: "45 spots left",
    },
    {
      id: 9,
      title: "Yoga for Mental Health",
      category: "therapy",
      date: "2024-05-12",
      time: "9:00 AM",
      location: "Gazra Studio",
      capacity: "20 spots",
      description: "A therapeutic yoga session focused on mental wellbeing.",
      month: "may",
      price: "₹350",
      ticketsLeft: "10 spots left",
    },
  ];

  // Filter events by category if one is selected
  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  // Function to get all dates with events in the current month
  const getDatesWithEvents = () => {
    return filteredEvents.map(event => {
      const eventDate = new Date(event.date);
      return eventDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    });
  };

  // Get all event dates
  const eventDates = getDatesWithEvents();

  // Function to get events for a specific date
  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    return filteredEvents.filter(event => {
      return event.date === dateString;
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
                    className={`w-2 h-2 rounded-full bg-${eventCategories.find(cat => cat.id === category)?.color || 'primary-500'}`}
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
                className={`text-xs truncate p-1 rounded bg-${eventCategories.find(cat => cat.id === event.category)?.color || 'primary-500'}/10 text-${eventCategories.find(cat => cat.id === event.category)?.color || 'primary-500'} border-l-2 border-${eventCategories.find(cat => cat.id === event.category)?.color || 'primary-500'}`}
              >
                {event.time.split(' ')[0]} • {event.title}
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
                          ? `bg-${category.color} text-white` 
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
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarGrid()}
          </div>
          
          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-neutral-700">Categories:</span>
            {eventCategories.filter(cat => cat.id !== 'all').map(category => (
              <div key={category.id} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full bg-${category.color}`}></span>
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
                  onClick={() => setSelectedEvent(event)}
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
                        <span className={`inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-${eventCategories.find(cat => cat.id === event.category)?.color} text-xs font-medium rounded-full`}>
                          {eventCategories.find(cat => cat.id === event.category)?.name}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-neutral-800 mb-2">{event.title}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2 mb-4">{event.description}</p>
                    
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
                        <button className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg">
                          View Details
                        </button>
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
    </div>
  );
};

export default EventCalendarPage;