import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Coffee, Wallet, Smartphone, Briefcase } from 'lucide-react'; // Removed unused BookOpen

// Add custom animation keyframes
const floatAnimation = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation-name: float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
`;

const Hero = () => {
  const images = [
    { url: "/images/image-one.jpg", alt: "Community 1" },
    { url: "/images/image7.webp", alt: "Community 2" },
    { url: "/images/image-three.jpg", alt: "Community 3" },
    { url: "/images/image-four.jpg", alt: "Community 4" },
    { url: "/images/image-five.jpg", alt: "Community 5" }
  ];

  const serviceButtons = [
    { icon: Smartphone, title: "Gazra Mitra", url: "https://mitra.gazra.org", isExternal: true, color: "from-green-400 to-green-600" },
    { icon: Wallet, title: "Gazra Support Fund", url: "/gazra-support", color: "from-pink-400 to-pink-600" },
    { icon: Coffee, title: "Gazra Cafe", url: "/cafe", color: "from-orange-400 to-orange-600" },
    { icon: Briefcase, title: "Gazra Skill Hub", url: "/gazra-skills", color: "from-blue-400 to-blue-600" }
  ];

  return (
    <div className="relative min-h-[80vh] bg-[#f5f0e8]">
      {/* Add the custom animation styles */}
      <style>{floatAnimation}</style>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left column */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a971] text-white rounded-full text-xs font-medium uppercase tracking-wide">
              <Sparkles className="w-3 h-3" />
              SHRI MAHARANI CHIMNABAI STREE UDYOGALAYA
            </div>

            {/* Logos side by side */}
            <div className="flex space-x-6 items-center">
              <div className="w-24 h-24 lg:w-28 lg:h-28">
                <img src="https://gazra.org/logo.png" alt="Gazra Logo" className="w-full h-full object-contain"/>
              </div>
              <div className="w-24 h-24 lg:w-28 lg:h-28">
                <img src="https://i0.wp.com/mcsu.in/wp-content/uploads/2022/07/Logo.png?w=512&ssl=1" alt="MCSU Logo" className="w-full h-full object-contain"/>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-[#e91e63]">
              The Gazra Project
            </h1>

            {/* Description */}
            <p className="text-base lg:text-lg text-gray-700 max-w-xl leading-relaxed">
              Join a Vibrant Community where Authenticity Thrives. Together, We create a world of Acceptance and Empowerment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="group inline-flex items-center gap-2 px-6 py-3 bg-[#c9a971] text-white rounded-lg font-medium hover:bg-[#b8985f] transition-all duration-300">
                Join Our Community
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#c9a971] text-[#c9a971] rounded-lg font-medium hover:bg-[#c9a971] hover:text-white transition-all duration-300">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service Buttons Section */}
            <div className="pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Our Initiatives
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {serviceButtons.map((service, index) => (
                  service.isExternal ? (
                    <a
                      key={index}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#c9a971] text-white`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <span className="block font-semibold text-sm text-gray-900 mb-1">{service.title}</span>
                        <span className="flex items-center justify-center gap-1 text-xs text-[#c9a971] font-medium">
                          Know More
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={service.url}
                      className="group flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#c9a971] text-white`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <span className="block font-semibold text-sm text-gray-900 mb-1">{service.title}</span>
                        <span className="flex items-center justify-center gap-1 text-xs text-[#c9a971] font-medium">
                          Know More
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Image Grid matching reference */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              {/* First row - 2 images */}
              <div className="col-span-1">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={images[0].url} 
                    alt={images[0].alt} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={images[1].url} 
                    alt={images[1].alt} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              {/* Second row - 1 large image */}
              <div className="col-span-2">
                <div className="aspect-[16/7] rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={images[2].url} 
                    alt={images[2].alt} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              {/* Third row - 2 images */}
              <div className="col-span-1">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={images[3].url} 
                    alt={images[3].alt} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={images[4].url} 
                    alt={images[4].alt} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;