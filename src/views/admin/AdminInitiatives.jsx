import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const AdminInitiatives = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Initiatives Management</h1>
          <p className="text-gray-600 mt-1">Manage organization initiatives (Coming Soon)</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Initiatives Management</h3>
          <p className="text-gray-600 mb-6">
            Full initiative management with descriptions, images, and impact tracking is coming soon.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg">
            <Plus className="w-5 h-5 mr-2" />
            Feature Under Development
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInitiatives;
