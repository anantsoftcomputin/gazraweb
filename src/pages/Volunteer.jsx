import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Users, Calendar, 
  Clock, ChefHat, Coffee,
  Sparkles, ArrowRight, 
  CheckCircle, MapPin,
  MessageSquare, Send
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

const VolunteerPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addDocument } = useFirestore('volunteers');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [],
    availability: '',
    message: ''
  });

  const volunteerRoles = [
    {
      id: 'community',
      title: 'Community Host',
      icon: Users,
      commitment: '4-6 hours/week',
      schedule: 'Flexible',
      description: 'Welcome guests, facilitate conversations, and help create a warm, inclusive environment.',
      responsibilities: [
        'Greet and assist cafe visitors',
        'Facilitate community events',
        'Create welcoming atmosphere',
        'Support special programs'
      ]
    },
    {
      id: 'events',
      title: 'Events Support',
      icon: Calendar,
      commitment: 'Event-based',
      schedule: 'Weekends',
      description: 'Help organize and run our various community events, from cultural celebrations to workshops.',
      responsibilities: [
        'Event setup and coordination',
        'Guest registration',
        'Photography and documentation',
        'Post-event support'
      ]
    },
    {
      id: 'kitchen',
      title: 'Kitchen Assistant',
      icon: ChefHat,
      commitment: '6-8 hours/week',
      schedule: 'Morning/Evening',
      description: 'Assist our kitchen team in food preparation and learning traditional recipes.',
      responsibilities: [
        'Food preparation assistance',
        'Kitchen organization',
        'Recipe documentation',
        'Inventory management'
      ]
    },
    {
      id: 'outreach',
      title: 'Community Outreach',
      icon: Heart,
      commitment: '3-4 hours/week',
      schedule: 'Flexible',
      description: 'Help spread the word about Gazra and build connections with local communities.',
      responsibilities: [
        'Social media management',
        'Community partnerships',
        'Local outreach programs',
        'Impact documentation'
      ]
    }
  ];

  const impactStats = [
    { number: '1000+', label: 'Community Members' },
    { number: '50+', label: 'Active Volunteers' },
    { number: '200+', label: 'Events Hosted' },
    { number: '5000+', label: 'Lives Touched' }
  ];

  const testimonials = [
    {
      quote: "Volunteering at Gazra has given me a second family. The connections I've made here are priceless.",
      author: "Priya S.",
      role: "Community Host",
      duration: "6 months"
    },
    {
      quote: "It's amazing to be part of something that brings so much joy to our community. Every shift is fulfilling.",
      author: "Rahul M.",
      role: "Events Support",
      duration: "1 year"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDocument({
        ...formData,
        selectedRole: selectedRole || 'Not specified',
        status: 'pending'
      });
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        interests: [],
        availability: '',
        message: ''
      });
      setSelectedRole(null);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] -top-[250px] -left-[250px] bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute w-[500px] h-[500px] -bottom-[250px] -right-[250px] bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center px-3 py-1.5 bg-white border-2 border-primary-200 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              Join Our Community
            </span>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Make a
              <span className="block mt-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Difference Together
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Become part of our mission to create welcoming spaces and meaningful connections in our community.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Find Your Role
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you have a few hours or a regular commitment, there's a perfect role for everyone at Gazra.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {volunteerRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                  selectedRole === role.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="w-12 h-12 mb-4 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors duration-300">
                  <role.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-primary-500" />
                    {role.commitment}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                    {role.schedule}
                  </div>
                </div>

                <div className="space-y-2">
                  {role.responsibilities.map((responsibility, idx) => (
                    <div key={idx} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-primary-500 shrink-0 mt-0.5" />
                      <span>{responsibility}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary-50/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm relative"
              >
                <div className="absolute top-6 right-6 text-primary-500/20">
                  <MessageSquare className="w-12 h-12" />
                </div>
                <p className="text-gray-600 mb-6 relative text-lg italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} • {testimonial.duration}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Join Our Team
              </h2>
              <p className="text-gray-600">
                Ready to make a difference? Fill out the form below and we'll get back to you soon.
              </p>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6 bg-white rounded-xl p-8 shadow-sm"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-primary-100 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-primary-100 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-primary-100 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all duration-200"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Interest
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {volunteerRoles.map((role) => (
                    <label key={role.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(role.id)}
                        onChange={(e) => {
                          const newInterests = e.target.checked
                            ? [...formData.interests, role.id]
                            : formData.interests.filter(i => i !== role.id);
                          setFormData({ ...formData, interests: newInterests });
                        }}
                        className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{role.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-primary-100 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all duration-200"
                >
                  <option value="">Select availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="mornings">Mornings</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about yourself
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border-2 border-primary-100 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all duration-200"
                  placeholder="Share your motivation for volunteering and any relevant experience..."
                />
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Application submitted successfully! We'll be in touch soon.
                  </span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-primary-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Everything you need to know about volunteering at Gazra
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "What is the minimum time commitment?",
                  answer: "We're flexible! While most roles suggest 4-6 hours per week, we can work with your schedule. Even a few hours a month can make a difference."
                },
                {
                  question: "Do I need previous experience?",
                  answer: "No prior experience is required! We provide comprehensive training and support for all our volunteer roles. Your enthusiasm and commitment are what matter most."
                },
                {
                  question: "Can I volunteer for multiple roles?",
                  answer: "Absolutely! Many of our volunteers contribute to different areas based on their interests and availability. You can start with one role and explore others as you get comfortable."
                },
                {
                  question: "What benefits do volunteers receive?",
                  answer: "Beyond the joy of giving back, volunteers enjoy complimentary beverages during shifts, special community event access, skill-building workshops, and a supportive community network."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Call-to-Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20" />
            </div>
            <div className="relative px-8 py-12 md:py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Join Our Community Today
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Be part of something bigger. Together, we can create meaningful change and strengthen our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-colors duration-200"
                >
                  Start Volunteering
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors duration-200"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-8">
              Our volunteer coordinator is here to help you get started on your journey with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-gray-600">123 Community Avenue, City</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-primary-600 mr-2" />
                <a href="mailto:volunteer@gazra.org" className="text-primary-600 hover:text-primary-700">
                  volunteer@gazra.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VolunteerPage;