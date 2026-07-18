import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '../config/firebase';

export const usePublicSubmission = (type) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (data, extra = {}) => {
    setLoading(true);
    setError(null);
    try {
      const functions = getFunctions(app, 'us-central1');
      const submitPublicForm = httpsCallable(functions, 'submitPublicForm');
      const response = await submitPublicForm({ type, data, ...extra });
      return { success: true, ...response.data };
    } catch (err) {
      const message = err.message || 'Unable to submit the form. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};

export async function fileToBase64(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}
