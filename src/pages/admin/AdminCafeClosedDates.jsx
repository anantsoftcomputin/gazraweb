import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';

const AdminCafeClosedDates = () => {
  const [closedDates, setClosedDates] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { getDocuments, addDocument, deleteDocument } = useFirestore('cafeClosedDates');

  useEffect(() => {
    loadClosedDates();
  }, []);

  const loadClosedDates = async () => {
    setLoading(true);
    try {
      const result = await getDocuments();
      if (result.success && result.data) {
        // Sort by date
        const sorted = result.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setClosedDates(sorted);
      }
    } catch (error) {
      console.error('Error loading closed dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    if (!newDate) return;

    setSubmitting(true);
    try {
      const result = await addDocument({
        date: newDate,
        reason: reason || 'Cafe Closed',
        addedAt: new Date().toISOString()
      });

      if (result.success) {
        setNewDate('');
        setReason('');
        loadClosedDates();
      }
    } catch (error) {
      console.error('Error adding closed date:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDate = async (id) => {
    if (!window.confirm('Are you sure you want to remove this closed date?')) return;

    try {
      const result = await deleteDocument(id);
      if (result.success) {
        setClosedDates(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting closed date:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cafe Closed Dates</h1>
          <p className="text-gray-600">Manage dates when the cafe will be closed for bookings</p>
        </div>

        {/* Add New Closed Date */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Closed Date
          </h2>
          
          <form onSubmit={handleAddDate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={today}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Holiday, Maintenance"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !newDate}
              className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Closed Date'}
            </button>
          </form>
        </div>

        {/* Closed Dates List */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Closed Dates ({closedDates.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading closed dates...</p>
            </div>
          ) : closedDates.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No closed dates configured</p>
              <p className="text-sm text-gray-400 mt-2">Add dates when the cafe will be closed for table bookings</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {closedDates.map((item) => {
                const isPast = new Date(item.date) < new Date(today);
                return (
                  <div
                    key={item.id}
                    className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      isPast ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {new Date(item.date + 'T00:00:00').toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        {isPast && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                            Past
                          </span>
                        )}
                      </div>
                      {item.reason && (
                        <p className="text-gray-600 ml-8">{item.reason}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteDate(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove closed date"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Customers won't be able to book tables on the dates you mark as closed</li>
                <li>• When they select a closed date, they'll see a warning message</li>
                <li>• Past dates are shown for reference but don't affect new bookings</li>
                <li>• You can add holidays, maintenance days, or any other closures</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCafeClosedDates;
