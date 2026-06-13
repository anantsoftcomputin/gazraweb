import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Image as ImageIcon, X, Save, Upload } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import AdminLayout from '../../layouts/AdminLayout';

const AdminCafeMoments = () => {
  const [moments, setMoments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMoment, setEditingMoment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    images: [],
    featured: false
  });

  const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('cafeMoments');
  const { uploadFile, uploading } = useStorage();

  useEffect(() => {
    loadMoments();
  }, []);

  const loadMoments = async () => {
    try {
      const result = await getDocuments();
      if (result.success) {
        const sortedMoments = result.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMoments(sortedMoments);
      }
    } catch (error) {
      console.error('Error loading moments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadedUrls = [];
    for (const file of files) {
      const result = await uploadFile(file, 'cafeMoments');
      if (result.success) {
        uploadedUrls.push(result.url);
      }
    }
    
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...uploadedUrls] 
    }));
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    if (editingMoment) {
      // When editing, only update single moment with first image
      const result = await updateDocument(editingMoment.id, {
        ...formData,
        image: formData.images[0]
      });
      if (result.success) {
        alert('Moment updated successfully!');
        setShowModal(false);
        loadMoments();
        resetForm();
      }
    } else {
      // When adding new, create separate moment for each image
      let successCount = 0;
      for (const imageUrl of formData.images) {
        const result = await addDocument({
          title: formData.title,
          date: formData.date,
          description: formData.description,
          image: imageUrl,
          featured: formData.featured,
          createdAt: new Date().toISOString()
        });
        if (result.success) {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        alert(`${successCount} moment(s) added successfully!`);
        setShowModal(false);
        loadMoments();
        resetForm();
      }
    }
  };

  const handleEdit = (moment) => {
    setEditingMoment(moment);
    setFormData({
      title: moment.title,
      date: moment.date,
      description: moment.description || '',
      images: [moment.image],
      featured: moment.featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this moment?')) {
      const result = await deleteDocument(id);
      if (result.success) {
        alert('Moment deleted successfully!');
        loadMoments();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      description: '',
      images: [],
      featured: false
    });
    setEditingMoment(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading moments...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Cafe Moments & Memories</h1>
            <p className="text-neutral-600 mt-2">Manage memorable moments from the cafe</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Moment
          </button>
        </div>

        {/* Moments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moments.map((moment) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={moment.image}
                  alt={moment.title}
                  className="w-full h-full object-cover"
                />
                {moment.featured && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(moment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">{moment.title}</h3>
                {moment.description && (
                  <p className="text-sm text-neutral-600 line-clamp-2 mb-4">{moment.description}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(moment)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(moment.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {moments.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-600 mb-2">No moments yet</h3>
            <p className="text-neutral-500">Add your first cafe moment to get started</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-neutral-800">
                    {editingMoment ? 'Edit Moment' : 'Add New Moment'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Images * {!editingMoment && '(You can select multiple images)'}
                    </label>
                    
                    {/* Image Preview Grid */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                        {formData.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    {(!editingMoment || formData.images.length === 0) && (
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                        <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                        <span className="text-sm text-neutral-500">
                          {uploading ? 'Uploading...' : editingMoment ? 'Click to change image' : 'Click to upload images'}
                        </span>
                        <span className="text-xs text-neutral-400 mt-1">
                          {!editingMoment && 'Hold Ctrl/Cmd to select multiple'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple={!editingMoment}
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Optional description about this moment..."
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
                      Mark as featured
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {editingMoment ? 'Update' : 'Add'} Moment
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCafeMoments;
