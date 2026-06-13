import { useEffect, useState } from 'react';
import { Building2, Edit, Image as ImageIcon, Mail, MapPin, Phone, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';

const emptyForm = {
  name: '',
  address: '',
  googleMapLink: '',
  email: '',
  phone: '',
  capacity: '',
  infrastructure: [],
  image: '',
  imagePath: '',
  active: true
};

const infrastructureOptions = [
  'Projector',
  'Sound System',
  'Stage',
  'Wi-Fi',
  'Air Conditioning',
  'Accessible Entry',
  'Parking',
  'Cafe Service',
  'Workshop Tables',
  'Outdoor Space'
];

const AdminEventLocations = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingLocation, setEditingLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getDocuments, addDocument, updateDocument, deleteDocument } = useFirestore('eventLocations');
  const { uploadFile, deleteFile, uploading } = useStorage();

  const loadLocations = async () => {
    setLoading(true);
    const result = await getDocuments();
    if (result.success) {
      setLocations(result.data.sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLocations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openModal = (location = null) => {
    setEditingLocation(location);
    setFormData(location ? {
      name: location.name || '',
      address: location.address || '',
      googleMapLink: location.googleMapLink || '',
      email: location.email || '',
      phone: location.phone || '',
      capacity: location.capacity || '',
      infrastructure: location.infrastructure || [],
      image: location.image || '',
      imagePath: location.imagePath || '',
      active: location.active !== false
    } : emptyForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLocation(null);
    setFormData(emptyForm);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleInfrastructure = (item) => {
    setFormData((prev) => ({
      ...prev,
      infrastructure: prev.infrastructure.includes(item)
        ? prev.infrastructure.filter((value) => value !== item)
        : [...prev.infrastructure, item]
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, 'eventLocations');
    if (result.success) {
      if (formData.imagePath) {
        await deleteFile(formData.imagePath);
      }
      setFormData((prev) => ({
        ...prev,
        image: result.url,
        imagePath: result.path
      }));
    } else {
      alert(result.error || 'Unable to upload location image.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      capacity: Number(formData.capacity) || formData.capacity
    };

    const result = editingLocation
      ? await updateDocument(editingLocation.id, payload)
      : await addDocument(payload);

    if (result.success) {
      await loadLocations();
      closeModal();
    } else {
      alert(result.error || 'Unable to save location.');
    }
  };

  const handleDelete = async (location) => {
    if (!window.confirm(`Delete ${location.name}? Existing events will keep their saved location text.`)) return;
    const result = await deleteDocument(location.id);
    if (result.success) {
      if (location.imagePath) await deleteFile(location.imagePath);
      await loadLocations();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Location Master</h1>
            <p className="text-neutral-600 mt-2">Create and manage event venues, capacity, contact details, and infrastructure.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Location
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : locations.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
            <h3 className="mb-2 text-xl font-bold text-neutral-800">No Locations Yet</h3>
            <p className="mb-4 text-neutral-600">Create your first venue before creating venue-linked events.</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
            >
              <Plus className="h-5 w-5" />
              Add Location
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location) => (
              <div key={location.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {location.image ? (
                  <img src={location.image} alt={location.name} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-neutral-100 text-neutral-400">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                <div className="space-y-4 p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-neutral-900">{location.name}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs ${location.active !== false ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                        {location.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600">{location.address}</p>
                  </div>

                  <div className="space-y-2 text-sm text-neutral-600">
                    <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Capacity: {location.capacity || 'Not set'}</p>
                    {location.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {location.phone}</p>}
                    {location.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {location.email}</p>}
                    {location.googleMapLink && (
                      <a href={location.googleMapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
                        <MapPin className="h-4 w-4" />
                        Google Map
                      </a>
                    )}
                  </div>

                  {location.infrastructure?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {location.infrastructure.map((item) => (
                        <span key={item} className="rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">{item}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => openModal(location)} className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100">
                      <Edit className="mr-1 inline h-4 w-4" />
                      Edit
                    </button>
                    <button onClick={() => handleDelete(location)} className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100">
                      <Trash2 className="mr-1 inline h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
                <h2 className="text-2xl font-bold text-neutral-800">{editingLocation ? 'Edit Location' : 'Add Location'}</h2>
                <button onClick={closeModal} className="rounded-lg p-2 hover:bg-gray-100">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Location Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Capacity</label>
                    <input name="capacity" type="number" min="0" value={formData.capacity} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} required rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Google Map Link</label>
                  <input name="googleMapLink" type="url" value={formData.googleMapLink} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Phone</label>
                    <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-neutral-700">Infrastructure Available</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {infrastructureOptions.map((item) => (
                      <label key={item} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                        <input type="checkbox" checked={formData.infrastructure.includes(item)} onChange={() => toggleInfrastructure(item)} className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Location Image</label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-8 text-neutral-600 hover:border-primary-400 hover:text-primary-600">
                    <Upload className="h-5 w-5" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {formData.image && <img src={formData.image} alt="Location preview" className="mt-3 h-48 w-full rounded-lg object-cover" />}
                </div>

                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input name="active" type="checkbox" checked={formData.active} onChange={handleInputChange} className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  Active location
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={uploading} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-white hover:bg-primary-600 disabled:opacity-50">
                    <Save className="h-5 w-5" />
                    Save Location
                  </button>
                  <button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-3 text-neutral-700 hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEventLocations;
