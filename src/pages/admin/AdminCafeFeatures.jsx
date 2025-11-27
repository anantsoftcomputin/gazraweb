import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, ChefHat, Leaf, Coffee, Heart, Sparkles } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';

const AdminCafeFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { getDocuments, addDocument, updateDocument, deleteDocument } = useFirestore('cafeFeatures');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'ChefHat',
    order: 0
  });

  const iconOptions = [
    { id: 'ChefHat', name: 'Chef Hat', component: ChefHat },
    { id: 'Leaf', name: 'Leaf', component: Leaf },
    { id: 'Coffee', name: 'Coffee', component: Coffee },
    { id: 'Heart', name: 'Heart', component: Heart },
    { id: 'Sparkles', name: 'Sparkles', component: Sparkles }
  ];

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      const items = result.success ? result.data : [];
      // Sort by order
      const sortedItems = items.sort((a, b) => (a.order || 0) - (b.order || 0));
      setFeatures(sortedItems);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openModal = (feature = null) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        order: feature.order || 0
      });
    } else {
      setEditingFeature(null);
      setFormData({
        title: '',
        description: '',
        icon: 'ChefHat',
        order: features.length
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFeature(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFeature) {
        await updateDocument(editingFeature.id, formData);
      } else {
        await addDocument(formData);
      }

      await loadFeatures();
      closeModal();
    } catch (error) {
      console.error('Error saving feature:', error);
      alert('Failed to save feature. Please try again.');
    }
  };

  const handleDelete = async (feature) => {
    if (window.confirm(`Are you sure you want to delete "${feature.title}"?`)) {
      try {
        await deleteDocument(feature.id);
        await loadFeatures();
      } catch (error) {
        console.error('Error deleting feature:', error);
        alert('Failed to delete feature. Please try again.');
      }
    }
  };

  const getIconComponent = (iconName) => {
    const icon = iconOptions.find(i => i.id === iconName);
    return icon ? icon.component : ChefHat;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cafe Features</h1>
            <p className="text-gray-600 mt-1">Manage the feature highlights shown on the cafe page</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal()}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Feature
          </motion.button>
        </div>

        {/* Features Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : features.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No features yet</h3>
            <p className="text-gray-600">Add features to highlight what makes your cafe special</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <motion.div
                  key={feature.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    
                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100 w-full">
                      <button
                        onClick={() => openModal(feature)}
                        className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDelete(feature)}
                        className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingFeature ? 'Edit Feature' : 'Add Feature'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Expert Chefs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description..."
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon *
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((iconOption) => {
                      const IconComp = iconOption.component;
                      return (
                        <button
                          key={iconOption.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: iconOption.id })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.icon === iconOption.id
                              ? 'border-primary-600 bg-primary-50 text-primary-600'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title={iconOption.name}
                        >
                          <IconComp className="w-6 h-6 mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingFeature ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCafeFeatures;
