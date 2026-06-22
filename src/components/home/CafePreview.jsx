import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight, Heart, Sparkles, ChefHat, Clock, MapPin } from 'lucide-react';
import { Link } from '../../lib/routerCompat';
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/60
                        bg-primary-50 text-xs font-bold uppercase tracking-wide text-primary-700 mb-4">
          <Coffee className="w-3.5 h-3.5" />
          Gazra Cafe
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-900 mb-3">
          Where Flavours Meet Purpose
        </h2>
        <p className="text-neutral-600 max-w-xl mx-auto text-sm sm:text-base">
          A community space with authentic Gujarati flavours. Every meal served supports our mission to empower and uplift.
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
        <motion.div variants={itemVariants} className="group relative heritage-paper overflow-hidden rounded-lg border border-neutral-300 p-6 shadow-lg transition-all duration-300 hover:border-primary-500 hover:shadow-xl hover:-translate-y-2">
          <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
          <div className="w-11 h-11 rounded bg-primary-600 flex items-center justify-center mb-4">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">Authentic Flavors</h3>
          <p className="text-neutral-600 text-sm leading-relaxed">Traditional recipes with a modern twist, prepared with love and care</p>
        </motion.div>

        <motion.div variants={itemVariants} className="group relative heritage-paper overflow-hidden rounded-lg border border-neutral-300 p-6 shadow-lg transition-all duration-300 hover:border-primary-500 hover:shadow-xl hover:-translate-y-2">
          <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
          <div className="w-11 h-11 rounded bg-accent-terracotta flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">Community Impact</h3>
          <p className="text-neutral-600 text-sm leading-relaxed">Every purchase directly supports skill development and empowerment programs</p>
        </motion.div>

        <motion.div variants={itemVariants} className="group relative heritage-paper overflow-hidden rounded-lg border border-neutral-300 p-6 shadow-lg transition-all duration-300 hover:border-primary-500 hover:shadow-xl hover:-translate-y-2">
          <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
          <div className="w-11 h-11 rounded bg-secondary-600 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">Daily Fresh</h3>
          <p className="text-neutral-600 text-sm leading-relaxed">Fresh ingredients sourced locally, ensuring quality in every bite</p>
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
                className="group relative heritage-paper overflow-hidden rounded-lg border border-neutral-300 shadow-lg transition-all duration-300 hover:border-primary-500 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="heritage-rule absolute left-0 top-0 z-10 h-1 w-full" />
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
                  <h4 className="font-display text-base font-bold text-neutral-900 mb-2">{dish.name}</h4>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{dish.description}</p>
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
        <div className="relative bg-primary-600 rounded-lg p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 gazra-jaali opacity-20" />
          <div className="relative z-10 text-center">
            <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mb-6" />
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-3">
              Experience the Gazra Cafe
            </h3>
            <p className="text-primary-100/80 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Visit us for an authentic dining experience that makes a difference. Explore our full menu and be part of our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cafe"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-7 py-3
                           rounded-lg shadow-lg hover:bg-primary-50 transition-colors duration-200">
                View Full Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://maps.google.com/?q=Shri+Maharani+Chimnabai+Stree+Udyogalaya+Vadodara"
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 border-2 border-primary-100/60 text-primary-50
                            font-semibold px-7 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200">
                <MapPin className="w-4 h-4" />
                Visit Us
              </a>
            </div>
            <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mt-6" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CafePreview;
