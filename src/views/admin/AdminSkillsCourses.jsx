import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, X, Save, ChefHat, Scissors, Monitor, Palette } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import AdminLayout from '../../layouts/AdminLayout';

const AdminSkillsCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'hospitality',
    icon: 'ChefHat',
    duration: '',
    batchSize: '',
    schedule: '',
    placementSupport: true,
    overview: '',
    modules: [],
    skills: [],
    careerOpportunities: [],
    featured: false,
    active: true
  });

  const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('skillsCourses');

  const iconOptions = [
    { value: 'ChefHat', label: 'Chef Hat (Hospitality)', icon: ChefHat },
    { value: 'Scissors', label: 'Scissors (Beauty)', icon: Scissors },
    { value: 'Palette', label: 'Palette (Crafts)', icon: Palette },
    { value: 'Monitor', label: 'Monitor (Digital)', icon: Monitor }
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const result = await getDocuments();
    if (result.success) {
      setCourses(result.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInput = (field, value) => {
    const items = value.split('\n').filter(item => item.trim() !== '');
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleModuleChange = (index, field, value) => {
    const newModules = [...formData.modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', duration: '', topics: [] }]
    }));
  };

  const removeModule = (index) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingCourse) {
      const result = await updateDocument(editingCourse.id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      if (result.success) {
        alert('Course updated successfully!');
        setShowModal(false);
        loadCourses();
        resetForm();
      }
    } else {
      const result = await addDocument({
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      if (result.success) {
        alert('Course added successfully!');
        setShowModal(false);
        loadCourses();
        resetForm();
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      icon: course.icon,
      duration: course.duration,
      batchSize: course.batchSize,
      schedule: course.schedule,
      placementSupport: course.placementSupport,
      overview: course.overview,
      modules: course.modules || [],
      skills: course.skills || [],
      careerOpportunities: course.careerOpportunities || [],
      featured: course.featured || false,
      active: course.active !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const result = await deleteDocument(id);
      if (result.success) {
        alert('Course deleted successfully!');
        loadCourses();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'hospitality',
      icon: 'ChefHat',
      duration: '',
      batchSize: '',
      schedule: '',
      placementSupport: true,
      overview: '',
      modules: [],
      skills: [],
      careerOpportunities: [],
      featured: false,
      active: true
    });
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading courses...</p>
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
            <h1 className="text-3xl font-bold text-neutral-800">Skills Courses</h1>
            <p className="text-neutral-600 mt-2">Manage vocational training courses</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Course
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const IconComponent = iconOptions.find(opt => opt.value === course.icon)?.icon || BookOpen;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
              >
                {/* Course Header */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-4 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">{course.title}</h3>
                        <p className="text-sm text-white/80">{course.category}</p>
                      </div>
                    </div>
                    {course.featured && (
                      <span className="px-2 py-1 bg-amber-500 text-xs rounded-full">Featured</span>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Batch Size:</span>
                      <span className="font-medium">{course.batchSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Status:</span>
                      <span className={`font-medium ${course.active ? 'text-green-600' : 'text-red-600'}`}>
                        {course.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-600 mb-2">No courses yet</h3>
            <p className="text-neutral-500">Add your first skills course to get started</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8"
            >
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-neutral-800">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="hospitality">Hospitality</option>
                        <option value="beauty">Beauty & Wellness</option>
                        <option value="crafts">Crafts & Artisan</option>
                        <option value="digital">Digital Skills</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Icon *
                      </label>
                      <select
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Duration *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 12 Weeks"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Batch Size *
                      </label>
                      <input
                        type="text"
                        name="batchSize"
                        value={formData.batchSize}
                        onChange={handleInputChange}
                        placeholder="e.g., 15 Students"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Schedule *
                      </label>
                      <input
                        type="text"
                        name="schedule"
                        value={formData.schedule}
                        onChange={handleInputChange}
                        placeholder="e.g., Weekdays & Weekend Batches"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Overview */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Course Overview *
                    </label>
                    <textarea
                      name="overview"
                      value={formData.overview}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe the course..."
                      required
                    />
                  </div>

                  {/* Skills (one per line) */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Skills Gained (one per line)
                    </label>
                    <textarea
                      value={formData.skills.join('\n')}
                      onChange={(e) => handleArrayInput('skills', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter skills, one per line"
                    />
                  </div>

                  {/* Career Opportunities */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Career Opportunities (one per line)
                    </label>
                    <textarea
                      value={formData.careerOpportunities.join('\n')}
                      onChange={(e) => handleArrayInput('careerOpportunities', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter career paths, one per line"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="placementSupport"
                        checked={formData.placementSupport}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-neutral-700">Placement Support</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-neutral-700">Featured Course</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-neutral-700">Active</span>
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
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {editingCourse ? 'Update' : 'Add'} Course
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

export default AdminSkillsCourses;
