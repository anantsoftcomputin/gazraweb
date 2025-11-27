import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Trash2, Filter, Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import AdminLayout from '../../layouts/AdminLayout';

const AdminSkillsEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const { getDocuments, updateDocument, deleteDocument, loading } = useFirestore('skillsEnrollments');

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, statusFilter, searchTerm]);

  const loadEnrollments = async () => {
    const result = await getDocuments();
    if (result.success) {
      const sorted = result.data.sort((a, b) => 
        new Date(b.submittedAt) - new Date(a.submittedAt)
      );
      setEnrollments(sorted);
    }
  };

  const filterEnrollments = () => {
    let filtered = [...enrollments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.courseSelected?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEnrollments(filtered);
  };

  const updateStatus = async (id, newStatus) => {
    const result = await updateDocument(id, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    if (result.success) {
      alert(`Status updated to ${newStatus}`);
      loadEnrollments();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      const result = await deleteDocument(id);
      if (result.success) {
        alert('Enrollment deleted successfully!');
        loadEnrollments();
        setSelectedEnrollment(null);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading enrollments...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Skills Enrollments</h1>
          <p className="text-neutral-600 mt-2">Manage course enrollment applications</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="text-sm text-neutral-600">Total</div>
            <div className="text-2xl font-bold text-neutral-800">{enrollments.length}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
            <div className="text-sm text-yellow-800">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">
              {enrollments.filter(e => e.status === 'pending').length}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
            <div className="text-sm text-green-800">Approved</div>
            <div className="text-2xl font-bold text-green-900">
              {enrollments.filter(e => e.status === 'approved').length}
            </div>
          </div>
          <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
            <div className="text-sm text-red-800">Rejected</div>
            <div className="text-2xl font-bold text-red-900">
              {enrollments.filter(e => e.status === 'rejected').length}
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-800">
                      {enrollment.fullName}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {enrollment.courseSelected}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      <div>{enrollment.email}</div>
                      <div className="text-xs text-neutral-500">{enrollment.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {new Date(enrollment.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                        {getStatusIcon(enrollment.status)}
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedEnrollment(enrollment)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEnrollments.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-neutral-600 mb-2">No enrollments found</h3>
              <p className="text-neutral-500">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedEnrollment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-800">{selectedEnrollment.fullName}</h2>
                    <p className="text-neutral-600">{selectedEnrollment.courseSelected}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEnrollment(null)}
                    className="p-2 hover:bg-neutral-100 rounded-lg"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-3">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Email:</span>
                        <p className="font-medium">{selectedEnrollment.email}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600">Phone:</span>
                        <p className="font-medium">{selectedEnrollment.phoneNumber}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600">Date of Birth:</span>
                        <p className="font-medium">{selectedEnrollment.dateOfBirth}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600">Gender:</span>
                        <p className="font-medium">{selectedEnrollment.gender}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-neutral-600">Address:</span>
                        <p className="font-medium">{selectedEnrollment.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div>
                    <h3 className="font-semibold text-neutral-800 mb-3">Course Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Batch Timing:</span>
                        <p className="font-medium">{selectedEnrollment.batchTiming}</p>
                      </div>
                      <div>
                        <span className="text-neutral-600">Employment Status:</span>
                        <p className="font-medium">{selectedEnrollment.employmentStatus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Motivation */}
                  {selectedEnrollment.motivation && (
                    <div>
                      <h3 className="font-semibold text-neutral-800 mb-3">Motivation</h3>
                      <p className="text-sm text-neutral-600">{selectedEnrollment.motivation}</p>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => updateStatus(selectedEnrollment.id, 'approved')}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedEnrollment.id, 'pending')}
                      className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                    >
                      Mark Pending
                    </button>
                    <button
                      onClick={() => updateStatus(selectedEnrollment.id, 'rejected')}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(selectedEnrollment.id)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSkillsEnrollments;
