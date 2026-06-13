import { useEffect, useState } from 'react';
import { Ban, Building2, CalendarDays, CheckCircle2, Clock, Edit, Image as ImageIcon, Mail, MapPin, Phone, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { auth } from '../../config/firebase';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import { EVENT_CATEGORIES, formatEventDate, getEventMonth } from '../../utils/eventUtils';

const emptyForm = {
  name: '',
  address: '',
  googleMapLink: '',
  email: '',
  phone: '',
  capacity: '',
  infrastructure: [],
  image: '',
  imagePath: '',
  active: true
};

const infrastructureOptions = [
  'Projector',
  'Sound System',
  'Stage',
  'Wi-Fi',
  'Air Conditioning',
  'Accessible Entry',
  'Parking',
  'Cafe Service',
  'Workshop Tables',
  'Outdoor Space'
];

const AdminEventLocations = () => {
  const [locations, setLocations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [bookingForm, setBookingForm] = useState({
    locationId: '',
    eventTitle: '',
    category: 'community',
    dateIso: '',
    startTime: '',
    endTime: '',
    description: '',
    organizer: '',
    contactPhone: '',
    capacity: '',
    price: 'Free'
  });
  const [editingLocation, setEditingLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getDocuments, addDocument, updateDocument, deleteDocument } = useFirestore('eventLocations');
  const { getDocuments: getBookings, addDocument: addBooking, updateDocument: updateBooking } = useFirestore('eventLocationBookings');
  const { addDocument: addEvent, updateDocument: updateEvent } = useFirestore('events');
  const { uploadFile, deleteFile, uploading } = useStorage();

  const loadLocations = async () => {
    setLoading(true);
    const [result, bookingResult] = await Promise.all([
      getDocuments(),
      getBookings()
    ]);
    if (result.success) {
      setLocations(result.data.sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    }
    if (bookingResult.success) {
      setBookings(bookingResult.data.sort((a, b) => `${a.dateIso || ''}${a.startTime || ''}`.localeCompare(`${b.dateIso || ''}${b.startTime || ''}`)));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLocations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openModal = (location = null) => {
    setEditingLocation(location);
    setFormData(location ? {
      name: location.name || '',
      address: location.address || '',
      googleMapLink: location.googleMapLink || '',
      email: location.email || '',
      phone: location.phone || '',
      capacity: location.capacity || '',
      infrastructure: location.infrastructure || [],
      image: location.image || '',
      imagePath: location.imagePath || '',
      active: location.active !== false
    } : emptyForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLocation(null);
    setFormData(emptyForm);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleInfrastructure = (item) => {
    setFormData((prev) => ({
      ...prev,
      infrastructure: prev.infrastructure.includes(item)
        ? prev.infrastructure.filter((value) => value !== item)
        : [...prev.infrastructure, item]
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, 'eventLocations');
    if (result.success) {
      if (formData.imagePath) {
        await deleteFile(formData.imagePath);
      }
      setFormData((prev) => ({
        ...prev,
        image: result.url,
        imagePath: result.path
      }));
    } else {
      alert(result.error || 'Unable to upload location image.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      capacity: Number(formData.capacity) || formData.capacity
    };

    const result = editingLocation
      ? await updateDocument(editingLocation.id, payload)
      : await addDocument(payload);

    if (result.success) {
      await loadLocations();
      closeModal();
    } else {
      alert(result.error || 'Unable to save location.');
    }
  };

  const handleDelete = async (location) => {
    if (!window.confirm(`Delete ${location.name}? Existing events will keep their saved location text.`)) return;
    const result = await deleteDocument(location.id);
    if (result.success) {
      if (location.imagePath) await deleteFile(location.imagePath);
      await loadLocations();
    }
  };

  const bookingsForLocation = (locationId) =>
    bookings.filter((booking) => booking.locationId === locationId && booking.status !== 'cancelled');

  const openBookingModal = (location) => {
    setBookingForm({
      locationId: location.id,
      eventTitle: '',
      category: 'community',
      dateIso: '',
      startTime: '',
      endTime: '',
      description: '',
      organizer: auth.currentUser?.email || '',
      contactPhone: '',
      capacity: location.capacity ? String(location.capacity) : '',
      price: 'Free'
    });
    setShowBookingModal(true);
  };

  const closeBookingModal = () => setShowBookingModal(false);

  const handleBookingInputChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    const location = locations.find((item) => item.id === bookingForm.locationId);
    if (!location) return;

    const currentUser = auth.currentUser;
    const eventPayload = {
      title: bookingForm.eventTitle,
      category: bookingForm.category,
      dateIso: bookingForm.dateIso,
      date: formatEventDate({ dateIso: bookingForm.dateIso }),
      month: getEventMonth({ dateIso: bookingForm.dateIso }),
      time: `${bookingForm.startTime}${bookingForm.endTime ? ` - ${bookingForm.endTime}` : ''}`,
      location: location.name,
      locationId: location.id,
      locationDetails: {
        id: location.id,
        name: location.name || '',
        address: location.address || '',
        googleMapLink: location.googleMapLink || '',
        email: location.email || '',
        phone: location.phone || '',
        capacity: location.capacity || '',
        infrastructure: location.infrastructure || [],
        image: location.image || ''
      },
      capacity: bookingForm.capacity || location.capacity || '',
      description: bookingForm.description,
      price: bookingForm.price || 'Free',
      ticketsLeft: '',
      organizer: bookingForm.organizer,
      contactPhone: bookingForm.contactPhone,
      rsvpDeadline: '',
      externalLink: '',
      featured: false,
      image: location.image || '',
      status: 'pending_approval',
      approvalStatus: 'pending',
      registrationCount: 0
    };

    const eventResult = await addEvent(eventPayload);
    if (!eventResult.success) {
      alert(eventResult.error || 'Unable to create pending event.');
      return;
    }

    const bookingResult = await addBooking({
      ...bookingForm,
      eventId: eventResult.id,
      locationName: location.name || '',
      locationAddress: location.address || '',
      status: 'pending',
      requesterUid: currentUser?.uid || '',
      requesterName: currentUser?.displayName || currentUser?.email || 'Admin user',
      requesterEmail: currentUser?.email || '',
      decisionNote: ''
    });

    if (bookingResult.success) {
      await loadLocations();
      closeBookingModal();
      alert('Location booking request sent for approval.');
    } else {
      alert(bookingResult.error || 'Unable to create booking request.');
    }
  };

  const decideBooking = async (booking, status) => {
    const decisionNote = window.prompt(status === 'approved' ? 'Approval note (optional)' : 'Reason for not approving this booking', booking.decisionNote || '');
    if (decisionNote === null) return;

    const result = await updateBooking(booking.id, {
      status,
      decisionNote,
      decidedBy: auth.currentUser?.email || 'admin',
      decidedAt: new Date().toISOString()
    });

    if (result.success) {
      if (booking.eventId) {
        await updateEvent(booking.eventId, {
          status: status === 'approved' ? 'approved' : 'not_approved',
          approvalStatus: status,
          rejectionReason: status === 'not_approved' ? decisionNote : '',
          approvedAt: status === 'approved' ? new Date().toISOString() : ''
        });
      }
      await loadLocations();
    } else {
      alert(result.error || 'Unable to update booking decision.');
    }
  };

  const statusClass = (status) => {
    if (status === 'approved') return 'bg-green-50 text-green-700 border-green-200';
    if (status === 'not_approved') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Location Master</h1>
            <p className="text-neutral-600 mt-2">Create and manage event venues, capacity, contact details, and infrastructure.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Location
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : locations.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
            <h3 className="mb-2 text-xl font-bold text-neutral-800">No Locations Yet</h3>
            <p className="mb-4 text-neutral-600">Create your first venue before creating venue-linked events.</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
            >
              <Plus className="h-5 w-5" />
              Add Location
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location) => (
              <div key={location.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {location.image ? (
                  <img src={location.image} alt={location.name} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-neutral-100 text-neutral-400">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                <div className="space-y-4 p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-neutral-900">{location.name}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs ${location.active !== false ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                        {location.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600">{location.address}</p>
                  </div>

                  <div className="space-y-2 text-sm text-neutral-600">
                    <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Capacity: {location.capacity || 'Not set'}</p>
                    {location.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {location.phone}</p>}
                    {location.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {location.email}</p>}
                    {location.googleMapLink && (
                      <a href={location.googleMapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
                        <MapPin className="h-4 w-4" />
                        Google Map
                      </a>
                    )}
                  </div>

                  {location.infrastructure?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {location.infrastructure.map((item) => (
                        <span key={item} className="rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">{item}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => openBookingModal(location)} className="flex-1 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-700 hover:bg-primary-100">
                      <CalendarDays className="mr-1 inline h-4 w-4" />
                      Calendar
                    </button>
                    <button onClick={() => openModal(location)} className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100">
                      <Edit className="mr-1 inline h-4 w-4" />
                      Edit
                    </button>
                    <button onClick={() => handleDelete(location)} className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100">
                      <Trash2 className="mr-1 inline h-4 w-4" />
                      Delete
                    </button>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-neutral-800">Location Calendar</p>
                      <span className="text-xs text-neutral-500">{bookingsForLocation(location.id).length} slot{bookingsForLocation(location.id).length === 1 ? '' : 's'}</span>
                    </div>
                    <div className="space-y-2">
                      {bookingsForLocation(location.id).slice(0, 4).map((booking) => (
                        <div key={booking.id} className="rounded-lg border border-white bg-white p-3 text-sm shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-neutral-900">{booking.eventTitle}</p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-neutral-600">
                                <Clock className="h-3.5 w-3.5" />
                                {booking.dateIso} · {booking.startTime}{booking.endTime ? ` - ${booking.endTime}` : ''}
                              </p>
                              {booking.requesterEmail && <p className="mt-1 text-xs text-neutral-500">{booking.requesterEmail}</p>}
                            </div>
                            <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClass(booking.status)}`}>
                              {booking.status === 'not_approved' ? 'Not approved' : booking.status}
                            </span>
                          </div>
                          {booking.status === 'pending' && (
                            <div className="mt-3 flex gap-2">
                              <button onClick={() => decideBooking(booking, 'approved')} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-50 px-2 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Approve
                              </button>
                              <button onClick={() => decideBooking(booking, 'not_approved')} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">
                                <Ban className="h-3.5 w-3.5" />
                                Not approve
                              </button>
                            </div>
                          )}
                          {booking.status === 'approved' && (
                            <button onClick={() => decideBooking(booking, 'not_approved')} className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">
                              <Ban className="h-3.5 w-3.5" />
                              Change to not approved
                            </button>
                          )}
                        </div>
                      ))}
                      {bookingsForLocation(location.id).length === 0 && (
                        <p className="rounded-lg border border-dashed border-neutral-200 bg-white p-3 text-xs text-neutral-500">No booking requests yet. Available for new events.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
                <h2 className="text-2xl font-bold text-neutral-800">{editingLocation ? 'Edit Location' : 'Add Location'}</h2>
                <button onClick={closeModal} className="rounded-lg p-2 hover:bg-gray-100">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Location Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Capacity</label>
                    <input name="capacity" type="number" min="0" value={formData.capacity} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} required rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Google Map Link</label>
                  <input name="googleMapLink" type="url" value={formData.googleMapLink} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Phone</label>
                    <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-neutral-700">Infrastructure Available</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {infrastructureOptions.map((item) => (
                      <label key={item} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                        <input type="checkbox" checked={formData.infrastructure.includes(item)} onChange={() => toggleInfrastructure(item)} className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Location Image</label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-8 text-neutral-600 hover:border-primary-400 hover:text-primary-600">
                    <Upload className="h-5 w-5" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {formData.image && <img src={formData.image} alt="Location preview" className="mt-3 h-48 w-full rounded-lg object-cover" />}
                </div>

                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input name="active" type="checkbox" checked={formData.active} onChange={handleInputChange} className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  Active location
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={uploading} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-white hover:bg-primary-600 disabled:opacity-50">
                    <Save className="h-5 w-5" />
                    Save Location
                  </button>
                  <button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-3 text-neutral-700 hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
                <h2 className="text-2xl font-bold text-neutral-800">Request Location Booking</h2>
                <button onClick={closeBookingModal} className="rounded-lg p-2 hover:bg-gray-100">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Location</label>
                  <select name="locationId" value={bookingForm.locationId} onChange={handleBookingInputChange} required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                    <option value="">Select location</option>
                    {locations.filter((location) => location.active !== false).map((location) => (
                      <option key={location.id} value={location.id}>{location.name} {location.capacity ? `(${location.capacity})` : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Event Title</label>
                    <input name="eventTitle" value={bookingForm.eventTitle} onChange={handleBookingInputChange} required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Category</label>
                    <select name="category" value={bookingForm.category} onChange={handleBookingInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                      {EVENT_CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Date</label>
                    <input name="dateIso" type="date" value={bookingForm.dateIso} onChange={handleBookingInputChange} required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Start Time</label>
                    <input name="startTime" type="time" value={bookingForm.startTime} onChange={handleBookingInputChange} required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">End Time</label>
                    <input name="endTime" type="time" value={bookingForm.endTime} onChange={handleBookingInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Capacity</label>
                    <input name="capacity" value={bookingForm.capacity} onChange={handleBookingInputChange} required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Price</label>
                    <input name="price" value={bookingForm.price} onChange={handleBookingInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Contact Phone</label>
                    <input name="contactPhone" value={bookingForm.contactPhone} onChange={handleBookingInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Organizer</label>
                  <input name="organizer" value={bookingForm.organizer} onChange={handleBookingInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Event Description</label>
                  <textarea name="description" value={bookingForm.description} onChange={handleBookingInputChange} required rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-white hover:bg-primary-600">
                    <Save className="h-5 w-5" />
                    Send Booking Request
                  </button>
                  <button type="button" onClick={closeBookingModal} className="rounded-lg border border-gray-300 px-4 py-3 text-neutral-700 hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEventLocations;
