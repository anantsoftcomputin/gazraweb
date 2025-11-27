import React from 'react';

const StorySection = () => {
  const timelineEvents = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Gazra was founded with a vision to create safe spaces for the LGBTQIA+ community in Vadodara."
    },
    {
      year: "2021",
      title: "Opening of Gazra Cafe",
      description: "Launched our community cafe, providing a welcoming space for people to connect and belong."
    },
    {
      year: "2022",
      title: "Community Programs",
      description: "Initiated mental health support groups and awareness workshops in schools and colleges."
    },
    {
      year: "2023",
      title: "Growing Impact",
      description: "Expanded our reach to surrounding areas and launched new initiatives for community support."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
            The Gazra Journey
          </h2>
          <p className="text-lg text-gray-600">
            From humble beginnings to a thriving community hub, our journey has been one of growth, learning, and continuous evolution.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200"></div>

          {/* Timeline Events */}
          <div className="relative space-y-12">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="w-1/2 px-8">
                  <div className={`${
                    index % 2 === 0 ? "text-right" : "text-left"
                  }`}>
                    <div className="inline-block bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-2">
                      {event.year}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600">
                      {event.description}
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white"></div>
                <div className="w-1/2 px-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;