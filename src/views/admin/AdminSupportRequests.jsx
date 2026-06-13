import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Trash2, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';

const AdminSupportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { getDocuments, deleteDocument } = useFirestore('supportRequests');

  const loadRequests = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      const items = result.success ? result.data : [];
      setRequests(items);
      setFilteredRequests(items);
    } catch (error) {
      console.error('Error loading support requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!Array.isArray(requests)) return;
    
    if (searchQuery) {
      const filtered = requests.filter(r =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  }, [searchQuery, requests]);

  const handleDelete = async (request) => {
    if (window.confirm(`Are you sure you want to delete this support request from ${request.name}?`)) {
      try {
        await deleteDocument(request.id);
        await loadRequests();
      } catch (error) {
        console.error('Error deleting support request:', error);
        alert('Failed to delete support request.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Fund Requests</h1>
          <p className="text-gray-600 mt-1">Manage financial support applications</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search support requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : !Array.isArray(filteredRequests) || filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No support requests</h3>
            <p className="text-gray-600">Support fund applications will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                      {request.amount && (
                        <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {request.amount}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {request.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <a href={`mailto:${request.email}`} className="hover:text-primary-600">
                            {request.email}
                          </a>
                        </div>
                      )}
                      {request.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${request.phone}`} className="hover:text-primary-600">
                            {request.phone}
                          </a>
                        </div>
                      )}
                      {request.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(request.createdAt.seconds * 1000).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {request.purpose && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">
                          Purpose: {request.purpose}
                        </p>
                      </div>
                    )}
                    {request.reason && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.reason}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(request)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
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

export default AdminSupportRequests;
