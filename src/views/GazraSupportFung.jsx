import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  ShieldCheck,
  BookOpen,
  Stethoscope,
  Brain,
  Scale,
  ArrowRight,
  Check,
  Download,
  FileText,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import PhoneVerification from '../components/shared/PhoneVerification';

const GazraSupportFund = () => {
  const [openSection, setOpenSection] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    age: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Step 2
    supportType: '',
    supportDescription: '',
    amountRequested: '',
    urgencyLevel: '',
    previousAssistance: '',
    // Step 3
    employmentStatus: '',
    monthlyIncome: '',
    dependents: '',
    householdSize: '',
    medicalConditions: '',
    currentChallenges: '',
    // Step 4
    declaration: false
  });
  const { addDocument } = useFirestore('supportRequests');

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection('');
    } else {
      setOpenSection(section);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!phoneVerified) {
      alert('Please verify your phone number before submitting.');
      return;
    }

    if (!formData.declaration) {
      alert('Please agree to the declaration before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await addDocument({
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });

      if (result.success) {
        setSubmitted(true);
        setFormStep(1);
        setFormData({
          fullName: '',
          age: '',
          gender: '',
          phoneNumber: '',
          email: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          supportType: '',
          supportDescription: '',
          amountRequested: '',
          urgencyLevel: '',
          previousAssistance: '',
          employmentStatus: '',
          monthlyIncome: '',
          dependents: '',
          householdSize: '',
          medicalConditions: '',
          currentChallenges: '',
          declaration: false
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[800px] h-[800px] -top-[400px] -left-[400px] bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute w-[800px] h-[800px] -bottom-[400px] -right-[400px] bg-accent-terracotta/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center px-3 py-1.5 bg-white/80 backdrop-blur-sm border-2 border-primary-100 rounded-full text-primary-600 text-sm font-medium">
                <Heart className="w-4 h-4 mr-2" strokeWidth={3} />
                Gazra Support Fund
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                <span className="block text-neutral-900">Empowering</span>
                <span className="block mt-2 bg-gradient-to-r from-primary-600 to-accent-terracotta bg-clip-text text-transparent">
                  Journeys of Authentic
                </span>
                <span className="block mt-2 text-neutral-900">Self-Expression</span>
              </h1>

              <p className="text-xl text-neutral-600 max-w-2xl">
                An initiative by Shri Maharani Chimnabai Stree Udyogalaya providing financial support for education, medical treatments, gender-affirming surgeries, mental health services, and legal aid to the LGBTQIA+ community and women in need.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#apply"
                  className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-xl shadow-colored hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
                >
                  Apply for Support
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#eligibility"
                  className="inline-flex items-center px-6 py-3 border-2 border-primary-200 text-primary-600 rounded-xl hover:bg-primary-50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Check Eligibility
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-accent-ochre/20 rounded-3xl transform rotate-3"></div>
              <img
                src="/images/image7.webp"
                alt="Gazra Support Fund"
                className="relative rounded-3xl shadow-lg object-cover w-full h-[500px]"
              />
              <div className="absolute -bottom-6 right-8 p-4 bg-white rounded-xl shadow-medium border border-primary-100 max-w-xs">
                <p className="text-sm font-medium text-neutral-800">
                  "Everyone deserves the chance to live with Freedom and without Subjugation. We're here to help make that possible."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Areas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              Our Support Areas
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
              Comprehensive Support for Your Journey
            </h2>
            <p className="text-lg text-neutral-600">
              We offer financial assistance across multiple dimensions to ensure holistic support for your unique needs and challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Education Funding */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Education Funding</h3>
                <p className="text-neutral-600 mb-6">
                  Support for tuition fees, educational materials, and skill development programs to empower through knowledge and opportunity.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Tuition assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Study materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Vocational training</span>
                  </li>
                </ul>
                <button className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Medical Treatments */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-accent-terracotta to-accent-ochre"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6">
                  <Stethoscope className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Medical Treatments</h3>
                <p className="text-neutral-600 mb-6">
                  Financial assistance for essential medical procedures, treatments, and healthcare services for improved wellbeing.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Medical procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Medication support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Hospitalization costs</span>
                  </li>
                </ul>
                <button className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Gender-Affirming Surgeries */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-accent-sage to-primary-500"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Gender-Affirming Care</h3>
                <p className="text-neutral-600 mb-6">
                  Support for gender-affirming surgeries and treatments that help individuals align their physical appearance with their gender identity.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Surgical procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Hormone therapy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Post-operative care</span>
                  </li>
                </ul>
                <button className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Mental Health Services */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-accent-slate to-accent-sage"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6">
                  <Brain className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Mental Health Access</h3>
                <p className="text-neutral-600 mb-6">
                  Funding for therapy, counseling, and mental health services to support emotional wellbeing and psychological resilience.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Therapy sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Counseling services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Support groups</span>
                  </li>
                </ul>
                <button className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Legal Aid */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-primary-600 to-accent-slate"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6">
                  <Scale className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Legal Aid</h3>
                <p className="text-neutral-600 mb-6">
                  Assistance for legal consultations, documentation, and representation to navigate legal challenges and protect rights.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Legal consultations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Document assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Court representation</span>
                  </li>
                </ul>
                <button className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-accent-ochre to-primary-400"></div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Emergency Support</h3>
                <p className="text-neutral-600 mb-6">
                  Immediate financial relief for urgent situations, crisis interventions, and basic necessities during challenging times.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Crisis intervention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Shelter assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Immediate relief</span>
                  </li>
                </ul>
                <button className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility & Application Process */}
      <section id="eligibility" className="py-20 bg-gradient-to-b from-white to-primary-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
              Eligibility & Application Process
            </h2>
            <p className="text-lg text-neutral-600">
              Our transparent process ensures that support reaches those who need it most, through a fair and compassionate evaluation system.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Eligibility Criteria */}
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-primary-100">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                <ShieldCheck className="w-6 h-6 text-primary-500 mr-2" />
                Eligibility Criteria
              </h3>

              <div className="space-y-6">
                <div className="p-6 bg-primary-50 rounded-xl">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-3">Who Can Apply</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">Members of the LGBTQIA+ community</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">Women in need of financial assistance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">Individuals demonstrating genuine financial need</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">For gender-affirming surgeries: Those with psychological clearance and counseling</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-800 mb-3">Required Documents</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">Proof of Identity (Aadhaar, Passport, etc.)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">Income Proof (Salary Slip, Bank Statement, or an Affidavit)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">Medical Clearance Certificate (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">Letter of intent detailing the significance of support in your life</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Application Process */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Application Process
              </h3>

              <div className="relative">
                {/* Step 1 */}
                <div className="relative pl-12 pb-12 border-l-2 border-primary-200">
                  <div className="absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">1</div>
                  <div className="bg-white rounded-xl shadow-soft p-6 border border-primary-100">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-2">Application Submission</h4>
                    <p className="text-neutral-600 mb-3">
                      Complete and submit the application form along with all required documents. Ensure all information is accurate and complete.
                    </p>
                    <button
                      onClick={() => toggleSection('step1')}
                      className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
                    >
                      View Details
                      <ChevronDown className={`w-4 h-4 transform transition-transform ${openSection === 'step1' ? 'rotate-180' : ''}`} />
                    </button>

                    {openSection === 'step1' && (
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <h5 className="text-sm font-semibold text-neutral-800 mb-2">Eligibility Criteria:</h5>
                        <ul className="space-y-2 text-sm text-neutral-600 mb-4">
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Must be a member of the LGBTQIA+ community or woman in need</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Must demonstrate a genuine need for financial assistance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Should have undergone counseling and received psychological clearance for gender-affirming surgery (if applicable)</span>
                          </li>
                        </ul>

                        <h5 className="text-sm font-semibold text-neutral-800 mb-2">Required Documents:</h5>
                        <ul className="space-y-2 text-sm text-neutral-600">
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Proof of Identity (Aadhaar, Passport, etc.)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Income Proof (Salary Slip, Bank Statement, or an Affidavit)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Medical Clearance Certificate from a licensed practitioner</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>A letter of intent detailing why you seek assistance and its significance in your life</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-12 pb-12 border-l-2 border-primary-200">
                  <div className="absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">2</div>
                  <div className="bg-white rounded-xl shadow-soft p-6 border border-primary-100">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-2">Initial Screening</h4>
                    <p className="text-neutral-600">
                      Our team reviews your application, verifies documents for authenticity, and shortlists based on financial need and readiness.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-12 pb-12 border-l-2 border-primary-200">
                  <div className="absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">3</div>
                  <div className="bg-white rounded-xl shadow-soft p-6 border border-primary-100">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-2">Interview Process</h4>
                    <p className="text-neutral-600 mb-3">
                      Shortlisted applicants are invited for a panel interview to assess readiness, understanding, and commitment.
                    </p>
                    <button
                      onClick={() => toggleSection('step3')}
                      className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
                    >
                      View Details
                      <ChevronDown className={`w-4 h-4 transform transition-transform ${openSection === 'step3' ? 'rotate-180' : ''}`} />
                    </button>

                    {openSection === 'step3' && (
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <p className="text-sm text-neutral-600 mb-3">
                          The interview panel typically includes a counselor, a community member, and a medical professional who will assess:
                        </p>
                        <ul className="space-y-2 text-sm text-neutral-600">
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Emotional preparedness for the assistance (especially for medical procedures)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Understanding of the process and its implications</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Commitment to follow-up care and counseling</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">4</div>
                  <div className="bg-white rounded-xl shadow-soft p-6 border border-primary-100">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-2">Final Selection</h4>
                    <p className="text-neutral-600 mb-3">
                      Applicants are selected based on financial necessity, readiness, and panel recommendations. Successful applicants are notified and funding arrangements are made.
                    </p>
                    <button
                      onClick={() => toggleSection('step4')}
                      className="inline-flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700"
                    >
                      View Details
                      <ChevronDown className={`w-4 h-4 transform transition-transform ${openSection === 'step4' ? 'rotate-180' : ''}`} />
                    </button>

                    {openSection === 'step4' && (
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <p className="text-sm text-neutral-600 mb-3">
                          Final selection criteria include:
                        </p>
                        <ul className="space-y-2 text-sm text-neutral-600">
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Financial necessity and vulnerability</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Readiness and genuine intent for the purpose of assistance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Recommendations from the interview panel</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                            <span>Alignment with our fund's mission and available resources</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 mt-8">
                <h4 className="flex items-center text-lg font-semibold text-neutral-800 mb-3">
                  <Calendar className="w-5 h-5 text-primary-500 mr-2" />
                  Application Timeline
                </h4>
                <p className="text-neutral-600 mb-4">
                  The selection process typically takes 3-4 weeks from submission to final decision. Urgent cases may be expedited based on need and available resources.
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <a
                    href="#apply"
                    className="inline-flex items-center px-5 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                  <button className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group">
                    Download Guidelines
                    <Download className="ml-2 w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-20 bg-primary-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-white border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
                Get Started
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
                Support Fund Application
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Fill out the initial screening questionnaire below to begin your application process. All information provided is kept strictly confidential.
              </p>
            </div>

            {/* Multi-step form */}
            <div className="bg-white rounded-2xl shadow-medium border border-primary-100 overflow-hidden">
              {/* Form Header/Progress */}
              <div className="bg-gradient-to-r from-primary-500 to-accent-terracotta text-white p-6">
                <h3 className="text-xl font-bold mb-4">Initial Screening Questionnaire</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className={`w-8 h-8 rounded-full ${formStep >= 1 ? 'bg-white text-primary-600' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>1</div>
                    <div className="w-12 h-1 bg-white/30">
                      <div className={`h-full ${formStep >= 2 ? 'bg-white' : 'bg-transparent'}`}></div>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${formStep >= 2 ? 'bg-white text-primary-600' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>2</div>
                    <div className="w-12 h-1 bg-white/30">
                      <div className={`h-full ${formStep >= 3 ? 'bg-white' : 'bg-transparent'}`}></div>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${formStep >= 3 ? 'bg-white text-primary-600' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>3</div>
                    <div className="w-12 h-1 bg-white/30">
                      <div className={`h-full ${formStep >= 4 ? 'bg-white' : 'bg-transparent'}`}></div>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${formStep >= 4 ? 'bg-white text-primary-600' : 'bg-white/30 text-white'} flex items-center justify-center font-bold`}>4</div>
                  </div>

                  <div className="text-sm text-white/80">
                    Step {formStep} of 4
                  </div>
                </div>
              </div>

              {/* Form Body - Step 1: Applicant Details */}
              {formStep === 1 && (
                <div className="p-6 md:p-8">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-6">1. Applicant Details</h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your age"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Contact Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your contact number"
                        required
                      />
                    </div>

                    {/* Phone Verification */}
                    <div className="md:col-span-2 border-2 border-primary-100 rounded-lg p-4 bg-primary-50/30">
                      <PhoneVerification
                        phoneNumber={formData.phoneNumber}
                        onPhoneChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
                        onVerified={() => setPhoneVerified(true)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Residential Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your complete address"
                        rows="3"
                        required
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Gender</label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <label className="inline-flex items-center">
                          <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-700">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-700">Female</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-700">Other</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="gender" value="prefer_not_to_say" checked={formData.gender === 'prefer_not_to_say'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-700">Prefer not to say</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Marital Status</label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <label className="inline-flex items-center">
                          <input type="radio" name="marital-status" value="single" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-700">Single</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="marital-status" value="married" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-700">Married</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="marital-status" value="divorced" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-700">Divorced</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="marital-status" value="widowed" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-neutral-700">Widowed</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Number of Dependents</label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Occupation</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your occupation"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Monthly Household Income</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter amount in INR"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setFormStep(2)}
                      className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 flex items-center"
                    >
                      Next Step
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Form Body - Step 2: Purpose of Assistance */}
              {formStep === 2 && (
                <div className="p-6 md:p-8">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-6">2. Purpose of Assistance</h4>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Type of Assistance Needed</label>
                      <div className="grid sm:grid-cols-2 gap-3 mt-2">
                        <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                          <input type="radio" name="assistance-type" value="medical" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-3 text-neutral-700">Medical Expenses</span>
                        </label>
                        <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                          <input type="radio" name="assistance-type" value="education" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-3 text-neutral-700">Educational Support</span>
                        </label>
                        <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                          <input type="radio" name="assistance-type" value="gender_affirming" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-3 text-neutral-700">Gender-Affirming Care</span>
                        </label>
                        <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                          <input type="radio" name="assistance-type" value="mental_health" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-3 text-neutral-700">Mental Health Services</span>
                        </label>
                        <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                          <input type="radio" name="assistance-type" value="legal_aid" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-3 text-neutral-700">Legal Aid</span>
                        </label>
                        <label className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                          <input type="radio" name="assistance-type" value="other" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-3 text-neutral-700">Other (Specify below)</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">
                        Please provide a brief description of your situation and why you are seeking assistance:
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Explain your current situation and specific needs..."
                        rows="6"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">
                        Estimated amount needed (if applicable):
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter amount in INR"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setFormStep(1)}
                      className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors duration-300"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setFormStep(3)}
                      className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 flex items-center"
                    >
                      Next Step
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Form Body - Step 3: Financial Need */}
              {formStep === 3 && (
                <div className="p-6 md:p-8">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-6">3. Financial Need</h4>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Do you have any savings or assets?</label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input type="radio" name="savings" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="savings" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">No</span>
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="If yes, please specify"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Do you receive any other financial assistance or benefits?</label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input type="radio" name="other-assistance" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="other-assistance" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">No</span>
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="If yes, from whom and how much"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Do you have any outstanding loans or debts?</label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input type="radio" name="loans" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="loans" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">No</span>
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="If yes, please specify the amount and creditors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Have You ever been Convicted of a Crime?</label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input type="radio" name="criminal-record" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="criminal-record" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">No</span>
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="If yes, please specify the Nature of Crime and Details"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Have you availed any financial assistance or benefits from any other Organization, Recently Or in the Past?</label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input type="radio" name="previous-assistance" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="previous-assistance" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">No</span>
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="If yes, from whom and how much"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setFormStep(2)}
                      className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors duration-300"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setFormStep(4)}
                      className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 flex items-center"
                    >
                      Next Step
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Form Body - Step 4: Medical/Educational Info and Declaration */}
              {formStep === 4 && (
                <div className="p-6 md:p-8">
                  <div className="space-y-8"> {/* Increased spacing between major sections */}
                    {/* Medical Information Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-800 mb-4">4. Medical Information (If applying for medical assistance)</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Have you been diagnosed with a medical condition that requires treatment?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="medical-condition" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="medical-condition" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="If yes, please specify the condition"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Is the medical procedure or treatment urgent?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="treatment-urgency" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="treatment-urgency" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Do you have health insurance coverage?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="health-insurance" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="health-insurance" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">If yes, does it cover the required treatment?</label>
                            <div className="flex gap-4">
                              <label className="inline-flex items-center">
                                <input type="radio" name="insurance-coverage" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                <span className="ml-2 text-neutral-700">Yes</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input type="radio" name="insurance-coverage" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                <span className="ml-2 text-neutral-700">No</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input type="radio" name="insurance-coverage" value="partially" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                <span className="ml-2 text-neutral-700">Partially</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Are you currently under medical care?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="current-medical-care" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="current-medical-care" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="If yes, please provide the name of the hospital/clinic and doctor"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Educational Information Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-800 mb-4">5. Educational Information (If applying for educational support)</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Are you currently enrolled in an educational institution?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="education-enrollment" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="education-enrollment" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="If yes, please provide the name of the institution"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Level of Education</label>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <label className="inline-flex items-center">
                              <input type="radio" name="education-level" value="primary" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Primary</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="education-level" value="secondary" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Secondary</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="education-level" value="undergraduate" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Undergraduate</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="education-level" value="postgraduate" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Postgraduate</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="education-level" value="vocational" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Vocational</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Do you have any scholarships or financial aid?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="existing-financial-aid" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="existing-financial-aid" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="If yes, please specify the source and amount"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Field of Study/Course</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter your field of study or course name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emotional and Social Support */}
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-800 mb-4">6. Emotional and Social Support</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Do you have a support system (family, friends) to assist you during this time?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="support-system" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="support-system" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">How would you describe your emotional state regarding your current situation?</label>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <label className="inline-flex items-center">
                              <input type="radio" name="emotional-state" value="confident" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Confident</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="emotional-state" value="anxious" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Anxious</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="emotional-state" value="hopeful" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Hopeful</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="emotional-state" value="overwhelmed" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Overwhelmed</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="emotional-state" value="other" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-sm text-neutral-700">Other</span>
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="If other, please specify"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Are you willing to participate in counseling or support programs if recommended?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="counseling-willingness" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="counseling-willingness" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Understanding and Commitment */}
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-800 mb-4">7. Understanding and Commitment</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Do you understand the requirements and responsibilities involved in receiving assistance from our organization?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="understand-requirements" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="understand-requirements" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Are you willing to provide regular updates on your progress after receiving assistance?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="progress-updates" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="progress-updates" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Have you applied for assistance from our organization before?</label>
                          <div className="flex gap-4">
                            <label className="inline-flex items-center">
                              <input type="radio" name="applied-before" value="yes" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input type="radio" name="applied-before" value="no" className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                              <span className="ml-2 text-neutral-700">No</span>
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="If yes, when?"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-800 mb-4">8. Additional Information</h4>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700">Is there any other information you would like us to consider?</label>
                        <textarea
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Please provide any other relevant information..."
                          rows="4"
                        ></textarea>
                      </div>
                    </div>

                    {/* Declaration */}
                    <div className="pt-6 border-t border-neutral-200">
                      <h4 className="text-lg font-semibold text-neutral-800 mb-4">9. Declaration</h4>
                      <div className="p-4 bg-primary-50 rounded-xl mb-4">
                        <p className="text-sm text-neutral-700"> {/* Adjusted text size */}
                          I hereby declare that all the information provided in this questionnaire is true and accurate to the best of my knowledge. I understand that providing false information may result in the denial of assistance.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <input type="checkbox" id="declaration-agreement" name="declaration" checked={formData.declaration} onChange={handleInputChange} className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500" required />
                        <label htmlFor="declaration-agreement" className="text-sm text-neutral-700"> {/* Adjusted text size */}
                          I agree to the above declaration and consent to the processing of my personal information for the purpose of evaluating my application for assistance.
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setFormStep(3)}
                      className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors duration-300"
                      disabled={submitting}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      )}
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-green-900 mb-2">Application Submitted Successfully!</h4>
                    <p className="text-green-800 mb-4">
                      Thank you for submitting your support fund application. Our team will review your application and contact you within 3-5 business days.
                    </p>
                    <p className="text-sm text-green-700">
                      You will receive a confirmation email shortly with your application reference number.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900">Need Help?</h3>
                <p className="text-neutral-600">
                  Our support team is here to assist you with any questions or concerns you may have about the application process or eligibility criteria.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-800">Call Us</h4>
                      <p className="text-neutral-600">+91 82003 06871</p>
                      <p className="text-sm text-neutral-500">Monday to Friday, 10:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-800">Email Us</h4>
                      <p className="text-neutral-600">support@gazra.org</p>
                      <p className="text-sm text-neutral-500">We'll respond within 48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Have Questions?</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Your Question</label>
                    <textarea
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="How can we help you?"
                      rows="4"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GazraSupportFund;