/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "../lib/routerCompat";
import { Link } from "../lib/routerCompat";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Music, Coffee, Users,
  Clock, MapPin, Heart, ArrowRight,
  Filter
} from "lucide-react";
import { useFirestore } from "../hooks/useFirestore";
import { formatEventDate, getEventMonth, getEventPath, sortEventsByDate } from "../utils/eventUtils";

const EventsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
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
    const result = await addNewsletterSubscriber({ email: newsletterEmail.trim().toLowerCase(), source: 'events-page' });
    setNewsletterSubmitting(false);

    if (result.success) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } else {
      setNewsletterStatus('error');
    }
  };

  const eventCategories = [
    { id: "all",       name: "All Events",      icon: Calendar, color: "bg-primary-600" },
    { id: "theater",   name: "Theater & Dance", icon: Music,    color: "bg-accent-terracotta" },
    { id: "workshop",  name: "Workshops",       icon: Coffee,   color: "bg-secondary-600" },
    { id: "therapy",   name: "Therapy",         icon: Heart,    color: "bg-accent-ochre" },
    { id: "community", name: "Community",       icon: Users,    color: "bg-primary-600" },
    { id: "cultural",  name: "Cultural",        icon: Music,    color: "bg-accent-terracotta" },
  ];

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      if (result.success) {
        setEvents(sortEventsByDate(result.data.filter((e) => (e.status || 'approved') === 'approved')));
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e =>
    (selectedCategory === "all" || e.category === selectedCategory) &&
    (selectedMonth   === "all" || getEventMonth(e) === selectedMonth)
  );

  const featuredEvents = filteredEvents.filter(e => e.featured);
  const regularEvents  = filteredEvents.filter(e => !e.featured);
  const months = [
    { id: "all", name: "All Months" },
    ...Array.from(new Set(events.map(getEventMonth).filter(Boolean))).map((m) => ({
      id: m,
      name: m.charAt(0).toUpperCase() + m.slice(1),
    })),
  ];

  /* ── Event Card ──────────────────────────────────────────────── */
  const EventCard = ({ event }) => {
    const cat = eventCategories.find(c => c.id === event.category);
    const CategoryIcon = cat?.icon || Calendar;
    const capacityNum = Number(String(event.capacity || '').match(/\d+/)?.[0] || 0);
    const regCount    = Number(event.registrationCount || 0);
    const isFull = capacityNum > 0 && regCount >= capacityNum;

    return (
      <motion.div
        layoutId={`event-${event.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="group cursor-pointer h-full"
        onClick={() => navigate(getEventPath(event))}
      >
        <div className="relative h-full flex flex-col heritage-paper rounded-lg overflow-hidden
                        border border-neutral-300 shadow-lg hover:shadow-xl hover:border-primary-500 hover:-translate-y-2
                        transition-all duration-400">
          <div className="heritage-rule absolute left-0 top-0 z-10 h-1 w-full" />

          {/* Category tag */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                             bg-[rgba(251,244,231,0.95)] backdrop-blur-sm text-primary-700 shadow-sm border border-primary-100/60">
              <CategoryIcon className="w-3 h-3" />
              {cat?.name || 'Event'}
            </span>
          </div>

          {/* Image */}
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            <img src={event.image || '/images/image-four.jpg'} alt={event.title}
                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-600" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5 space-y-3">
            <div>
              <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-primary-600
                             transition-colors duration-200 line-clamp-1 leading-snug">
                {event.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2 mt-1">{event.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-[rgba(184,121,44,0.12)]">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Calendar className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span className="truncate">{formatEventDate(event)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <MapPin className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span className="truncate">{event.location?.split(',')[0] || 'Location TBA'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Clock className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span className="truncate">{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Users className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span className="truncate">
                  {capacityNum ? `${Math.max(capacityNum - regCount, 0)} slots left` : (event.capacity || 'Open')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 mt-auto">
              <span className="text-xs font-semibold text-primary-600">
                {isFull ? 'Fully booked' : event.price}
              </span>
              <span className={`px-3 py-1 rounded text-xs font-semibold transition-colors duration-200
                ${isFull
                  ? 'bg-red-50 text-red-700 border border-red-100'
                  : 'bg-primary-600 text-white group-hover:bg-primary-700'}`}>
                {isFull ? 'Fully Booked' : 'View Details'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  /* ── Loading state ───────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gazra-paper)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">Loading events…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gazra-paper)]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-[58vh] min-h-[480px] overflow-hidden bg-neutral-950">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover"
               autoPlay muted loop playsInline>
          <source src="/video/event.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
                      className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/40
                            bg-[rgba(251,244,231,0.88)] text-xs font-bold uppercase tracking-wide
                            text-accent-terracotta shadow-lg backdrop-blur-md mb-6">
              <Calendar className="w-3.5 h-3.5" />
              Upcoming Events
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight
                           drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] mb-5">
              Join Our<br />Community Events
            </h1>
            <p className="text-primary-100/80 text-base sm:text-lg mb-8 leading-relaxed">
              Connect, learn, and grow with our diverse community through these carefully curated events.
            </p>
            <button
              onClick={() => document.getElementById('filters-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white
                         font-semibold px-7 py-3.5 rounded-lg shadow-lg transition-colors duration-200">
              Explore Events
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky filter bar ────────────────────────────────────── */}
      <section id="filters-section"
               className="sticky top-[134px] z-40 bg-[rgba(251,244,231,0.97)] backdrop-blur-xl
                          border-b border-[rgba(184,121,44,0.2)] shadow-[0_4px_16px_rgba(45,33,20,0.08)]">
        <div className="h-[2px]"
             style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />
        <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {eventCategories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold
                              whitespace-nowrap transition-all duration-200 flex-shrink-0
                              ${active ? `${cat.color} text-white shadow-md` : 'bg-transparent text-neutral-600 hover:bg-primary-50 hover:text-primary-700'}`}>
                  <cat.icon size={14} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Month filter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-sm border border-[rgba(184,121,44,0.3)] rounded-lg px-3 py-2 bg-white
                         text-neutral-700 focus:outline-none focus:border-primary-500">
              {months.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────────────────── */}
      {featuredEvents.length > 0 && (
        <section className="py-12 bg-[var(--gazra-paper)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-baseline mb-7">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-primary-200/50
                                bg-primary-50 text-xs font-bold uppercase tracking-wide text-primary-600 mb-2">
                  Spotlight
                </div>
                <h2 className="font-display text-2xl font-bold text-neutral-900">Featured Events</h2>
              </div>
              <button onClick={() => setSelectedCategory('all')}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                See All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6 relative">
              <AnimatePresence>
                {featuredEvents.map((event) => <EventCard key={event.id} event={event} />)}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* ── Divider ───────────────────────────────────────────────── */}
      {featuredEvents.length > 0 && (
        <div className="py-2 bg-[var(--gazra-paper)]">
          <div className="gazra-folk-chain max-w-sm mx-auto" />
        </div>
      )}

      {/* ── Regular Events ────────────────────────────────────────── */}
      <section className="py-12 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-7">
            <h2 className="font-display text-2xl font-bold text-neutral-900">
              {selectedCategory === 'all'
                ? 'All Events'
                : eventCategories.find(c => c.id === selectedCategory)?.name || 'Events'}
            </h2>
            {regularEvents.length > 0 && (
              <span className="text-sm text-neutral-400">
                {regularEvents.length} event{regularEvents.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {regularEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 relative">
              <AnimatePresence>
                {regularEvents.map((event) => <EventCard key={event.id} event={event} />)}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 rounded-lg border border-[rgba(184,121,44,0.15)]">
              <Calendar className="w-14 h-14 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-neutral-600 mb-2">No events found</h3>
              <p className="text-neutral-500 mb-6 text-sm">Try changing your filters or check back later.</p>
              <button onClick={() => { setSelectedCategory('all'); setSelectedMonth('all'); }}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold
                           rounded-lg transition-colors duration-200 text-sm">
                View All Events
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────────────────────────── */}
      <section className="py-16 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 gazra-jaali opacity-20" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mb-7" />
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-3">
            Never Miss an Event
          </h2>
          <p className="text-primary-100/80 mb-8 max-w-md mx-auto">
            Subscribe to stay updated with the latest events and community happenings.
          </p>
          {newsletterStatus === 'success' ? (
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto px-5 py-3 rounded-lg bg-white/15 border border-white/30 text-white text-sm font-medium">
              You're subscribed! Thanks for joining us.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                disabled={newsletterSubmitting}
                className="flex-1 px-5 py-3 rounded-lg border border-primary-100/30 bg-white/15 backdrop-blur-sm
                           text-white placeholder-primary-100/60 focus:outline-none focus:border-white/60 text-sm" />
              <button type="submit" disabled={newsletterSubmitting}
                className="px-6 py-3 bg-white text-primary-700 font-bold rounded-lg hover:bg-primary-50 disabled:opacity-60
                               transition-colors duration-200 text-sm whitespace-nowrap shadow-lg">
                {newsletterSubmitting ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}
          {newsletterStatus === 'error' && (
            <p className="mt-2 text-xs text-red-100">Something went wrong. Please try again.</p>
          )}
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mt-7" />
        </div>
      </section>

      {/* ── Quick Links ───────────────────────────────────────────── */}
      <section className="py-14 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Calendar, title: 'Event Calendar',     body: 'View our complete calendar of upcoming events',    link: '/events' },
              { icon: Coffee,   title: 'Gazra Cafe',         body: 'Visit our inclusive community café space',         link: '/cafe' },
              { icon: Heart,    title: 'Get Involved',       body: 'Volunteer opportunities and ways to contribute',   link: '/volunteer' },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="group bg-[var(--gazra-paper)] border border-[rgba(184,121,44,0.18)] rounded-lg p-6
                           hover:shadow-lg hover:border-primary-300/50 transition-all duration-300">
                <div className="w-12 h-12 rounded bg-primary-600 flex items-center justify-center mb-4
                                group-hover:bg-primary-700 transition-colors duration-200">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{item.body}</p>
                <Link to={item.link}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600
                             hover:text-primary-700 transition-colors group">
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
