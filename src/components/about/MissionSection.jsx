import React from 'react';
import { Heart, Users, Home, Shield } from 'lucide-react';

const MissionSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Inclusivity",
      description: "Creating spaces where everyone feels welcomed, valued, and respected regardless of their identity."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building strong connections and support networks within the LGBTQIA+ community and allies."
    },
    {
      icon: Home,
      title: "Safe Space",
      description: "Providing a secure environment where individuals can express themselves freely and authentically."
    },
    {
      icon: Shield,
      title: "Advocacy",
      description: "Standing up for LGBTQIA+ rights and promoting positive change in society."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600">
              At Gazra, we envision a world where every individual can live authentically and proudly. Our mission is to create inclusive spaces, foster understanding, and build a stronger, more connected LGBTQIA+ community in Vadodara and beyond.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="p-6 bg-white rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300"
                >
                  <value.icon className="w-8 h-8 text-primary-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary-100 rounded-3xl transform rotate-3"></div>
            <img
              src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Community gathering"
              className="relative rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;