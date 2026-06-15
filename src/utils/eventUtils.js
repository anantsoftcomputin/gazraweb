export const EVENT_CATEGORIES = [
  { id: 'theater', name: 'Theater & Dance', color: 'accent-terracotta' },
  { id: 'workshop', name: 'Workshops', color: 'accent-sage' },
  { id: 'therapy', name: 'Therapy', color: 'accent-ochre' },
  { id: 'community', name: 'Community', color: 'accent-slate' },
  { id: 'cultural', name: 'Cultural', color: 'secondary-500' }
];

export const EVENT_CATEGORY_STYLES = {
  theater: {
    dot: 'bg-accent-terracotta',
    bg: 'bg-accent-terracotta',
    softBg: 'bg-accent-terracotta/10',
    text: 'text-accent-terracotta',
    border: 'border-accent-terracotta'
  },
  workshop: {
    dot: 'bg-accent-sage',
    bg: 'bg-accent-sage',
    softBg: 'bg-accent-sage/10',
    text: 'text-accent-sage',
    border: 'border-accent-sage'
  },
  therapy: {
    dot: 'bg-accent-ochre',
    bg: 'bg-accent-ochre',
    softBg: 'bg-accent-ochre/10',
    text: 'text-accent-ochre',
    border: 'border-accent-ochre'
  },
  community: {
    dot: 'bg-accent-slate',
    bg: 'bg-accent-slate',
    softBg: 'bg-accent-slate/10',
    text: 'text-accent-slate',
    border: 'border-accent-slate'
  },
  cultural: {
    dot: 'bg-secondary-500',
    bg: 'bg-secondary-500',
    softBg: 'bg-secondary-50',
    text: 'text-secondary-600',
    border: 'border-secondary-500'
  },
  default: {
    dot: 'bg-primary-500',
    bg: 'bg-primary-500',
    softBg: 'bg-primary-50',
    text: 'text-primary-600',
    border: 'border-primary-500'
  }
};

export const getEventCategory = (categoryId) =>
  EVENT_CATEGORIES.find((category) => category.id === categoryId);

export const getEventCategoryStyle = (categoryId) =>
  EVENT_CATEGORY_STYLES[categoryId] || EVENT_CATEGORY_STYLES.default;

export const getEventDateIso = (event) => {
  if (!event) return '';
  if (event.dateIso) return event.dateIso;

  if (typeof event.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
    return event.date;
  }

  if (typeof event.date === 'string') {
    const normalizedDate = event.date.replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, '$1');
    const parsedDate = new Date(normalizedDate);

    if (!Number.isNaN(parsedDate.getTime()) && /\d{4}/.test(normalizedDate)) {
      return parsedDate.toISOString().split('T')[0];
    }
  }

  if (event.date?.seconds) {
    return new Date(event.date.seconds * 1000).toISOString().split('T')[0];
  }

  return '';
};

export const getEventMonth = (event) => {
  const isoDate = getEventDateIso(event);
  if (!isoDate) return event?.month || '';

  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
};

export const formatEventDate = (event, options = {}) => {
  const isoDate = getEventDateIso(event);
  if (!isoDate) return event?.date || 'Date TBA';

  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    weekday: options.weekday,
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTimeForDisplay = (time) => {
  if (!time) return '';
  const [hours, minutes = '00'] = String(time).split(':');
  const date = new Date();
  date.setHours(Number(hours) || 0, Number(minutes) || 0, 0, 0);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const formatSlotTime = (slot) => {
  if (!slot) return '';
  const start = formatTimeForDisplay(slot.startTime);
  const end = formatTimeForDisplay(slot.endTime);
  return end ? `${start} - ${end}` : start;
};

export const formatLocationSlot = (slot) => {
  if (!slot) return 'Select a slot';
  return `${formatEventDate({ dateIso: slot.dateIso })} · ${formatSlotTime(slot)}`;
};

export const sortEventsByDate = (events) =>
  [...events].sort((a, b) => {
    const aDate = getEventDateIso(a);
    const bDate = getEventDateIso(b);

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;

    return aDate.localeCompare(bDate);
  });

export const getUpcomingEvents = (events, limit) => {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = sortEventsByDate(events).filter((event) => {
    const isoDate = getEventDateIso(event);
    return !isoDate || isoDate >= today;
  });

  return typeof limit === 'number' ? upcoming.slice(0, limit) : upcoming;
};
