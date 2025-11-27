import { useState } from 'react';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, getDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Custom hook for Firestore operations
 * @param {string} collectionName - Name of the Firestore collection
 */
export const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a new document
  const addDocument = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      setLoading(false);
      return { success: true, id: docRef.id };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Update a document
  const updateDocument = async (docId, data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Delete a document
  const deleteDocument = async (docId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, docId));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get all documents
  const getDocuments = async (conditions = []) => {
    setLoading(true);
    setError(null);
    try {
      let q = collection(db, collectionName);
      
      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      setLoading(false);
      return { success: true, data: documents };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get a single document
  const getDocument = async (docId) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setLoading(false);
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        setLoading(false);
        return { success: false, error: 'Document not found' };
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    getDocuments,
    getDocument,
    loading,
    error
  };
};
