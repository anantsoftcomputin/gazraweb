import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Mail, Phone, Clock, Send, MessageSquare, ArrowRight, Info
} from 'lucide-react';
import PhoneVerification from '../components/shared/PhoneVerification';

// Simple Form Input Component (Optional, for cleaner form code)
const FormInput = ({ id, label, type = 'text', placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200 shadow-sm placeholder-gray-400"
      placeholder={placeholder}
      required // Added basic required attribute
    />
  </div>
);

// Simple Textarea Component (Optional)
const FormTextarea = ({ id, label, placeholder, value, onChange, rows = 4 }) => (
   <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200 shadow-sm placeholder-gray-400"
      placeholder={placeholder}
      required // Added basic required attribute
    />
  </div>
);

// Contact Info Card Component
const ContactInfoCard = ({ icon, title, children, href }) => {
  const content = (
    <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-soft border border-primary-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 h-full">
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
        {icon}
      </div>
      <div>
        <h3 className="text-md sm:text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <div className="text-sm sm:text-base text-gray-600">{children}</div>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>;
  }
  return content;
};


// Main Contact Page Component
const ContactPage = () => {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneVerified) {
      alert('Please verify your phone number before submitting.');
      return;
    }

    // Basic simulation of form submission
    console.log("Form Data:", formState);
    setIsSubmitted(true);
    // Reset form after a delay
    setTimeout(() => {
        setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
        setIsSubmitted(false);
        setPhoneVerified(false);
    }, 3000);
    // In a real app, you would send this data to a server
  };

  const gazraAddress = "Gazra Cafe, Shri Maharani Chimnabai Stree Udyogalaya, Opp. Sursagar, Mandvi, Vadodara, Gujarat 390001";
  const gazraPhone = "+91 82003 06871";
  const gazraEmail = "hello@gazra.org"; // Example email
  // Construct Google Maps URL (replace spaces with +, ensure correct encoding if needed)
  const mapsQuery = encodeURIComponent(gazraAddress);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const mapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${mapsQuery}`; // Replace YOUR_API_KEY if using Embed API

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/10 via-white to-secondary-50/10">

      {/* Hero Section - More Visual */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden bg-white">
        {/* Subtle Background Pattern */}
        <div
          className="absolute inset-0 opacity-5 bg-repeat"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1a18a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} // Example subtle pattern
        ></div>
         {/* Gradient Overlay */}
         <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary-50/50 to-transparent"></div>

        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-flex items-center px-4 py-1.5 bg-primary-100/70 border border-primary-200 rounded-full text-primary-700 text-sm font-medium mb-6 backdrop-blur-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                We're Here to Help
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-5 text-gray-900 leading-tight">
                Connect with <span className="text-primary-600">Gazra</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Whether you have a question, feedback, or just want to say hello, we're all ears. Reach out through your preferred method below.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
       <section className="py-16 sm:py-20 bg-white">
         <div className="container mx-auto px-4">
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
                <ContactInfoCard icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />} title="Visit Us" href={mapsUrl}>
                    <p>{gazraAddress}</p>
                    <span className="mt-2 inline-flex items-center text-primary-600 group-hover:underline text-xs sm:text-sm">
                        Get Directions <ArrowRight className="w-3 h-3 ml-1" />
                    </span>
                </ContactInfoCard>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
               <ContactInfoCard icon={<Mail className="w-5 h-5 sm:w-6 sm:h-6" />} title="Email Us" href={`mailto:${gazraEmail}`}>
                   <p className="break-all">{gazraEmail}</p>
                   <span className="mt-2 inline-flex items-center text-primary-600 group-hover:underline text-xs sm:text-sm">
                        Send an Email <ArrowRight className="w-3 h-3 ml-1" />
                   </span>
               </ContactInfoCard>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
               <ContactInfoCard icon={<Phone className="w-5 h-5 sm:w-6 sm:h-6" />} title="Call Us" href={`tel:${gazraPhone.replace(/\s/g, '')}`}>
                    <p>{gazraPhone}</p>
                   <span className="mt-2 inline-flex items-center text-primary-600 group-hover:underline text-xs sm:text-sm">
                        Call Now <ArrowRight className="w-3 h-3 ml-1" />
                   </span>
               </ContactInfoCard>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
               <ContactInfoCard icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />} title="Opening Hours">
                   <p>Mon - Sun: 9:00 AM - 10:00 PM</p>
                   <p className="text-xs text-gray-500 mt-1">Gazra Cafe Hours</p>
               </ContactInfoCard>
             </motion.div>
           </div>
         </div>
       </section>

      {/* Form & Map Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Contact Form */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100"
            >
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-6">Send us a Message</h2>
              {isSubmitted ? (
                 <div className="text-center p-8 bg-primary-50 rounded-lg text-primary-700">
                   <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                     <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                     <p>Your message has been sent successfully. We'll get back to you soon.</p>
                   </motion.div>
                 </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <FormInput id="name" label="Your Name" placeholder="John Doe" value={formState.name} onChange={handleInputChange} />
                  <FormInput id="email" label="Email Address" type="email" placeholder="john.doe@example.com" value={formState.email} onChange={handleInputChange} />
                  <FormInput id="phone" label="Phone Number" type="tel" placeholder="9876543210" value={formState.phone} onChange={handleInputChange} />
                  
                  {/* Phone Verification */}
                  <div className="border-2 border-primary-100 rounded-lg p-4 bg-primary-50/30">
                    <PhoneVerification
                      phoneNumber={formState.phone}
                      onPhoneChange={(phone) => setFormState({ ...formState, phone })}
                      onVerified={() => setPhoneVerified(true)}
                    />
                  </div>

                  <FormInput id="subject" label="Subject" placeholder="How can we help you?" value={formState.subject} onChange={handleInputChange} />
                  <FormTextarea id="message" label="Your Message" placeholder="Tell us more about your inquiry..." value={formState.message} onChange={handleInputChange} />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Send Message
                    <Send className="ml-2 w-5 h-5" />
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Map & Visit Info */}
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

          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;