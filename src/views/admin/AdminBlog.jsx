import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, X, Save, Upload, Star, StarOff,
  FileText, Edit2, Eye, EyeOff,
} from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import AdminLayout from '../../layouts/AdminLayout';

const CATEGORY_OPTIONS = [
  { value: 'news',     label: 'News' },
  { value: 'stories',  label: 'Stories' },
  { value: 'updates',  label: 'Updates' },
  { value: 'events',   label: 'Events' },
];

const slugify = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const emptyForm = {
  title: '', excerpt: '', content: '', author: '',
  category: 'news', status: 'draft', featured: false,
};

const AdminBlog = () => {
  const [posts, setPosts]               = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal]       = useState(false);
  const [editingPost, setEditingPost]   = useState(null);
  const [pendingFile, setPendingFile]   = useState(null);
  const [uploadedUrl, setUploadedUrl]   = useState('');
  const [formData, setFormData]         = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('blogs');
  const { uploadFile, uploading } = useStorage();

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    const result = await getDocuments();
    if (result.success) {
      const sorted = [...result.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sorted);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (pendingFile) URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile({ file, previewUrl: URL.createObjectURL(file) });
  };

  const removePending = () => {
    URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile(null);
  };

  const handleUploadPending = async () => {
    if (!pendingFile) return;
    const result = await uploadFile(pendingFile.file, 'blogs');
    if (result.success) {
      URL.revokeObjectURL(pendingFile.previewUrl);
      setUploadedUrl(result.url);
      setPendingFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required.');
      return;
    }

    const payload = {
      title:    formData.title.trim(),
      slug:     slugify(formData.title),
      excerpt:  formData.excerpt.trim(),
      content:  formData.content.trim(),
      author:   formData.author.trim(),
      category: formData.category,
      status:   formData.status,
      featured: formData.featured,
      featuredImage: uploadedUrl || editingPost?.featuredImage || '',
      publishedDate: formData.status === 'published'
        ? (editingPost?.publishedDate || new Date().toISOString())
        : (editingPost?.publishedDate || ''),
    };

    const result = editingPost
      ? await updateDocument(editingPost.id, payload)
      : await addDocument(payload);

    if (result.success) { closeModal(); loadPosts(); }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '', excerpt: post.excerpt || '', content: post.content || '',
      author: post.author || '', category: post.category || 'news',
      status: post.status || 'draft', featured: post.featured || false,
    });
    setUploadedUrl(post.featuredImage || '');
    setPendingFile(null);
    setShowModal(true);
  };

  const handleToggleFeatured = async (post) => {
    await updateDocument(post.id, { featured: !post.featured });
    loadPosts();
  };

  const handleToggleStatus = async (post) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    await updateDocument(post.id, {
      status: nextStatus,
      publishedDate: nextStatus === 'published' ? (post.publishedDate || new Date().toISOString()) : post.publishedDate || '',
    });
    loadPosts();
  };

  const handleDelete = async (id) => {
    await deleteDocument(id);
    setConfirmDelete(null);
    loadPosts();
  };

  const openAdd = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setUploadedUrl('');
    setPendingFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (pendingFile) URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile(null);
    setUploadedUrl('');
    setEditingPost(null);
    setShowModal(false);
  };

  const displayed = filterStatus === 'all' ? posts : posts.filter(p => p.status === filterStatus);

  if (loading && posts.length === 0) {
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
            <h1 className="text-3xl font-bold text-neutral-800">Blog</h1>
            <p className="text-neutral-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All' },
            { id: 'published', label: 'Published' },
            { id: 'draft', label: 'Draft' },
          ].map(s => {
            const count = s.id === 'all' ? posts.length : posts.filter(p => p.status === s.id).length;
            return (
              <button
                key={s.id}
                onClick={() => setFilterStatus(s.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterStatus === s.id
                    ? 'bg-primary-600 text-white shadow'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {s.label}
                <span className={`text-[11px] rounded-full px-1.5 py-0.5 font-bold ${
                  filterStatus === s.id ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Posts list */}
        {displayed.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-neutral-100">
            <FileText className="w-14 h-14 text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500 font-medium">No posts yet</p>
            <p className="text-neutral-400 text-sm mt-1">Click "New Post" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl border border-neutral-100 overflow-hidden flex flex-col"
              >
                <div className="aspect-video bg-neutral-100 relative">
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-neutral-300" />
                    </div>
                  )}
                  {post.featured && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full">
                      <Star size={9} className="fill-current" /> Featured
                    </span>
                  )}
                  <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize backdrop-blur-sm ${
                    post.status === 'published' ? 'bg-green-500/80 text-white' : 'bg-neutral-500/80 text-white'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-[11px] font-semibold text-primary-600 uppercase tracking-wide">{post.category}</p>
                  <h3 className="font-bold text-neutral-800 mt-1 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-2 flex-1">{post.excerpt}</p>
                  <div className="flex gap-1.5 mt-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(post)}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {post.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(post)}
                      className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors"
                      title={post.featured ? 'Unfeature' : 'Feature'}
                    >
                      {post.featured ? <StarOff size={13} /> : <Star size={13} />}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(post)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
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
                    {editingPost ? 'Edit Post' : 'New Post'}
                  </h2>
                  <button onClick={closeModal} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Featured image */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-neutral-700">Featured Image</label>

                    {uploadedUrl && (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100">
                        <img src={uploadedUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedUrl('')}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    {!uploadedUrl && pendingFile && (
                      <div className="space-y-2">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100">
                          <img src={pendingFile.previewUrl} alt="" className="w-full h-full object-cover opacity-70" />
                          <button
                            type="button"
                            onClick={removePending}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleUploadPending}
                          disabled={uploading}
                          className="w-full py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          {uploading ? 'Uploading…' : 'Upload Image'}
                        </button>
                      </div>
                    )}

                    {!uploadedUrl && !pendingFile && (
                      <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-300 hover:border-primary-400 rounded-xl cursor-pointer transition-colors">
                        <Upload className="w-7 h-7 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-500">Click to select an image</span>
                        <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                      </label>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      placeholder="Post title…"
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Excerpt</label>
                    <input
                      type="text"
                      value={formData.excerpt}
                      onChange={e => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                      placeholder="Short preview text shown in listings…"
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                      placeholder="Full post content…"
                      rows={8}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none resize-y"
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={e => setFormData(p => ({ ...p, author: e.target.value }))}
                      placeholder="e.g., Project Gazra Team"
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Category *</label>
                    <div className="grid grid-cols-4 gap-2">
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

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Status *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }].map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, status: opt.value }))}
                          className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                            formData.status === opt.value
                              ? 'bg-primary-600 border-primary-600 text-white'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
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
                      disabled={uploading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {editingPost ? 'Save Changes' : 'Create Post'}
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
              <h3 className="text-lg font-bold text-neutral-800 text-center mb-1">Delete Post?</h3>
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

export default AdminBlog;
