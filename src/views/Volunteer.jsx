import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Users, Calendar, 
  Clock, ChefHat, Coffee,
  Sparkles, ArrowRight, 
  CheckCircle, MapPin,
  MessageSquare, Send, Upload, FileText, Briefcase, X
} from 'lucide-react';
import { fileToBase64, usePublicSubmission } from '../hooks/usePublicSubmission';
import PhoneVerification from '../components/shared/PhoneVerification';

const VolunteerPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const { submit } = usePublicSubmission('volunteer');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contributions: [],
    otherContribution: '',
    availability: [],
    experienceLevel: '',
    message: '',
    resumeUrl: ''
  });

  const contributionAreas = [
    { id: 'community_outreach', label: 'Community & Outreach' },
    { id: 'emotional_support', label: 'Emotional & Space Holding Support' },
    { id: 'social_media', label: 'Social Media & Creative' },
    { id: 'events_ground', label: 'Events & On-Ground Support' },
    { id: 'administration', label: 'Administration & Coordination' },
    { id: 'strategy_growth', label: 'Strategy, Partnerships & Growth' },
    { id: 'research_documentation', label: 'Research & Documentation' },
    { id: 'fundraising', label: 'Fundraising & Sponsorship' },
    { id: 'technical_digital', label: 'Technical & Digital Support' },
  ];

  const availabilityOptions = [
    { id: 'hours_2_3', label: '2–3 hours per week' },
    { id: 'hours_4_6', label: '4–6 hours per week' },
    { id: 'event_based', label: 'Event-based support only' },
    { id: 'short_term', label: 'Short-term project commitment' },
    { id: 'long_term', label: 'Long-term involvement' },
    { id: 'flexible', label: 'Flexible / As needed' },
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'experienced', label: 'Experienced' },
    { id: 'professional', label: 'Professional' },
  ];

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

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      alert('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5 MB');
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneVerified) {
      alert('Please verify your phone number before submitting.');
      return;
    }

    setSubmitting(true);
    
    try {
      setResumeUploading(Boolean(resumeFile));
      const resume = resumeFile ? {
        name: resumeFile.name,
        contentType: resumeFile.type,
        base64: await fileToBase64(resumeFile)
      } : undefined;
      const result = await submit({
        ...formData,
        selectedRole: selectedRole || 'Not specified',
        status: 'pending'
      }, resume ? { resume } : {});
      if (!result.success) throw new Error(result.error);
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        contributions: [],
        otherContribution: '',
        availability: [],
        experienceLevel: '',
        message: '',
        resumeUrl: ''
      });
      setSelectedRole(null);
      setResumeFile(null);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
      setResumeUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gazra-paper)]">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-neutral-950">
        <img src="/images/join-community.jpg" alt=""
             className="absolute inset-0 w-full h-full object-cover" />
        {/* Darkening scrim for consistent text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded border border-primary-200/40
                            bg-[rgba(251,244,231,0.88)] text-xs font-bold uppercase tracking-wide
                            text-accent-terracotta shadow-lg backdrop-blur-md">
              <Heart className="w-3.5 h-3.5" />
              Join Our Community
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight
                           drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] mb-5">
              Make a
              <span className="block text-primary-300">Difference</span>
              Together
            </h1>
            <p className="text-primary-100/80 text-lg leading-relaxed mb-8">
              Become part of our mission to create welcoming spaces and meaningful connections in our community.
            </p>

            <button
              onClick={() => document.querySelector('#volunteer-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white
                         font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-200"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-14 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4">
          <div className="gazra-folk-chain max-w-xs mx-auto mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.09 }}
                className="text-center bg-white border border-[rgba(184,121,44,0.18)] rounded-lg p-5 shadow-sm"
              >
                <div className="font-display text-3xl sm:text-4xl font-black text-primary-600 mb-1">{stat.number}</div>
                <div className="text-sm text-neutral-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="py-16 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/60
                            bg-primary-50 text-xs font-bold uppercase tracking-wide text-primary-700 mb-4">
              Volunteer Roles
            </div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 mb-3">
              Find Your Role
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-sm">
              Whether you have a few hours or a regular commitment, there's a perfect role for everyone at Gazra.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {volunteerRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.09 }}
                className={`group relative heritage-paper overflow-hidden rounded-lg p-6 border shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2
                  ${selectedRole === role.id
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-neutral-300 hover:shadow-xl hover:border-primary-500'}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
                <div className="w-12 h-12 mb-4 bg-primary-600 rounded flex items-center justify-center text-white">
                  <role.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">{role.title}</h3>
                <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{role.description}</p>
                
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
                    <div key={idx} className="flex items-start text-sm text-neutral-600">
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
      <section className="py-14 bg-neutral-900 relative overflow-hidden">
        <img src="/images/image9.webp" alt="" loading="lazy" decoding="async"
             className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/80 to-neutral-900/70" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold text-white">Voices from the Community</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[rgba(251,244,231,0.08)] backdrop-blur-md border border-primary-200/20 rounded-lg p-7 relative"
              >
                <div className="absolute top-5 right-5 text-primary-300/20">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <p className="text-primary-100/85 mb-5 text-base italic leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                  <div className="text-xs text-primary-200/60 mt-0.5">{testimonial.role} · {testimonial.duration}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="volunteer-form" className="py-16 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/60
                              bg-primary-50 text-xs font-bold uppercase tracking-wide text-primary-700 mb-4">
                Apply Now
              </div>
              <h2 className="font-display text-3xl font-bold text-neutral-900 mb-3">
                Join Our Team
              </h2>
              <p className="text-neutral-600 text-sm">
                Ready to make a difference? Fill out the form below and we'll get back to you soon.
              </p>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6 bg-white border border-[rgba(184,121,44,0.18)] rounded-lg overflow-hidden shadow-lg"
            >
              {/* Toran top stripe */}
              <div className="h-[4px]"
                   style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />
              <div className="px-7 sm:px-8 pb-8 pt-2 space-y-6">
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

              {/* Phone Verification */}
              <div className="border-2 border-primary-100 rounded-lg p-4 bg-primary-50/30">
                <PhoneVerification
                  phoneNumber={formData.phone}
                  onPhoneChange={(phone) => setFormData({ ...formData, phone })}
                  onVerified={() => setPhoneVerified(true)}
                />
              </div>

              {/* Contribution Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  As a Gajra Volunteer, I Can Contribute In
                  <span className="text-gray-400 font-normal ml-1">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contributionAreas.map((area) => (
                    <label key={area.id} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.contributions.includes(area.id)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.contributions, area.id]
                            : formData.contributions.filter(i => i !== area.id);
                          setFormData({ ...formData, contributions: updated });
                        }}
                        className="w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">{area.label}</span>
                    </label>
                  ))}
                  {/* Other option */}
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.contributions.includes('other')}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.contributions, 'other']
                          : formData.contributions.filter(i => i !== 'other');
                        setFormData({ ...formData, contributions: updated, otherContribution: e.target.checked ? formData.otherContribution : '' });
                      }}
                      className="w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">Other</span>
                  </label>
                </div>
                {formData.contributions.includes('other') && (
                  <input
                    type="text"
                    value={formData.otherContribution}
                    onChange={(e) => setFormData({ ...formData, otherContribution: e.target.value })}
                    placeholder="Please specify..."
                    className="mt-3 w-full px-4 py-2 rounded-lg border-2 border-primary-100 focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all duration-200 text-sm"
                  />
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ⏳ Availability
                  <span className="text-gray-400 font-normal ml-1">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availabilityOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(option.id)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.availability, option.id]
                            : formData.availability.filter(i => i !== option.id);
                          setFormData({ ...formData, availability: updated });
                        }}
                        className="w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🎯 Experience Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {experienceLevels.map((level) => (
                    <label key={level.id} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level.id}
                        checked={formData.experienceLevel === level.id}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        className="w-4 h-4 border-primary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume / CV
                  <span className="text-gray-400 font-normal ml-1">(Optional — PDF or Word, max 5 MB)</span>
                </label>
                {!resumeFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-primary-200 rounded-lg cursor-pointer bg-primary-50/30 hover:bg-primary-50 transition-colors duration-200 group">
                    <Upload className="w-6 h-6 text-primary-400 group-hover:text-primary-600 mb-2 transition-colors" />
                    <span className="text-sm text-gray-500 group-hover:text-primary-600 transition-colors">Click to upload resume</span>
                    <span className="text-xs text-gray-400 mt-1">.pdf, .doc, .docx</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 border-2 border-primary-200 rounded-lg">
                    <FileText className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-sm text-primary-800 font-medium flex-1 truncate">{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-1 hover:bg-primary-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-primary-600" />
                    </button>
                  </div>
                )}
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
                    {resumeUploading ? 'Uploading Resume...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    Submit Application
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[var(--gazra-paper)]">
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
                  className="bg-white border border-[rgba(184,121,44,0.15)] rounded-lg p-6 shadow-sm"
                >
                  <h3 className="font-display text-base font-bold text-neutral-900 mb-2">{faq.question}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Call-to-Action */}
      <section className="py-16 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 gazra-jaali opacity-20" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mb-7" />
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-4">
            Join Our Community Today
          </h2>
          <p className="text-primary-100/80 mb-8 max-w-xl mx-auto leading-relaxed">
            Be part of something bigger. Together, we can create meaningful change and strengthen our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.querySelector('#volunteer-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-700
                         font-bold rounded-lg hover:bg-primary-50 transition-colors duration-200 shadow-lg">
              Start Volunteering
              <ArrowRight className="w-4 h-4" />
            </button>
            <a href="/about"
               className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-100/60
                          text-primary-50 font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mt-7" />
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
              Have Questions?
            </h2>
            <p className="text-neutral-600 mb-6 text-sm">
              Our volunteer coordinator is here to help you get started on your journey with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span className="text-neutral-600 text-sm">Opp. Sursagar, Mandvi, Vadodara</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-600" />
                <a href="mailto:volunteer@gazra.org" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
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
