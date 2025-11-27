import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Coffee, Utensils, Leaf, ChefHat, Heart, Star, Clock, Sparkles, MapPin,
  Instagram, ArrowRight, Volume2, VolumeX, PlayCircle, Phone
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

const GazraCafe = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [muted, setMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [moments, setMoments] = useState([]);
  const videoRef = useRef(null);
  const { scrollY } = useScroll();
  const { getDocuments } = useFirestore('cafeMoments');

  // Framer Motion transformations for Hero parallax
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const heroTextOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 150], [0, -50]);

  // Video controls logic
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

  // Effect for video looping (if needed, though loop attribute is present)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleVideoEnd = () => {
        video.currentTime = 0;
        video.play().catch(error => console.error("Video autoplay failed:", error)); // Added catch for safety
      };
      video.addEventListener('ended', handleVideoEnd);

      // Cleanup listener on component unmount
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  // Load moments from Firestore
  useEffect(() => {
    const loadMoments = async () => {
      try {
        const result = await getDocuments();
        if (result.success && result.data.length > 0) {
          // Sort by date and take up to 8 moments
          const sortedMoments = result.data
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 8)
            .map((moment, index) => ({
              url: moment.image,
              span: index % 3 === 0 ? 'row-span-2 col-span-1' : 'row-span-1 col-span-1',
              title: moment.title,
              date: moment.date
            }));
          setMoments(sortedMoments);
        }
      } catch (error) {
        console.error('Error loading moments:', error);
      }
    };
    loadMoments();
  }, []);

  // Helper to get spice level color
  const getSpiceLevelColor = (level) => {
    const colors = {
      'mild': 'bg-green-400',
      'medium': 'bg-yellow-400',
      'hot': 'bg-orange-400',
      'extra-hot': 'bg-red-400'
    };
    return colors[level] || 'bg-gray-400';
  };

  // Menu data
  const categories = [
    { id: 'all', name: 'All', icon: Utensils },
    { id: 'starters', name: 'Small Plates', icon: ChefHat },
    { id: 'mains', name: 'Mains', icon: Utensils },
    { id: 'beverages', name: 'Drinks', icon: Coffee }
  ];

  const menuItems = {
    starters: [
      { id: 1, name: 'Kothambir Wadi', description: 'Crispy fried coriander fritters - our signature starter', price: '₹180', spiceLevel: 'medium', popular: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950', tags: ['Signature'] },
      { id: 2, name: 'Sabudana Wada', description: 'Crispy sago patties served with special mint raita', price: '₹160', spiceLevel: 'mild', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0', tags: ['Classic'] },
      { id: 3, name: 'Vada Pav', description: 'Authentic Mumbai street style vada pav with special chutney', price: '₹120', spiceLevel: 'hot', popular: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84', tags: ['Street Food'] },
      { id: 4, name: 'Tam Tam', description: 'Our take on the city-famous bhusu', price: '₹150', spiceLevel: 'medium', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0', tags: ['Special'] }, // Placeholder image
      { id: 5, name: 'Gujju Mezze', description: 'Fusion thepla nachos served with thecha dip and salsa', price: '₹220', spiceLevel: 'hot', recommended: true, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0', tags: ['Fusion'] } // Placeholder image
    ],
    mains: [
      { id: 6, name: 'Zunka Bhakhar', description: 'Traditional maharashtrian delicacy with authentic flavors', price: '₹240', spiceLevel: 'hot', popular: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8', tags: ['Traditional'] }, // Placeholder image
      { id: 7, name: 'Misal Pav', description: 'Spicy sprouts curry served with fresh pav', price: '₹180', spiceLevel: 'extra-hot', popular: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8', tags: ['Spicy'] }, // Placeholder image
      { id: 8, name: 'Capdi u dhyu', description: 'Our special big cut vegetable Undhiyu preparation', price: '₹260', spiceLevel: 'medium', recommended: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8', tags: ['Seasonal'] } // Placeholder image
    ],
    beverages: [
      { id: 9, name: 'Special Masala Chai', description: 'House blend of spiced tea', price: '₹80', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8', tags: ['Hot'] },
      { id: 10, name: 'Artisanal Coffee', description: 'Freshly brewed specialty coffee', price: '₹120', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d', tags: ['Premium'] }, // Placeholder image
      { id: 11, name: 'Natural Mocktails', description: 'Refreshing beverages made with fresh ingredients', price: '₹150', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d', tags: ['Fresh'] } // Placeholder image
    ]
  };

  // Using URLs directly from menuItems might be simpler, but this allows overrides/fallbacks
  const dishImages = {
    'Kothambir Wadi': 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    'Sabudana Wada': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0',
    'Vada Pav': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84',
    'Zunka Bhakhar': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8', // Placeholder
    'Misal Pav': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8', // Placeholder
    'Capdi u dhyu': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8', // Placeholder
    'Special Masala Chai': 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8',
    'Artisanal Coffee': 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d', // Placeholder
    'Natural Mocktails': 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d', // Placeholder
    'Tam Tam': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0', // Placeholder
    'Gujju Mezze': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0', // Placeholder
  };

  // Testimonial Data
   const testimonials = [
     { name: 'Priya Sharma', role: 'Food Blogger', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5', comment: "The Zunka Bhakhar took me right back to my grandmother's kitchen. Every bite tells a story of authentic Maharashtra.", rating: 5, dish: 'Zunka Bhakhar' },
     { name: 'Rahul Mehta', role: 'Regular Customer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', comment: 'Best Vada Pav in the city! The special chutney makes all the difference. A must-visit for authentic street food lovers.', rating: 5, dish: 'Vada Pav' },
     { name: 'Anita Patel', role: 'Food Critic', image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604', comment: 'The fusion dishes are innovative yet respectful to tradition. The Gujju Mezze is a creative masterpiece!', rating: 5, dish: 'Gujju Mezze' }
  ];

   // Instagram Feed Data
   const instagramPosts = [
     { url: '/images/image11.jpg', span: 'row-span-2 col-span-1' }, // Tall
     { url: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129', span: 'row-span-1 col-span-1' }, // Square
     { url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187', span: 'row-span-1 col-span-1' }, // Square
     { url: 'https://images.unsplash.com/photo-1482012792084-a0c3725f289f', span: 'row-span-2 col-span-1' }, // Tall
     { url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a', span: 'row-span-1 col-span-1' }, // Square
     { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93', span: 'row-span-1 col-span-1' }, // Square
     { url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348', span: 'row-span-1 col-span-1' }, // Square
     { url: 'https://images.unsplash.com/photo-1523371683773-935ca36a4a3d', span: 'row-span-1 col-span-1' }  // Square
   ];

   // Feature Data
   const features = [
      { icon: ChefHat, title: 'Expert Chefs', description: 'Masters of traditional recipes' },
      { icon: Leaf, title: 'Fresh Ingredients', description: 'Locally sourced produce' },
      { icon: Coffee, title: 'Masala Chai with Love', description: 'Chai of India' },
      { icon: Heart, title: 'Made with Love', description: 'Passion in every dish' }
   ];

   // Stats Data
   const stats = [
      { number: '4.9', label: 'Customer Rating', suffix: '/5', icon: Star },
      { number: '15+', label: 'Signature Dishes', icon: Utensils },
      { number: '5+', label: 'Years of Service', icon: Clock },
      { number: '10k+', label: 'Happy Customers', icon: Heart }
   ];


  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* Modern Video Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Full-screen video background */}
        <div className="absolute inset-0 bg-black">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="w-full h-full"
          >
            <video
              ref={videoRef}
              className="absolute w-full h-full object-cover"
              poster="/images/cafe1.webp" // Example poster
              muted // Start muted
              loop
              playsInline
            // src="/api/placeholder/1920/1080" // Replace with your actual video source
            // type="video/mp4"
            >
              {/* Add source tag if not using src attribute */}
              {/* <source src="/path/to/your/video.mp4" type="video/mp4" /> */}
              Your browser does not support the video tag.
            </video>

            {/* Video overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
          </motion.div>
        </div>

        {/* Video controls */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-4">
          {!videoPlaying && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={playVideo}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
              aria-label="Play video"
            >
              <PlayCircle className="w-8 h-8" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMute}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Hero content */}
        <div className="relative h-full z-10 flex items-center">
          <div className="container mx-auto px-6">
            <motion.div
              style={{ opacity: heroTextOpacity, y: heroTextY }}
              className="max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }} // Use animate instead of whileInView for initial load
                transition={{ duration: 0.8, delay: 0.3 }} // Added delay
              >
                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white mb-6">
                  <Coffee className="w-4 h-4 inline mr-2" />
                  Welcome to Gazra Cafe
                </span>

                <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-white">
                  A Culinary
                  <span className="block mt-2 bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">
                    Journey Home
                  </span>
                </h1>

                <p className="text-xl text-white/80 mb-8 max-w-xl">
                  Experience authentic flavors with a modern twist in our warm, welcoming space.
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#menu"
                    className="px-8 py-4 bg-white text-primary-600 rounded-full font-medium inline-flex items-center shadow-lg hover:shadow-xl transition-all"
                  >
                    Explore Our Menu
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#location"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium inline-flex items-center hover:bg-white/10 transition-all"
                  >
                    Visit Us
                    <MapPin className="ml-2 w-5 h-5" />
                  </motion.a>
                </div>

                <div className="flex items-center space-x-6 text-white/80 mt-8 text-sm sm:text-base">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>123 Community Avenue</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>Open Daily 9AM - 10PM</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Section - Floating cards */}
      <section className="relative z-20 -mt-20 sm:-mt-28 mx-4 md:mx-8 lg:mx-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 border border-white/60"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-3 sm:mb-4">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 mb-1">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section with improved layout */}
      <section id="menu" className="py-24 mt-12 relative">
        <div className="container mx-auto px-4">
          {/* Menu Introduction */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
                Our Menu
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                Savor the Authentic
                <span className="block mt-2 text-primary-600">Maharashtrian Flavors</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Each dish tells a story of tradition, prepared with love and served with pride.
              </p>
            </motion.div>
          </div>

          {/* Category Navigation - Sticky tabs */}
          <div className="sticky top-4 z-40 mb-12 sm:mb-16 flex justify-center">
             {/* Removed motion wrapper, let parent handle animation */}
              <div className="inline-flex flex-wrap justify-center bg-white rounded-full p-1.5 sm:p-2 shadow-lg border border-gray-100">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300
                      ${selectedCategory === category.id
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-primary-50'
                      }
                    `}
                  >
                    <category.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {category.name}
                  </motion.button>
                ))}
              </div>
          </div>

          {/* Menu Grid - Modern cards with hover effects */}
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(menuItems).flatMap(([category, items]) => // Use flatMap for direct array
              items
                .filter(item => selectedCategory === 'all' || selectedCategory === category)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }} // Trigger slightly earlier
                    transition={{ delay: (index % 4) * 0.08 }} // Slightly faster delay
                    layout // Animate layout changes when filtering
                    className="group relative flex flex-col" // Added flex flex-col for consistent height
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-100/30 rounded-3xl transform group-hover:rotate-1 transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10"></div>
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl border border-gray-100 flex flex-col flex-grow">
                      <div className="relative overflow-hidden h-48 flex-shrink-0">
                        <img
                          src={dishImages[item.name] || item.image || '/api/placeholder/400/300'} // Fallback chain
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-110"
                          loading="lazy" // Lazy load images
                        />
                        {(item.popular || item.recommended) && (
                          <div className={`absolute top-3 left-3 px-3 py-1.5 text-white text-xs rounded-full flex items-center backdrop-blur-sm ${item.popular ? 'bg-red-500/80' : 'bg-primary-500/80'}`}>
                             {item.popular ? <Heart className="w-3 h-3 mr-1" /> : <Sparkles className="w-3 h-3 mr-1" /> }
                             {item.popular ? 'Popular' : "Chef's Pick"}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-5 sm:p-6 flex flex-col flex-grow"> {/* Use flex-grow here */}
                        <div className="flex justify-between items-start mb-2 gap-2"> {/* Use items-start */}
                          <h3 className="text-md sm:text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                             {item.name}
                          </h3>
                          <span className="text-sm sm:text-md font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full flex-shrink-0">
                             {item.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{item.description}</p> {/* Use flex-grow here */}

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100"> {/* Use mt-auto */}
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {item.spiceLevel && (
                            <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                              <span
                                className={`w-2 h-2 rounded-full mr-1.5 ${getSpiceLevelColor(item.spiceLevel)}`}
                                title={`Spice Level: ${item.spiceLevel}`}
                              />
                              <span className="text-xs text-gray-600 capitalize">{item.spiceLevel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Special Features Section */}
      <section className="py-24 bg-primary-50/30 relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] -top-[300px] -right-[100px] bg-primary-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute w-[600px] h-[600px] -bottom-[200px] -left-[200px] bg-secondary-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] sm:h-[600px]" // Added specific height
            >
              <div className="grid grid-cols-12 grid-rows-6 gap-3 sm:gap-4 h-full">
                {[ // Define images and spans in an array for easier management
                   { src: "/images/image12.jpg", alt: "Cafe Ambiance", label: "Cozy Ambiance", span: "col-span-7 row-span-4" },
                   { src: "/images/food-1.png", alt: "Coffee Service", label: "Experience Soul Food", span: "col-span-5 row-span-3" },
                   { src: "/images/image-two.jpg", alt: "Cafe Interior", label: "Experience Heritage", span: "col-span-5 row-span-3" },
                   { src: "/images/image10.webp", alt: "Coffee Making", label: "Experience Happiness", span: "col-span-7 row-span-2" }
                ].map((img, idx) => (
                  <div key={idx} className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl ${img.span}`}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                      <span className="text-xs sm:text-sm font-medium text-white bg-black/40 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-sm">
                        {img.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8"
            >
              <span className="inline-block px-4 py-2 bg-white text-primary-600 rounded-full text-sm font-medium">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                A Perfect Blend of
                <span className="block mt-1 sm:mt-2 text-primary-600">Tradition & Innovation</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                At Gazra Cafe, we're more than just a restaurant. We're a celebration of Maharashtra's rich culinary heritage, reimagined for the modern palate.
              </p>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-md sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors duration-300">
                       {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden bg-[#FDFBF7]">
        {/* Background Blobs */}
         <div className="absolute inset-0">
           <div className="absolute w-[500px] h-[500px] -top-[250px] -right-[250px] bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
           <div className="absolute w-[500px] h-[500px] -bottom-[250px] -left-[250px] bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
         </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
             >
               <span className="inline-block px-4 py-2 bg-white text-primary-600 rounded-full text-sm font-medium mb-4 shadow border border-gray-100">
                 Guest Stories
               </span>
               <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
                 What Our Community Says
               </h2>
               <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                 Real experiences from our valued guests who cherish our flavors and ambiance.
               </p>
             </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group" // Keep group for potential future hover effects on parent
              >
                {/* Optional subtle background element */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300 -z-10"></div> */}
                <div className="relative bg-white/80 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-lg border border-white/60 h-full flex flex-col"> {/* Added flex */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-4 border-2 border-white shadow-md flex-shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => ( // Always show 5 stars
                      <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>

                  <blockquote className="text-gray-600 mb-6 italic text-sm sm:text-base flex-grow"> {/* Added flex-grow */}
                    "{testimonial.comment}"
                  </blockquote>

                  <div className="mt-auto flex items-center text-xs sm:text-sm text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full self-start"> {/* Use self-start and mt-auto */}
                    <Utensils className="w-3.5 h-3.5 mr-2" />
                    Favorite: {testimonial.dish}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-24 bg-gradient-to-b from-white to-primary-50/30">
         <div className="container mx-auto px-4">
           <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 bg-white text-primary-600 rounded-full text-sm font-medium mb-4 shadow border border-gray-100">
                  @chimnabai_udyogalaya
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
                  Moments & Memories
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  Follow us on Instagram for daily updates and behind-the-scenes glimpses.
                </p>
              </motion.div>
           </div>

           {/* Masonry-like grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px_300px]"> {/* Example fixed row heights */}
              {(moments.length > 0 ? moments : instagramPosts).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className={`relative group overflow-hidden rounded-xl sm:rounded-2xl ${image.span}`}
                >
                  <img
                    src={image.url}
                    alt={`Instagram Post ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <a href="https://instagram.com/chimnabai_udyogalaya" target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                     <div className="flex items-center text-white mb-1 sm:mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                       <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-white" />
                       <span className="text-xs sm:text-sm">{Math.floor(200 + Math.random() * 300)}</span> {/* Random likes */}
                       <Instagram className="w-4 h-4 sm:w-5 sm:h-5 ml-auto" />
                     </div>
                     <p className="text-white text-xs sm:text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">
                       Explore our latest delicious creations and cafe vibes! #gazracafe #{['maharashtrianfood', 'punefoodie', 'goodvibes'][index % 3]}
                     </p>
                  </a>
                </motion.div>
              ))}
           </div>

           <div className="text-center mt-12">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com/chimnabai_udyogalaya" // Replace with your actual Instagram link
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border-2 border-primary-200 text-primary-600 rounded-full hover:bg-primary-50 transition-all duration-300 text-sm sm:text-base"
              >
                Follow Us on Instagram
                <Instagram className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
           </div>
         </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-24 bg-[#FDFBF7]">
         <div className="container mx-auto px-4">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-6xl mx-auto"
           >
             <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
               {/* Location Details */}
               <div className="space-y-6 sm:space-y-8">
                 <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                   Visit Us
                 </span>
                 <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                   Come Experience
                   <span className="block mt-1 sm:mt-2 text-primary-600">The Magic</span>
                 </h2>

                 <div className="space-y-5 sm:space-y-6">
                    <div className="flex items-start space-x-4">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                         <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                         <p className="text-gray-600 text-sm sm:text-base">Gazra Cafe, Shri Maharani Chimnabai Stree Udyogalaya, Opp. Sursagar, Mandvi, Vadodara</p> {/* Updated Address */}
                         <a
                           href="https://maps.google.com/?q=Shri+Maharani+Chimnabai+Stree+Udyogalaya+Vadodara" // Example Google Maps link
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-flex items-center"
                          >
                           Get Directions <ArrowRight className="w-4 h-4 ml-1" />
                         </a>
                       </div>
                    </div>

                    <div className="flex items-start space-x-4">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                         <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-900 mb-1">Hours</h3>
                         <p className="text-gray-600 text-sm sm:text-base">Monday - Sunday: 9:00 AM - 10:00 PM</p>
                         <p className="text-gray-600 text-sm sm:text-base">Kitchen closes at 9:30 PM</p>
                       </div>
                    </div>

                    {/* Add Phone Contact */}
                     <div className="flex items-start space-x-4">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                         <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-900 mb-1">Contact</h3>
                         <a href="tel:+918200306871" className="text-gray-600 text-sm sm:text-base hover:text-primary-600">+91 82003 06871</a> {/* Example Phone */}
                       </div>
                     </div>

                 </div>

                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="mt-6 inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-primary-500 text-white rounded-full font-medium shadow-lg hover:bg-primary-600 transition-colors duration-200 text-sm sm:text-base"
                  >
                   Reserve a Table
                   <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                 </motion.button>
               </div>

               {/* Map Placeholder */}
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-3xl transform rotate-3 -z-10"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 sm:border-8 border-white h-[400px] sm:h-[500px]">
                    {/* Replace with actual map iframe or image */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.548806266471!2d73.19829807507117!3d22.29503642968911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5bbe3f0607b%3A0x33ac28417835816d!2sShri%20Maharani%20Chimnabai%20Stree%20Udyogalaya!5e0!3m2!1sen!2sin!4v1716886941234!5m2!1sen!2sin" // Example embed URL
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Gazra Cafe Location"
                    ></iframe>
                    {/* Map overlay elements */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-md rounded-full p-3 sm:p-4 shadow-lg">
                          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                        </div>
                     </div>
                     <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-3 sm:p-4 pointer-events-none">
                         <p className="font-medium text-center text-gray-900 text-sm sm:text-base">Gazra Cafe</p>
                         <p className="text-xs sm:text-sm text-center text-gray-600">Opp. Sursagar, Mandvi, Vadodara</p>
                     </div>
                  </div>
               </div>
             </div>
           </motion.div>
         </div>
      </section>

      {/* Footer Banner - Immersive CTA */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-primary-50/30 to-white">
         <div className="container mx-auto px-4">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl"
           >
             <div className="absolute inset-0">
               <img
                 src="/images/image-six.jpg" // Background image
                 alt="Cafe dining background"
                 className="w-full h-full object-cover"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-900/80 mix-blend-multiply" />
             </div>

             <div className="relative px-6 py-16 sm:px-8 sm:py-20 md:py-24 text-center">
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
                 Experience the Taste of Maharashtra
               </h2>
               <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                 Join us for a culinary journey that celebrates tradition with a modern twist, in a space that feels like home.
               </p>
               <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary-600 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg text-sm sm:text-base"
                  >
                    Reserve a Table
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button> */}
                  <motion.a // Changed to anchor tag to link to menu section
                    href="#menu"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors duration-200 text-sm sm:text-base"
                  >
                    View Full Menu
                    <Utensils className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
               </div>
             </div>
           </motion.div>
         </div>
      </section>

    </div>
  );
};

export default GazraCafe;