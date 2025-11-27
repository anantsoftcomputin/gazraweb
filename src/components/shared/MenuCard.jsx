import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, Leaf, Clock, Flame, ChefHat } from 'lucide-react';

const MenuCard = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Enhanced menu items with additional details
  const menuItems = {
    snacks: [
      {
        id: 1,
        name: 'Kothambir Wadi',
        price: '₹180',
        description: 'Crispy coriander-based snack with aromatic spices',
        ingredients: [
          'Fresh Coriander',
          'Gram Flour',
          'Ginger-Garlic Paste',
          'Green Chilies',
          'Cumin Seeds',
          'Traditional Spices'
        ],
        nutritionalInfo: {
          calories: '180 kcal',
          protein: '6g',
          carbs: '22g',
          fat: '8g',
          fiber: '4g'
        },
        prepTime: '30 mins',
        servingSize: '4 pieces',
        allergens: ['Nuts', 'Gluten'],
        tags: ['Crispy', 'Traditional'],
        spiceLevel: 'medium',
        popular: true,
        chefNotes: 'A beloved Maharashtrian snack that perfectly balances crunch and flavor.'
      },
      // ... other menu items
    ]
  };

  const getSpiceLevelColor = (level) => {
    const colors = {
      mild: 'bg-green-500',
      medium: 'bg-orange-500',
      hot: 'bg-red-500'
    };
    return colors[level] || colors.medium;
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(menuItems).map(([category, items]) =>
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={dishImages[item.name] || '/api/placeholder/400/300'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
                  />
                  {item.popular && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      Popular
                    </div>
                  )}
                  {item.recommended && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full flex items-center">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Chef's Pick
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-md font-medium text-primary-600">{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.spiceLevel && (
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-1 ${getSpiceLevelColor(item.spiceLevel)}`}
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

      {/* Expanded View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header with Image */}
              <div className="relative h-64">
                <img
                  src={dishImages[selectedItem.name] || '/api/placeholder/800/400'}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                  <span className="text-xl font-semibold text-primary-600">{selectedItem.price}</span>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedItem.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedItem.nutritionalInfo.calories}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedItem.servingSize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedItem.spiceLevel} Spice</span>
                  </div>
                </div>

                {/* Description and Chef's Notes */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About the Dish</h3>
                  <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                  <p className="text-gray-600 italic">{selectedItem.chefNotes}</p>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nutritional Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(selectedItem.nutritionalInfo).map(([key, value]) => (
                      <div key={key} className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 capitalize">{key}</div>
                        <div className="text-base font-semibold text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                {selectedItem.allergens && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Allergens</h3>
                    <div className="flex gap-2">
                      {selectedItem.allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuCard;