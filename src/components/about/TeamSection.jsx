import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Executive Director",
      image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Alex Chen",
      role: "Community Manager",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Priya Patel",
      role: "Programs Coordinator",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Michael Torres",
      role: "Outreach Specialist",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    }
  ];

  return (
    <section className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600">
            Dedicated individuals working together to create positive change and foster inclusivity in our community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {member.role}
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.social.facebook}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-300"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-300"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;