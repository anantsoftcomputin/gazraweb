import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Phone, Mail, User, Filter, Check, X, MessageSquare, Search, Send } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { mockSendSMS } from '../../utils/smsService';

const AdminCafeBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: '',
    partySize: '',
    status: 'all',
    search: ''
  });

  const { getDocuments, updateDocument, deleteDocument } = useFirestore('cafeBookings');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const result = await getDocuments();
      if (result.success) {
        // Sort by creation date, newest first
        const sorted = result.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sorted);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Filter by date
    if (filters.date) {
      filtered = filtered.filter(booking => booking.bookingDate === filters.date);
    }

    // Filter by party size
    if (filters.partySize) {
      filtered = filtered.filter(booking => booking.partySize === filters.partySize);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Filter by search (name, email, phone)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.name.toLowerCase().includes(searchLower) ||
        booking.email.toLowerCase().includes(searchLower) ||
        booking.phone.includes(filters.search)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const result = await updateDocument(bookingId, { status: newStatus });
      if (result.success) {
        // Find the booking
        const booking = bookings.find(b => b.id === bookingId);
        
        // Send SMS if confirmed
        if (newStatus === 'confirmed' && booking) {
          const message = `Your booking at Gazra Cafe is confirmed! We look forward to serving you on ${new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at ${booking.time}. Please reach 10 minutes early to avoid waiting. To cancel, call us at least 30 minutes beforehand: 82003 06871`;
          
          mockSendSMS(booking.phone, message);
          
          alert('Booking confirmed! SMS sent to customer.');
        }
        
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      const result = await deleteDocument(bookingId);
      if (result.success) {
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      partySize: '',
      status: 'all',
      search: ''
    });
  };

  const statsData = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cafe Table Bookings</h1>
          <p className="text-gray-600">Manage and track all restaurant reservations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{statsData.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
            <p className="text-yellow-800 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{statsData.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
            <p className="text-green-800 text-sm mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-green-900">{statsData.confirmed}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
            <p className="text-blue-800 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-900">{statsData.completed}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
            <p className="text-red-800 text-sm mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-900">{statsData.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                placeholder="Name, email, or phone"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Party Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Party Size
              </label>
              <select
                value={filters.partySize}
                onChange={(e) => handleFilterChange('partySize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Sizes</option>
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5 People</option>
                <option value="6">6 People</option>
                <option value="7">7 People</option>
                <option value="8">8 People</option>
                <option value="9+">9+ People</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All Filters
          </button>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Bookings ({filteredBookings.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No bookings found matching your filters
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <a href={`mailto:${booking.email}`} className="hover:text-primary-600">
                                {booking.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:${booking.phone}`} className="hover:text-primary-600">
                                {booking.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {booking.bookingTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {booking.partySize} {booking.partySize === '1' ? 'Person' : 'People'}
                            </div>
                          </div>

                          {booking.specialRequests && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-start gap-2 text-sm">
                                <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="font-medium text-gray-700 mb-1">Special Requests:</p>
                                  <p className="text-gray-600">{booking.specialRequests}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Check className="w-4 h-4" />
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Check className="w-4 h-4" />
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    Submitted: {new Date(booking.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCafeBookings;
