import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { storage } from '../config/firebase';
import app from '../config/firebase';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const TARGET_IMAGE_BYTES = 4.5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2560;

async function encodeFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function replaceExtension(name, extension) {
  const baseName = String(name || 'image').replace(/\.[^.]+$/, '');
  return `${baseName}.${extension}`;
}

async function canvasToBlob(canvas, contentType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('The selected image could not be processed.')),
      contentType,
      quality
    );
  });
}

async function compressAdminImage(file) {
  if (file.size <= MAX_IMAGE_BYTES) return file;
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded.');
  }

  // Animated images and vectors cannot be safely flattened without changing
  // their behaviour. Give the administrator a useful error instead.
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    throw new Error('This image is larger than 5 MB. Please optimize it before uploading.');
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('The selected image could not be read. Please choose a JPEG, PNG, or WebP image.');
  }

  try {
    const longestSide = Math.max(bitmap.width, bitmap.height);
    let scale = Math.min(1, MAX_IMAGE_DIMENSION / longestSide);
    const contentType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
    const extension = contentType === 'image/jpeg' ? 'jpg' : 'webp';
    let quality = 0.88;
    let blob;

    // Reduce quality first, then dimensions if an unusually detailed image is
    // still above the server-enforced limit.
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Image processing is unavailable in this browser.');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      blob = await canvasToBlob(canvas, contentType, quality);
      if (blob.size <= TARGET_IMAGE_BYTES) break;
      if (quality > 0.55) quality -= 0.1;
      else scale *= 0.8;
    }

    if (!blob || blob.size > MAX_IMAGE_BYTES) {
      throw new Error('This image could not be reduced below 5 MB. Please optimize it before uploading.');
    }

    return new File([blob], replaceExtension(file.name, extension), {
      type: contentType,
      lastModified: file.lastModified
    });
  } finally {
    bitmap.close();
  }
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
    let preparedFile;

    try {
      preparedFile = await compressAdminImage(file);
      const storageRef = ref(storage, `${path}/${Date.now()}_${preparedFile.name}`);
      const snapshot = await uploadBytes(storageRef, preparedFile);
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
            name: preparedFile.name,
            contentType: preparedFile.type,
            base64: await encodeFile(preparedFile)
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
