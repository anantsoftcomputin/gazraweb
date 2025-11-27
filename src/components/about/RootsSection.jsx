import React from 'react';

const RootsSection = () => {
  return (
    <section className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-primary-100 rounded-3xl transform -rotate-3"></div>
            <img
              src="https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Historical photo"
              className="relative rounded-3xl shadow-lg sepia"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Our Roots
            </h2>
            <div className="prose prose-lg">
              <p>
                Founded in Vadodara, Gazra emerged from the vision of creating a safe and inclusive space for the LGBTQIA+ community. Our journey began with small community meetups and has grown into a vibrant organization that serves and supports hundreds of individuals.
              </p>
              <p>
                The inspiration for Gazra came from the rich history of Shri Chimnabai Stree Udhyogalay, an institution that has been empowering marginalized communities for generations. We carry forward this legacy of social change and community support.
              </p>
              <p>
                Today, we continue to build on these strong foundations, expanding our reach and impact while staying true to our core values of inclusivity, support, and community building.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RootsSection;