import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { getDocuments, deleteDocument } = useFirestore('contactMessages');

  const loadMessages = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      const items = result.success ? result.data : [];
      setMessages(items);
      setFilteredMessages(items);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!Array.isArray(messages)) return;
    
    if (searchQuery) {
      const filtered = messages.filter(m =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchQuery, messages]);

  const handleDelete = async (message) => {
    if (window.confirm(`Are you sure you want to delete this message from ${message.name}?`)) {
      try {
        await deleteDocument(message.id);
        await loadMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 mt-1">Messages from the contact form</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredMessages.length} of {messages.length} messages
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : !Array.isArray(filteredMessages) || filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Messages from the contact form will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{message.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {message.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <a href={`mailto:${message.email}`} className="hover:text-primary-600">
                            {message.email}
                          </a>
                        </div>
                      )}
                      {message.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${message.phone}`} className="hover:text-primary-600">
                            {message.phone}
                          </a>
                        </div>
                      )}
                      {message.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(message.createdAt.seconds * 1000).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {message.subject && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">
                          Subject: {message.subject}
                        </p>
                      </div>
                    )}
                    {message.message && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.message}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(message)}
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

export default AdminMessages;
