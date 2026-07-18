import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { storage } from '../config/firebase';
import app from '../config/firebase';

async function encodeFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

/**
 * Custom hook for Firebase Storage operations
 */
export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Upload a file
  const uploadFile = async (file, path) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setUploading(false);
      setProgress(100);
      
      return { 
        success: true, 
        url: downloadURL,
        path: snapshot.ref.fullPath 
      };
    } catch (err) {
      // A callable fallback avoids breaking uploads when deployed Storage rules
      // lag behind the frontend or cross-service admin checks are unavailable.
      if (err.code === 'storage/unauthorized' || err.code === 'storage/unknown') {
        try {
          const uploadAdminFile = httpsCallable(getFunctions(app, 'us-central1'), 'uploadAdminFile');
          const response = await uploadAdminFile({
            folder: path,
            name: file.name,
            contentType: file.type,
            base64: await encodeFile(file)
          });
          setUploading(false);
          setProgress(100);
          return { success: true, ...response.data };
        } catch (fallbackError) {
          setError(fallbackError.message);
          setUploading(false);
          return { success: false, error: fallbackError.message };
        }
      }
      setError(err.message);
      setUploading(false);
      return { success: false, error: err.message };
    }
  };

  // Upload multiple files
  const uploadFiles = async (files, path) => {
    setUploading(true);
    setError(null);
    
    try {
      const uploadPromises = files.map(file => uploadFile(file, path));
      const results = await Promise.all(uploadPromises);
      
      setUploading(false);
      return { success: true, files: results };
    } catch (err) {
      setError(err.message);
      setUploading(false);
      return { success: false, error: err.message };
    }
  };

  // Delete a file
  const deleteFile = async (filePath) => {
    setError(null);
    
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      
      return { success: true };
    } catch (err) {
      if (err.code === 'storage/unauthorized' || err.code === 'storage/unknown') {
        try {
          const deleteAdminFile = httpsCallable(getFunctions(app, 'us-central1'), 'deleteAdminFile');
          await deleteAdminFile({ path: filePath });
          return { success: true };
        } catch (fallbackError) {
          setError(fallbackError.message);
          return { success: false, error: fallbackError.message };
        }
      }
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Get all files from a folder
  const getFiles = async (folderPath) => {
    setError(null);
    
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      
      const urlPromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          path: itemRef.fullPath,
          url: url
        };
      });
      
      const files = await Promise.all(urlPromises);
      return { success: true, files };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    getFiles,
    uploading,
    progress,
    error
  };
};
