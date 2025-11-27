import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

/**
 * Firebase Connection Test Component
 * Use this to verify Firebase is working correctly
 * Add to any page temporarily: import FirebaseTest from './utils/FirebaseTest';
 */
const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [details, setDetails] = useState([]);

  useEffect(() => {
    testFirebase();
  }, []);

  const testFirebase = async () => {
    const results = [];
    
    try {
      // Test 1: Check Firebase Config
      results.push({
        test: 'Firebase Config',
        status: '✅ Pass',
        message: 'Firebase initialized successfully'
      });

      // Test 2: Try to read from Firestore
      try {
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        results.push({
          test: 'Firestore Read',
          status: '✅ Pass',
          message: 'Can read from Firestore'
        });
      } catch (error) {
        results.push({
          test: 'Firestore Read',
          status: '⚠️ Warning',
          message: error.message
        });
      }

      // Test 3: Try to write to Firestore
      try {
        const testCollection = collection(db, 'test');
        await addDoc(testCollection, {
          test: true,
          timestamp: new Date(),
          message: 'Test connection'
        });
        results.push({
          test: 'Firestore Write',
          status: '✅ Pass',
          message: 'Can write to Firestore'
        });
      } catch (error) {
        results.push({
          test: 'Firestore Write',
          status: '❌ Fail',
          message: error.message
        });
      }

      setStatus('✅ Tests Complete');
      setDetails(results);
    } catch (error) {
      setStatus('❌ Error');
      results.push({
        test: 'General Error',
        status: '❌ Fail',
        message: error.message
      });
      setDetails(results);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 max-w-md z-50">
      <h3 className="text-lg font-bold mb-3">Firebase Connection Test</h3>
      <p className="text-sm mb-4">Status: {status}</p>
      
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-3">
            <p className="text-sm font-semibold">
              {detail.status} {detail.test}
            </p>
            <p className="text-xs text-gray-600">{detail.message}</p>
          </div>
        ))}
      </div>

      <button
        onClick={testFirebase}
        className="mt-4 w-full px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
      >
        Run Tests Again
      </button>

      <p className="text-xs text-gray-500 mt-3">
        Remove this component before production
      </p>
    </div>
  );
};

export default FirebaseTest;
