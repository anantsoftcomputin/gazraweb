import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Trash2, Calendar, Download } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { getDocuments, deleteDocument } = useFirestore('newsletter');

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      const items = result.success ? result.data : [];
      setSubscribers(items);
      setFilteredSubscribers(items);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!Array.isArray(subscribers)) return;
    
    if (searchQuery) {
      const filtered = subscribers.filter(s =>
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [searchQuery, subscribers]);

  const handleDelete = async (subscriber) => {
    if (window.confirm(`Are you sure you want to unsubscribe ${subscriber.email}?`)) {
      try {
        await deleteDocument(subscriber.id);
        await loadSubscribers();
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        alert('Failed to remove subscriber.');
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Subscribed Date'],
      ...filteredSubscribers.map(s => [
        s.email,
        s.createdAt ? new Date(s.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <p className="text-gray-600 mt-1">Manage newsletter email list</p>
          </div>
          {filteredSubscribers.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </motion.button>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
          </div>
        </div>

        {/* Subscribers List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : !Array.isArray(filteredSubscribers) || filteredSubscribers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscribers yet</h3>
            <p className="text-gray-600">Newsletter sign-ups will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <motion.tr
                    key={subscriber.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <a
                          href={`mailto:${subscriber.email}`}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          {subscriber.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {subscriber.createdAt
                          ? new Date(subscriber.createdAt.seconds * 1000).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(subscriber)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
