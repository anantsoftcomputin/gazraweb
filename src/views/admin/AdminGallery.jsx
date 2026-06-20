import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, X, Save, Upload, Star, StarOff,
  Image as ImageIcon, Coffee, Users, Calendar, Images,
} from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import AdminLayout from '../../layouts/AdminLayout';

const CATEGORIES = [
  { id: 'all',       label: 'All',       icon: Images },
  { id: 'cafe',      label: 'Cafe Life', icon: Coffee },
  { id: 'events',    label: 'Events',    icon: Calendar },
  { id: 'community', label: 'Community', icon: Users },
];

const CATEGORY_OPTIONS = [
  { value: 'cafe',      label: 'Cafe Life' },
  { value: 'events',    label: 'Events' },
  { value: 'community', label: 'Community' },
];

const AdminGallery = () => {
  const [images, setImages]           = useState([]);
  const [filterCat, setFilterCat]     = useState('all');
  const [showModal, setShowModal]     = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);   // previews before upload
  const [uploadedUrls, setUploadedUrls] = useState([]);  // urls after upload
  const [formData, setFormData]       = useState({ caption: '', category: 'community', featured: false });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('gallery');
  const { uploadFile, uploading } = useStorage();

  useEffect(() => { loadImages(); }, []);

  const loadImages = async () => {
    const result = await getDocuments();
    if (result.success) {
      const sorted = [...result.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setImages(sorted);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => ({ file: f, previewUrl: URL.createObjectURL(f) }));
    setPendingFiles(prev => [...prev, ...previews]);
  };

  const removePending = (idx) => {
    URL.revokeObjectURL(pendingFiles[idx].previewUrl);
    setPendingFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const removeUploaded = (idx) => setUploadedUrls(prev => prev.filter((_, i) => i !== idx));

  const handleUploadPending = async () => {
    if (!pendingFiles.length) return;
    const urls = [];
    for (let i = 0; i < pendingFiles.length; i++) {
      const result = await uploadFile(pendingFiles[i].file, 'gallery');
      if (result.success) urls.push(result.url);
      setUploadProgress(Math.round(((i + 1) / pendingFiles.length) * 100));
    }
    pendingFiles.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setPendingFiles([]);
    setUploadedUrls(prev => [...prev, ...urls]);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingImage) {
      const result = await updateDocument(editingImage.id, {
        caption:  formData.caption,
        category: formData.category,
        featured: formData.featured,
      });
      if (result.success) { closeModal(); loadImages(); }
      return;
    }

    if (!uploadedUrls.length) {
      alert('Please upload at least one image first.');
      return;
    }

    let count = 0;
    for (const url of uploadedUrls) {
      const result = await addDocument({
        imageUrl:  url,
        caption:   formData.caption,
        category:  formData.category,
        featured:  formData.featured,
        createdAt: new Date().toISOString(),
      });
      if (result.success) count++;
    }
    if (count > 0) { closeModal(); loadImages(); }
  };

  const handleEdit = (img) => {
    setEditingImage(img);
    setFormData({ caption: img.caption || '', category: img.category || 'community', featured: img.featured || false });
    setUploadedUrls([]);
    setPendingFiles([]);
    setShowModal(true);
  };

  const handleToggleFeatured = async (img) => {
    await updateDocument(img.id, { featured: !img.featured });
    loadImages();
  };

  const handleDelete = async (id) => {
    await deleteDocument(id);
    setConfirmDelete(null);
    loadImages();
  };

  const openAdd = () => {
    setEditingImage(null);
    setFormData({ caption: '', category: 'community', featured: false });
    setUploadedUrls([]);
    setPendingFiles([]);
    setShowModal(true);
  };

  const closeModal = () => {
    pendingFiles.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setPendingFiles([]);
    setUploadedUrls([]);
    setEditingImage(null);
    setShowModal(false);
  };

  const displayed = filterCat === 'all' ? images : images.filter(i => i.category === filterCat);

  if (loading) {
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
            <h1 className="text-3xl font-bold text-neutral-800">Gallery</h1>
            <p className="text-neutral-500 mt-1">{images.length} photo{images.length !== 1 ? 's' : ''} across all categories</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Upload Photos
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' ? images.length : images.filter(i => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterCat === cat.id
                    ? 'bg-primary-600 text-white shadow'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
                <span className={`text-[11px] rounded-full px-1.5 py-0.5 font-bold ${
                  filterCat === cat.id ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Image grid */}
        {displayed.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-neutral-100">
            <ImageIcon className="w-14 h-14 text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500 font-medium">No photos yet</p>
            <p className="text-neutral-400 text-sm mt-1">Click "Upload Photos" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {displayed.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-neutral-100 rounded-xl overflow-hidden aspect-square"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || ''}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Featured badge */}
                {img.featured && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full">
                    <Star size={9} className="fill-current" /> Featured
                  </span>
                )}

                {/* Category badge */}
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-semibold rounded-full capitalize backdrop-blur-sm">
                  {img.category}
                </span>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1.5">
                  {img.caption && (
                    <p className="text-white text-[11px] leading-snug line-clamp-2 mb-1">{img.caption}</p>
                  )}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEdit(img)}
                      className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors backdrop-blur-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(img)}
                      className="p-1.5 bg-amber-400/80 hover:bg-amber-400 text-amber-900 rounded-lg transition-colors backdrop-blur-sm"
                      title={img.featured ? 'Unfeature' : 'Feature'}
                    >
                      {img.featured ? <StarOff size={13} /> : <Star size={13} />}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(img)}
                      className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors backdrop-blur-sm"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
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
                {/* Modal header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-800">
                    {editingImage ? 'Edit Photo' : 'Upload Photos'}
                  </h2>
                  <button onClick={closeModal} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Image section (only for new uploads) */}
                  {!editingImage && (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-neutral-700">Photos *</label>

                      {/* Pending previews (not yet uploaded) */}
                      {pendingFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-neutral-500 font-medium">Ready to upload ({pendingFiles.length})</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {pendingFiles.map((p, i) => (
                              <div key={i} className="relative group aspect-square">
                                <img src={p.previewUrl} alt="" className="w-full h-full object-cover rounded-lg opacity-70" />
                                <button
                                  type="button"
                                  onClick={() => removePending(i)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleUploadPending}
                            disabled={uploading}
                            className="w-full py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
                          >
                            {uploading ? `Uploading… ${uploadProgress}%` : `Upload ${pendingFiles.length} photo${pendingFiles.length > 1 ? 's' : ''}`}
                          </button>
                        </div>
                      )}

                      {/* Uploaded previews */}
                      {uploadedUrls.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-green-600 font-semibold">✓ Uploaded ({uploadedUrls.length})</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {uploadedUrls.map((url, i) => (
                              <div key={i} className="relative group aspect-square">
                                <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                                <button
                                  type="button"
                                  onClick={() => removeUploaded(i)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Drop zone */}
                      <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-300 hover:border-primary-400 rounded-xl cursor-pointer transition-colors">
                        <Upload className="w-7 h-7 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-500">Click to select photos</span>
                        <span className="text-xs text-neutral-400">Hold Ctrl/Cmd for multiple</span>
                        <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
                      </label>
                    </div>
                  )}

                  {/* Preview for edit mode */}
                  {editingImage && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-neutral-100">
                      <img src={editingImage.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Category *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORY_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, category: opt.value }))}
                          className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                            formData.category === opt.value
                              ? 'bg-primary-600 border-primary-600 text-white'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Caption</label>
                    <input
                      type="text"
                      value={formData.caption}
                      onChange={e => setFormData(p => ({ ...p, caption: e.target.value }))}
                      placeholder="Optional caption for the photo(s)…"
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Featured */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                      onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${formData.featured ? 'bg-amber-400' : 'bg-neutral-200'}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.featured ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">Mark as featured</span>
                    {formData.featured && <Star size={14} className="text-amber-400 fill-current" />}
                  </label>

                  {/* Actions */}
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
                      disabled={uploading || (!editingImage && uploadedUrls.length === 0)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {editingImage ? 'Save Changes' : `Add ${uploadedUrls.length || ''} Photo${uploadedUrls.length !== 1 ? 's' : ''}`}
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
              <h3 className="text-lg font-bold text-neutral-800 text-center mb-1">Delete Photo?</h3>
              <p className="text-sm text-neutral-500 text-center mb-6">This action cannot be undone.</p>
              {confirmDelete.imageUrl && (
                <img src={confirmDelete.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg mb-5" />
              )}
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

export default AdminGallery;
