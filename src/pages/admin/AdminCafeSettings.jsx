import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save, MapPin, Clock, Phone, Instagram, Star, Utensils, Heart,
  Upload, Trash2, Plus, Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';

const AdminCafeSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [instagramImages, setInstagramImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { getDocuments, addDocument, updateDocument } = useFirestore('cafeSettings');
  const { getDocuments: getInstagramDocs, addDocument: addInstagramDoc, deleteDocument: deleteInstagramDoc } = useFirestore('cafeInstagram');
  const { uploadFile, deleteFile } = useStorage();

  const [settings, setSettings] = useState({
    // General Info
    location: '123 Community Avenue',
    phone: '+91 1234567890',
    email: 'cafe@gazra.org',
    
    // Hours
    openingHours: 'Open Daily 9AM - 10PM',
    mondayFriday: '9:00 AM - 10:00 PM',
    saturday: '9:00 AM - 11:00 PM',
    sunday: '9:00 AM - 10:00 PM',
    
    // Stats
    customerRating: '4.9',
    signatureDishes: '15+',
    yearsOfService: '5+',
    happyCustomers: '10k+',
    
    // Social Media
    instagramHandle: '@gazracafe',
    instagramUrl: 'https://instagram.com/gazracafe'
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await getDocuments();
      const docs = result.success ? result.data : [];
      if (docs.length > 0) {
        setSettings({ ...settings, ...docs[0] });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInstagramImages = async () => {
    try {
      const result = await getInstagramDocs();
      const docs = result.success ? result.data : [];
      const sortedDocs = docs.sort((a, b) => (a.order || 0) - (b.order || 0));
      setInstagramImages(sortedDocs);
    } catch (error) {
      console.error('Error loading Instagram images:', error);
    }
  };

  useEffect(() => {
    loadSettings();
    loadInstagramImages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const docs = await getDocuments();
      if (docs.length > 0) {
        await updateDocument(docs[0].id, settings);
      } else {
        await addDocument(settings);
      }
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInstagramImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Max size is 5MB`);
          continue;
        }

        const imageUrl = await uploadFile(file, 'instagram');
        await addInstagramDoc({
          url: imageUrl,
          span: 'row-span-1 col-span-1',
          order: instagramImages.length
        });
      }
      await loadInstagramImages();
    } catch (error) {
      console.error('Error uploading Instagram image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteInstagramImage = async (image) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        if (image.url) {
          try {
            await deleteFile(image.url);
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        }
        await deleteInstagramDoc(image.id);
        await loadInstagramImages();
      } catch (error) {
        console.error('Error deleting Instagram image:', error);
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  const handleUpdateImageSpan = async (image, newSpan) => {
    try {
      const instagramCollection = useFirestore('cafeInstagram');
      await instagramCollection.updateDocument(image.id, { span: newSpan });
      await loadInstagramImages();
    } catch (error) {
      console.error('Error updating image span:', error);
    }
  };

  const tabs = [
    { id: 'general', name: 'General Info', icon: MapPin },
    { id: 'hours', name: 'Hours', icon: Clock },
    { id: 'stats', name: 'Statistics', icon: Star },
    { id: 'instagram', name: 'Instagram Feed', icon: Instagram }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cafe Settings</h1>
          <p className="text-gray-600 mt-1">Manage cafe information, hours, and social media</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="p-6">
              {/* General Info Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location Address
                    </label>
                    <input
                      type="text"
                      value={settings.location}
                      onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter cafe location"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+91 1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="cafe@gazra.org"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Instagram className="w-4 h-4 inline mr-2" />
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={settings.instagramHandle}
                        onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="@gazracafe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={settings.instagramUrl}
                        onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://instagram.com/gazracafe"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Hours Tab */}
              {activeTab === 'hours' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      General Hours (Display Text)
                    </label>
                    <input
                      type="text"
                      value={settings.openingHours}
                      onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Open Daily 9AM - 10PM"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monday - Friday
                      </label>
                      <input
                        type="text"
                        value={settings.mondayFriday}
                        onChange={(e) => setSettings({ ...settings, mondayFriday: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="9:00 AM - 10:00 PM"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saturday
                      </label>
                      <input
                        type="text"
                        value={settings.saturday}
                        onChange={(e) => setSettings({ ...settings, saturday: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="9:00 AM - 11:00 PM"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sunday
                      </label>
                      <input
                        type="text"
                        value={settings.sunday}
                        onChange={(e) => setSettings({ ...settings, sunday: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="9:00 AM - 10:00 PM"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    These statistics are displayed in the floating cards on the cafe page
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-primary-50 p-6 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Star className="w-5 h-5 inline mr-2 text-primary-600" />
                        Customer Rating
                      </label>
                      <input
                        type="text"
                        value={settings.customerRating}
                        onChange={(e) => setSettings({ ...settings, customerRating: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="4.9"
                      />
                      <p className="text-xs text-gray-500 mt-1">Example: 4.9 (out of 5)</p>
                    </div>

                    <div className="bg-primary-50 p-6 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Utensils className="w-5 h-5 inline mr-2 text-primary-600" />
                        Signature Dishes
                      </label>
                      <input
                        type="text"
                        value={settings.signatureDishes}
                        onChange={(e) => setSettings({ ...settings, signatureDishes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="15+"
                      />
                      <p className="text-xs text-gray-500 mt-1">Total number of signature dishes</p>
                    </div>

                    <div className="bg-primary-50 p-6 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-5 h-5 inline mr-2 text-primary-600" />
                        Years of Service
                      </label>
                      <input
                        type="text"
                        value={settings.yearsOfService}
                        onChange={(e) => setSettings({ ...settings, yearsOfService: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="5+"
                      />
                      <p className="text-xs text-gray-500 mt-1">How long the cafe has been serving</p>
                    </div>

                    <div className="bg-primary-50 p-6 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Heart className="w-5 h-5 inline mr-2 text-primary-600" />
                        Happy Customers
                      </label>
                      <input
                        type="text"
                        value={settings.happyCustomers}
                        onChange={(e) => setSettings({ ...settings, happyCustomers: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="10k+"
                      />
                      <p className="text-xs text-gray-500 mt-1">Total customers served</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Instagram Feed Tab */}
              {activeTab === 'instagram' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Instagram Gallery</h3>
                      <p className="text-sm text-gray-600">Upload images to display in the Instagram feed section</p>
                    </div>
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleInstagramImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>

                  {uploadingImage && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Uploading images...</p>
                    </div>
                  )}

                  {instagramImages.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-12 text-center">
                      <Instagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No images yet</h3>
                      <p className="text-gray-600">Upload images to create your Instagram feed gallery</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {instagramImages.map((image) => (
                        <motion.div
                          key={image.id}
                          layout
                          className="group relative aspect-square rounded-lg overflow-hidden bg-gray-200"
                        >
                          <img
                            src={image.url}
                            alt="Instagram post"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteInstagramImage(image)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Save Button (not shown for Instagram tab as it auto-saves) */}
              {activeTab !== 'instagram' && (
                <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Settings
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCafeSettings;
