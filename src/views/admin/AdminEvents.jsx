import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Eye, Calendar, MapPin, Clock,
  X, Save, QrCode, CheckCircle2, Ban, AlertTriangle
} from 'lucide-react';
import { where } from 'firebase/firestore';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import AdminLayout from '../../layouts/AdminLayout';
import {
  EVENT_CATEGORIES,
  formatEventDate,
  formatLocationSlot,
  getEventDateIso,
  getEventMonth,
  getEventPath,
  getUniqueEventSlug,
  sortEventsByDate
} from '../../utils/eventUtils';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEventRsvps, setSelectedEventRsvps] = useState([]);
  const [selectedEventForRsvps, setSelectedEventForRsvps] = useState(null);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationSlots, setLocationSlots] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    dateIso: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    description: '',
    price: '',
    ticketsLeft: '',
    organizer: '',
    contactPhone: '',
    rsvpDeadline: '',
    externalLink: '',
    locationId: '',
    slotId: '',
    locationDetails: null,
    slotDetails: null,
    status: 'approved',
    approvalStatus: 'approved',
    registrationCount: 0,
    featured: false,
    image: ''
  });

  const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('events');
  const { getDocuments: getRsvps, updateDocument: updateRsvp } = useFirestore('eventRsvps');
  const { getDocuments: getLocations } = useFirestore('eventLocations');
  const { getDocuments: getLocationSlots, updateDocument: updateLocationSlot } = useFirestore('eventLocationSlots');
  const { uploadFile, uploading } = useStorage();

  useEffect(() => {
    loadEvents();
    loadLocations();
    loadLocationSlots();
  }, []);

  const loadEvents = async () => {
    const result = await getDocuments();
    if (result.success) {
      setEvents(sortEventsByDate(result.data));
    }
  };

  const loadLocations = async () => {
    const result = await getLocations();
    if (result.success) {
      setLocations(result.data.filter((location) => location.active !== false).sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    }
  };

  const loadLocationSlots = async () => {
    const result = await getLocationSlots();
    if (result.success) {
      setLocationSlots(result.data.sort((a, b) => `${a.dateIso || ''}${a.startTime || ''}`.localeCompare(`${b.dateIso || ''}${b.startTime || ''}`)));
    }
  };

  const slotsForLocation = (locationId) =>
    locationSlots.filter((slot) => slot.locationId === locationId);

  const availableSlotsForLocation = (locationId) =>
    slotsForLocation(locationId).filter((slot) => (
      (slot.status || 'available') === 'available' ||
      (editingEvent?.slotId && slot.id === editingEvent.slotId)
    ));

  const viewEventRsvps = async (event) => {
    const rsvpResult = await getRsvps([
      where('eventId', '==', event.id)
    ]);

    if (rsvpResult.success) {
      const sortedRsvps = rsvpResult.data.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      setSelectedEventRsvps(sortedRsvps);
      setSelectedEventForRsvps(event);
      setShowRsvpModal(true);
    }
  };

  const setAttendance = async (rsvp, checkedIn) => {
    if ((rsvp.status || 'confirmed') !== 'confirmed') {
      alert('Cancelled RSVPs cannot be checked in.');
      return;
    }

    const result = await updateRsvp(rsvp.id, {
      checkedIn,
      attendanceStatus: checkedIn ? 'checked_in' : 'not_checked_in',
      checkedInAt: checkedIn ? new Date().toISOString() : '',
      checkedInBy: checkedIn ? 'admin' : ''
    });

    if (result.success) {
      setSelectedEventRsvps((prev) => prev.map((item) => (
        item.id === rsvp.id
          ? {
              ...item,
              checkedIn,
              attendanceStatus: checkedIn ? 'checked_in' : 'not_checked_in',
              checkedInAt: checkedIn ? { seconds: Math.floor(Date.now() / 1000) } : null
            }
          : item
      )));
    } else {
      alert(result.error || 'Unable to update RSVP attendance.');
    }
  };

  const cancelRegistration = async (rsvp) => {
    const reason = window.prompt(`Cancel ${rsvp.name || rsvp.email || 'this registration'}? Reason shown in email:`, rsvp.cancellationReason || '');
    if (reason === null) return;

    const result = await updateRsvp(rsvp.id, {
      status: 'cancelled',
      attendanceStatus: 'cancelled',
      checkedIn: false,
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
      cancelledBy: 'admin'
    });

    if (result.success) {
      setSelectedEventRsvps((prev) => prev.map((item) => item.id === rsvp.id ? {
        ...item,
        status: 'cancelled',
        attendanceStatus: 'cancelled',
        checkedIn: false,
        cancellationReason: reason
      } : item));
      loadEvents();
    } else {
      alert(result.error || 'Unable to cancel this registration.');
    }
  };

  const changeEventStatus = async (event, status) => {
    const note = window.prompt(
      status === 'cancelled'
        ? `Cancel "${event.title}"? All confirmed RSVPs will receive cancellation emails. Add a note/reason:`
        : status === 'not_approved'
          ? `Mark "${event.title}" as not approved? Add a note/reason:`
          : `Approve "${event.title}"? Optional note:`,
      event.statusNote || event.rejectionReason || ''
    );
    if (note === null) return;

    const result = await updateDocument(event.id, {
      status,
      approvalStatus: status === 'approved' ? 'approved' : status,
      statusNote: note,
      rejectionReason: status === 'not_approved' ? note : '',
      cancelledAt: status === 'cancelled' ? new Date().toISOString() : '',
      approvedAt: status === 'approved' ? new Date().toISOString() : event.approvedAt || ''
    });

    if (result.success) {
      if (event.slotId) {
        await updateLocationSlot(event.slotId, {
          status: status === 'approved' ? 'booked' : 'available',
          eventId: status === 'approved' ? event.id : '',
          bookingId: status === 'approved' ? event.bookingId || '' : ''
        });
        await loadLocationSlots();
      }
      loadEvents();
    } else {
      alert(result.error || 'Unable to update event status.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'locationId') {
      const selectedLocation = locations.find((location) => location.id === value);
      const selectedSlot = availableSlotsForLocation(value)[0];
      if (selectedLocation) {
        setFormData((prev) => ({
          ...prev,
          locationId: selectedLocation.id,
          location: selectedLocation.name,
          slotId: selectedSlot?.id || '',
          slotDetails: selectedSlot ? {
            id: selectedSlot.id,
            dateIso: selectedSlot.dateIso || '',
            startTime: selectedSlot.startTime || '',
            endTime: selectedSlot.endTime || '',
            status: selectedSlot.status || 'available'
          } : null,
          dateIso: selectedSlot?.dateIso || prev.dateIso,
          time: selectedSlot ? `${selectedSlot.startTime}${selectedSlot.endTime ? ` - ${selectedSlot.endTime}` : ''}` : prev.time,
          capacity: selectedSlot?.capacity || (selectedLocation.capacity ? String(selectedLocation.capacity) : prev.capacity),
          locationDetails: {
            id: selectedLocation.id,
            name: selectedLocation.name || '',
            address: selectedLocation.address || '',
            googleMapLink: selectedLocation.googleMapLink || '',
            email: selectedLocation.email || '',
            phone: selectedLocation.phone || '',
            capacity: selectedLocation.capacity || '',
            infrastructure: selectedLocation.infrastructure || [],
            image: selectedLocation.image || ''
          }
        }));
      } else {
        setFormData((prev) => ({ ...prev, locationId: '', slotId: '', locationDetails: null, slotDetails: null }));
      }
    }

    if (name === 'slotId') {
      const selectedSlot = locationSlots.find((slot) => slot.id === value);
      if (selectedSlot) {
        setFormData((prev) => ({
          ...prev,
          slotId: selectedSlot.id,
          dateIso: selectedSlot.dateIso || prev.dateIso,
          time: `${selectedSlot.startTime}${selectedSlot.endTime ? ` - ${selectedSlot.endTime}` : ''}`,
          capacity: selectedSlot.capacity || prev.capacity,
          slotDetails: {
            id: selectedSlot.id,
            dateIso: selectedSlot.dateIso || '',
            startTime: selectedSlot.startTime || '',
            endTime: selectedSlot.endTime || '',
            status: selectedSlot.status || 'available'
          }
        }));
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadFile(file, 'events');
      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.url }));
      } else {
        alert(result.error || 'Unable to upload event image.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedSlot = formData.slotId ? locationSlots.find((slot) => slot.id === formData.slotId) : null;
    if (formData.locationId && !formData.slotId) {
      alert('Select an available slot for this location, or use custom location text.');
      return;
    }
    if (selectedSlot && (selectedSlot.status || 'available') !== 'available' && selectedSlot.id !== editingEvent?.slotId) {
      alert('This slot is no longer available. Choose another slot.');
      await loadLocationSlots();
      return;
    }

    const payload = {
      ...formData,
      slug: getUniqueEventSlug(formData.title, events, editingEvent?.id),
      approvalStatus: formData.status === 'approved' ? 'approved' : formData.status,
      date: formData.dateIso ? formatEventDate({ dateIso: formData.dateIso }) : formData.date,
      month: getEventMonth({ dateIso: formData.dateIso }),
      slotDetails: selectedSlot ? {
        id: selectedSlot.id,
        dateIso: selectedSlot.dateIso || '',
        startTime: selectedSlot.startTime || '',
        endTime: selectedSlot.endTime || '',
        status: formData.status === 'approved' ? 'booked' : 'pending'
      } : formData.slotDetails
    };
    
    if (editingEvent) {
      const result = await updateDocument(editingEvent.id, payload);
      if (result.success) {
        if (editingEvent.slotId && editingEvent.slotId !== formData.slotId) {
          await updateLocationSlot(editingEvent.slotId, {
            status: 'available',
            eventId: '',
            bookingId: ''
          });
        }
        if (formData.slotId) {
          await updateLocationSlot(formData.slotId, {
            status: formData.status === 'approved' ? 'booked' : 'pending',
            eventId: editingEvent.id,
            bookingId: ''
          });
          await loadLocationSlots();
        }
        alert('Event updated successfully!');
        setShowModal(false);
        loadEvents();
        resetForm();
      }
    } else {
      const result = await addDocument(payload);
      if (result.success) {
        if (formData.slotId) {
          await updateLocationSlot(formData.slotId, {
            status: formData.status === 'approved' ? 'booked' : 'pending',
            eventId: result.id,
            bookingId: ''
          });
          await loadLocationSlots();
        }
        alert('Event created successfully!');
        setShowModal(false);
        loadEvents();
        resetForm();
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      category: event.category || '',
      dateIso: getEventDateIso(event),
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      capacity: event.capacity || '',
      description: event.description || '',
      price: event.price || '',
      ticketsLeft: event.ticketsLeft || '',
      organizer: event.organizer || '',
      contactPhone: event.contactPhone || '',
      rsvpDeadline: event.rsvpDeadline || '',
      externalLink: event.externalLink || '',
      locationId: event.locationId || event.locationDetails?.id || '',
      slotId: event.slotId || event.slotDetails?.id || '',
      locationDetails: event.locationDetails || null,
      slotDetails: event.slotDetails || null,
      status: event.status || 'approved',
      approvalStatus: event.approvalStatus || event.status || 'approved',
      registrationCount: event.registrationCount || 0,
      featured: event.featured || false,
      image: event.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const eventToDelete = events.find((event) => event.id === eventId);
      const result = await deleteDocument(eventId);
      if (result.success) {
        if (eventToDelete?.slotId) {
          await updateLocationSlot(eventToDelete.slotId, {
            status: 'available',
            eventId: '',
            bookingId: ''
          });
          await loadLocationSlots();
        }
        alert('Event deleted successfully!');
        loadEvents();
      }
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      category: '',
      dateIso: '',
      date: '',
      time: '',
      location: '',
      capacity: '',
      description: '',
      price: '',
      ticketsLeft: '',
      organizer: '',
      contactPhone: '',
      rsvpDeadline: '',
      externalLink: '',
      locationId: '',
      slotId: '',
      locationDetails: null,
      slotDetails: null,
      status: 'approved',
      approvalStatus: 'approved',
      registrationCount: 0,
      featured: false,
      image: ''
    });
  };

  const categories = EVENT_CATEGORIES;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Events Management</h1>
            <p className="text-neutral-600 mt-2">Manage all events and activities</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {event.image && (
                  <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-neutral-800">{event.title}</h3>
                    {event.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded ${
                      (event.status || 'approved') === 'approved' ? 'bg-green-100 text-green-700' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          event.status === 'not_approved' ? 'bg-neutral-100 text-neutral-600' :
                            'bg-yellow-100 text-yellow-700'
                    }`}>
                      {(event.status || 'approved').replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatEventDate(event)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location || 'Location TBA'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {Number(event.registrationCount || 0)} / {event.capacity || 'Open'} RSVPs
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => viewEventRsvps(event)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View RSVPs
                    </button>
                    <a
                      href={getEventPath(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      RSVP Page
                    </a>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(event.status || 'approved') !== 'approved' && (
                      <button onClick={() => changeEventStatus(event, 'approved')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 hover:bg-green-100">
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                    )}
                    {(event.status || 'approved') === 'approved' && (
                      <button onClick={() => changeEventStatus(event, 'not_approved')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-200">
                        <Ban className="h-4 w-4" />
                        Not Approved
                      </button>
                    )}
                    {event.status !== 'cancelled' && (
                      <button onClick={() => changeEventStatus(event, 'cancelled')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">
                        <AlertTriangle className="h-4 w-4" />
                        Cancel Event
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-800 mb-2">No Events Yet</h3>
            <p className="text-neutral-600 mb-4">Create your first event to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-neutral-800">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="dateIso"
                      value={formData.dateIso}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Time</label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      placeholder="e.g., 8:00 PM"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Capacity</label>
                    <input
                      type="text"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 50 people"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Tickets Left</label>
                    <input
                      type="text"
                      name="ticketsLeft"
                      value={formData.ticketsLeft}
                      onChange={handleInputChange}
                      placeholder="e.g., 25 spots left"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">RSVP Deadline</label>
                    <input
                      type="date"
                      name="rsvpDeadline"
                      value={formData.rsvpDeadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Organizer</label>
                    <input
                      type="text"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleInputChange}
                      placeholder="e.g., GAZRA"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="+919876543210"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
                  <select
                    name="locationId"
                    value={formData.locationId}
                    onChange={handleInputChange}
                    className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Use custom location text</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} {location.capacity ? `(${location.capacity})` : ''}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  {formData.locationDetails && (
                    <div className="mt-3 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm text-neutral-700">
                      <p className="font-semibold text-neutral-900">{formData.locationDetails.name}</p>
                      <p>{formData.locationDetails.address}</p>
                      {formData.locationDetails.infrastructure?.length > 0 && (
                        <p className="mt-2 text-xs text-neutral-600">
                          Infrastructure: {formData.locationDetails.infrastructure.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                  {formData.locationId && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Location Slot</label>
                      <select
                        name="slotId"
                        value={formData.slotId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select an available slot</option>
                        {availableSlotsForLocation(formData.locationId).map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {formatLocationSlot(slot)} {slot.capacity ? `(${slot.capacity})` : ''}
                          </option>
                        ))}
                      </select>
                      {formData.slotId ? (
                        <p className="mt-2 text-xs text-neutral-500">
                          Date and time will follow this master calendar slot.
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-red-600">
                          No available slots found. Create slots from Events &gt; Locations.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., Free or ₹500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">External Link</label>
                    <input
                      type="url"
                      name="externalLink"
                      value={formData.externalLink}
                      onChange={handleInputChange}
                      placeholder="https://bookmyshow.com/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Event Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {uploading && <p className="text-sm text-neutral-600 mt-2">Uploading...</p>}
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
                    Mark as Featured Event
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Publishing Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="approved">Approved - visible on website</option>
                    <option value="pending_approval">Pending approval</option>
                    <option value="not_approved">Not approved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-3 border border-gray-300 text-neutral-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showRsvpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-800">Event Dashboard</h2>
                  <p className="text-sm text-neutral-600">
                    {selectedEventForRsvps?.title} · {selectedEventRsvps.filter((rsvp) => (rsvp.status || 'confirmed') === 'confirmed').length} active RSVP{selectedEventRsvps.filter((rsvp) => (rsvp.status || 'confirmed') === 'confirmed').length === 1 ? '' : 's'}
                  </p>
                </div>
                <button
                  onClick={() => setShowRsvpModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {selectedEventRsvps.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-neutral-600">No RSVPs found for this event yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-neutral-200">
                    <table className="min-w-full divide-y divide-neutral-200 text-sm">
                      <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                        <tr>
                          <th className="px-4 py-3">Participant</th>
                          <th className="px-4 py-3">Contact</th>
                          <th className="px-4 py-3">Ticket</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Registered</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 bg-white">
                        {selectedEventRsvps.map((rsvp) => (
                          <tr key={rsvp.id}>
                            <td className="px-4 py-3 font-medium text-neutral-900">{rsvp.name || 'Anonymous'}</td>
                            <td className="px-4 py-3 text-neutral-600">
                              <div>{rsvp.email}</div>
                              <div className="text-xs">{rsvp.phone}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-neutral-500">{rsvp.rsvpId || rsvp.id}</td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${(rsvp.status || 'confirmed') === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                  {rsvp.status || 'confirmed'}
                                </span>
                                <div className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${rsvp.checkedIn ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                  {rsvp.checkedIn ? 'Checked in' : 'Not checked in'}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-neutral-500">
                              {rsvp.createdAt?.seconds ? new Date(rsvp.createdAt.seconds * 1000).toLocaleString() : (rsvp.createdAt || 'No date')}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                {(rsvp.status || 'confirmed') === 'confirmed' && (!rsvp.checkedIn ? (
                                  <button onClick={() => setAttendance(rsvp, true)} className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100">
                                    Attend
                                  </button>
                                ) : (
                                  <button onClick={() => setAttendance(rsvp, false)} className="rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-200">
                                    Undo
                                  </button>
                                ))}
                                {(rsvp.status || 'confirmed') === 'confirmed' && (
                                  <button onClick={() => cancelRegistration(rsvp)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
