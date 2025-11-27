import React from 'react';
import { Send } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-soft p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Stay Updated with Our Latest News and Events
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our newsletter and be part of our growing community. Get updates about events, initiatives, and stories that matter.
            </p>
            
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-xl shadow-soft hover:bg-primary-700 transition-all duration-300 hover:shadow-lg"
                >
                  Subscribe
                  <Send className="ml-2 w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from Gazra.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;