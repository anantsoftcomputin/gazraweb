/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, X, Save, Edit2, Eye, EyeOff, LifeBuoy,
  Scale, Brain, Stethoscope, Briefcase, TrendingUp, Award,
} from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import AdminLayout from '../../layouts/AdminLayout';

const CATEGORY_OPTIONS = [
  { value: 'legal', label: 'Legal Aid', icon: Scale },
  { value: 'mental-health', label: 'Mental Health', icon: Brain },
  { value: 'medical', label: 'Medical Aid', icon: Stethoscope },
  { value: 'jobs', label: 'Jobs', icon: Briefcase },
];

const FUNDING_OPTIONS = [
  { value: 'government', label: 'Government' },
  { value: 'private', label: 'Private / NGO' },
];

const emptyForm = {
  name: '', orgName: '', description: '', category: 'legal', fundingType: 'government',
  website: '', phone: '', email: '', tags: '', status: 'active',
};

const categoryLabel = (value) => CATEGORY_OPTIONS.find((c) => c.value === value)?.label || value;

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFunding, setFilterFunding] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('resources');

  useEffect(() => { loadResources(); }, []);

  const loadResources = async () => {
    const result = await getDocuments();
    if (result.success) {
      const sorted = [...result.data].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      setResources(sorted);
    }
  };

  const stats = useMemo(() => {
    const totalViews = resources.reduce((sum, r) => sum + (r.viewCount || 0), 0);
    const mostViewed = resources[0] || null;
    const categoryUsage = {};
    resources.forEach((r) => {
      categoryUsage[r.category] = (categoryUsage[r.category] || 0) + (r.viewCount || 0);
    });
    const mostUsedCategory = Object.entries(categoryUsage).sort((a, b) => b[1] - a[1])[0] || null;
    return { totalViews, mostViewed, mostUsedCategory };
  }, [resources]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.orgName.trim() || !formData.description.trim()) {
      alert('Name, organization, and description are required.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      orgName: formData.orgName.trim(),
      description: formData.description.trim(),
      category: formData.category,
      fundingType: formData.fundingType,
      website: formData.website.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: formData.status,
      viewCount: editingResource?.viewCount || 0,
    };

    const result = editingResource
      ? await updateDocument(editingResource.id, payload)
      : await addDocument(payload);

    if (result.success) { closeModal(); loadResources(); }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name || '', orgName: resource.orgName || '', description: resource.description || '',
      category: resource.category || 'legal', fundingType: resource.fundingType || 'government',
      website: resource.website || '', phone: resource.phone || '', email: resource.email || '',
      tags: (resource.tags || []).join(', '), status: resource.status || 'active',
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (resource) => {
    await updateDocument(resource.id, { status: resource.status === 'active' ? 'inactive' : 'active' });
    loadResources();
  };

  const handleDelete = async (id) => {
    await deleteDocument(id);
    setConfirmDelete(null);
    loadResources();
  };

  const openAdd = () => {
    setEditingResource(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingResource(null);
    setShowModal(false);
  };

  const displayed = resources.filter((r) => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (filterFunding !== 'all' && r.fundingType !== filterFunding) return false;
    return true;
  });

  if (loading && resources.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Resources</h1>
            <p className="text-neutral-500 mt-1">{resources.length} resource{resources.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Resource
          </button>
        </div>

        {/* Stats panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-neutral-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{resources.length}</p>
              <p className="text-xs text-neutral-500">Total resources</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-neutral-800 truncate">{stats.mostViewed?.orgName || '—'}</p>
              <p className="text-xs text-neutral-500">Most-viewed resource ({stats.mostViewed?.viewCount || 0} views)</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800">{stats.mostUsedCategory ? categoryLabel(stats.mostUsedCategory[0]) : '—'}</p>
              <p className="text-xs text-neutral-500">Most-used category ({stats.mostUsedCategory?.[1] || 0} views)</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterCategory === 'all' ? 'bg-primary-600 text-white shadow' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300'}`}
          >
            All Categories
          </button>
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilterCategory(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterCategory === c.value ? 'bg-primary-600 text-white shadow' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300'}`}
            >
              <c.icon size={14} /> {c.label}
            </button>
          ))}
          <span className="w-px bg-neutral-200 mx-1" />
          <button
            onClick={() => setFilterFunding('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterFunding === 'all' ? 'bg-neutral-800 text-white shadow' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
          >
            All Funding
          </button>
          {FUNDING_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterFunding(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterFunding === f.value ? 'bg-neutral-800 text-white shadow' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Resource list */}
        {displayed.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-neutral-100">
            <LifeBuoy className="w-14 h-14 text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500 font-medium">No resources yet</p>
            <p className="text-neutral-400 text-sm mt-1">Click "New Resource" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((resource) => {
              const CatIcon = CATEGORY_OPTIONS.find((c) => c.value === resource.category)?.icon || LifeBuoy;
              return (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl border border-neutral-100 overflow-hidden flex flex-col"
                >
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <CatIcon size={15} className="text-primary-600" />
                        </div>
                        <p className="text-[11px] font-semibold text-primary-600 uppercase tracking-wide">{categoryLabel(resource.category)}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${
                        resource.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {resource.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-neutral-800 line-clamp-1">{resource.orgName}</h3>
                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2 flex-1">{resource.description}</p>
                    <p className="text-xs text-neutral-400 mt-2">{resource.viewCount || 0} views · {resource.fundingType === 'government' ? 'Government' : 'Private/NGO'}</p>
                    <div className="flex gap-1.5 mt-3">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(resource)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                        title={resource.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {resource.status === 'active' ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(resource)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-800">
                    {editingResource ? 'Edit Resource' : 'New Resource'}
                  </h2>
                  <button onClick={closeModal} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Display Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g., NALSA Free Legal Aid"
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Organization *</label>
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => setFormData((p) => ({ ...p, orgName: e.target.value }))}
                      placeholder="e.g., National Legal Services Authority"
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Short description of the support offered…"
                      rows={3}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Category *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CATEGORY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, category: opt.value }))}
                          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                            formData.category === opt.value ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
                          }`}
                        >
                          <opt.icon size={14} /> {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Funding Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FUNDING_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, fundingType: opt.value }))}
                          className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                            formData.fundingType === opt.value ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
                        placeholder="https://…"
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="e.g., 1800-891-4416"
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="contact@organization.org"
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                      placeholder="comma, separated, tags"
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Status *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, status: opt.value }))}
                          className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                            formData.status === opt.value ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {editingResource ? 'Save Changes' : 'Create Resource'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="mb-4 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-neutral-800 text-center mb-1">Delete Resource?</h3>
              <p className="text-sm text-neutral-500 text-center mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete.id)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminResources;
