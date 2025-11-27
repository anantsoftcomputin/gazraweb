import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { getDocuments, deleteDocument } = useFirestore('volunteers');

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      const items = result.success ? result.data : [];
      setVolunteers(items);
      setFilteredVolunteers(items);
    } catch (error) {
      console.error('Error loading volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!Array.isArray(volunteers)) return;
    
    if (searchQuery) {
      const filtered = volunteers.filter(v =>
        v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVolunteers(filtered);
    } else {
      setFilteredVolunteers(volunteers);
    }
  }, [searchQuery, volunteers]);

  const handleDelete = async (volunteer) => {
    if (window.confirm(`Are you sure you want to delete ${volunteer.name}'s application?`)) {
      try {
        await deleteDocument(volunteer.id);
        await loadVolunteers();
      } catch (error) {
        console.error('Error deleting volunteer:', error);
        alert('Failed to delete volunteer application.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Applications</h1>
          <p className="text-gray-600 mt-1">Manage volunteer sign-ups and applications</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredVolunteers.length} of {volunteers.length} applications
          </div>
        </div>

        {/* Volunteers List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : !Array.isArray(filteredVolunteers) || filteredVolunteers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No volunteer applications</h3>
            <p className="text-gray-600">Applications will appear here when people sign up</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredVolunteers.map((volunteer) => (
              <motion.div
                key={volunteer.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{volunteer.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      {volunteer.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <a href={`mailto:${volunteer.email}`} className="hover:text-primary-600">
                            {volunteer.email}
                          </a>
                        </div>
                      )}
                      {volunteer.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${volunteer.phone}`} className="hover:text-primary-600">
                            {volunteer.phone}
                          </a>
                        </div>
                      )}
                      {volunteer.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(volunteer.createdAt.seconds * 1000).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {volunteer.interests && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">
                          <strong>Interests:</strong> {volunteer.interests}
                        </p>
                      </div>
                    )}
                    {volunteer.message && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          <strong>Message:</strong> {volunteer.message}
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(volunteer)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVolunteers;
