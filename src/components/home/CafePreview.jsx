import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight, Heart, Sparkles, ChefHat, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirestore } from '../../hooks/useFirestore';

const CafePreview = () => {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getDocuments: getMenuItems } = useFirestore('menuItems');

  useEffect(() => {
    const loadFeaturedDishes = async () => {
      try {
        const result = await getMenuItems();
        if (result.success && result.data.length > 0) {
          // Get 3 popular or recommended dishes
          const featured = result.data
            .filter(item => (item.popular || item.recommended) && item.available !== false)
            .slice(0, 3);
          setFeaturedDishes(featured);
        }
      } catch (error) {
        console.error('Error loading featured dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedDishes();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Coffee className="w-8 h-8 text-primary-600" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Gazra Cafe
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A community space where flavors meet purpose. Every meal served supports our mission to empower and uplift.
        </p>
      </motion.div>

      {/* Cafe Highlights */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-primary-100">
          <ChefHat className="w-10 h-10 text-primary-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Authentic Flavors</h3>
          <p className="text-gray-600">Traditional recipes with a modern twist, prepared with love and care</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-primary-100">
          <Heart className="w-10 h-10 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Impact</h3>
          <p className="text-gray-600">Every purchase directly supports skill development and empowerment programs</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-primary-100">
          <Clock className="w-10 h-10 text-primary-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Daily Fresh</h3>
          <p className="text-gray-600">Fresh ingredients sourced locally, ensuring quality in every bite</p>
        </motion.div>
      </motion.div>

      {/* Featured Dishes */}
      {!loading && featuredDishes.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Featured Dishes</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredDishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                variants={itemVariants}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={(dish.images && dish.images[0]) || dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {dish.popular && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      Popular
                    </div>
                  )}
                  {dish.recommended && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary-500 text-white text-xs rounded-full flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Chef's Pick
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{dish.name}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dish.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary-600">{dish.price}</span>
                    {dish.spiceLevel && dish.spiceLevel !== 'none' && (
                      <span className="text-xs text-gray-500">🌶️ {dish.spiceLevel}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Experience the Gazra Cafe
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Visit us for a delightful dining experience that makes a difference. Explore our full menu, learn about our story, and be part of our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/cafe"
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              View Full Menu
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://maps.google.com/?q=Gazra+Cafe"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/30"
            >
              <MapPin className="w-5 h-5" />
              Visit Us
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CafePreview;
