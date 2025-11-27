import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img 
                src="https://gazra.org/logo.png" 
                alt="Gazra Logo" 
                className="h-16 w-auto" 
              />
            </Link>
            <p className="text-gray-400">
              Creating an inclusive space where every individual can embrace their authentic self.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/initiatives" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Initiatives
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Volunteer
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-bold mb-6">Community</h3>
            <ul className="space-y-4">
              <li>
              <Link to="/cafe" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Gazra Cafe
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Support Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <p className="font-bold text-white">Address:</p>
                <p>123 Community Street</p>
                <p>Vadodara, Gujarat 390001</p>
              </li>
              <li>
                <p className="font-bold text-white">Email:</p>
                <a href="mailto:info@gazra.org" className="hover:text-white transition-colors duration-300">
                  info@gazra.org
                </a>
              </li>
              <li>
                <p className="font-bold text-white">Phone:</p>
                <a href="tel:+919876543210" className="hover:text-white transition-colors duration-300">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-6">Stay updated with our latest news and events.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Gazra. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>by the community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;