import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors, Shirt, Music, PersonStanding, Briefcase, Award, Users, Calendar, Clock,
  CheckCircle, ArrowRight, Mail, Phone, MapPin
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { usePublicSubmission } from '../hooks/usePublicSubmission';

// --- Helper Components ---

const DynamicCourseDisplay = ({ course }) => {
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Scissors': Scissors,
      'Shirt': Shirt,
      'Music': Music,
      'PersonStanding': PersonStanding
    };
    return iconMap[iconName] || Scissors;
  };

  const IconComponent = getIconComponent(course.icon);

  return (
    <div className="space-y-8">
      <div className="heritage-paper rounded-lg shadow-lg overflow-hidden border border-neutral-300">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-accent-ochre to-accent-terracotta p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">{course.title}</h3>
                <p className="text-white/80 text-sm sm:text-base">{course.tagline}</p>
              </div>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg text-sm self-start sm:self-center flex-shrink-0">
              {course.duration}
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="p-6 border-b border-neutral-100">
          <h4 className="text-lg font-semibold text-neutral-800 mb-4">Course Overview</h4>
          <p className="text-neutral-600 mb-4">{course.overview}</p>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-medium text-neutral-800">Duration</h5>
                <p className="text-neutral-600">{course.duration}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-medium text-neutral-800">Batch Size</h5>
                <p className="text-neutral-600">{course.batchSize}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-medium text-neutral-800">Schedule</h5>
                <p className="text-neutral-600">{course.schedule}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 flex-shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-medium text-neutral-800">Placement Support</h5>
                <p className="text-neutral-600">{course.placementSupport ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Career Opportunities */}
        {(course.skills?.length > 0 || course.careerOpportunities?.length > 0) && (
          <div className="p-6">
            {course.skills?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-neutral-800 mb-4">Skills You'll Gain</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-neutral-600 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.careerOpportunities?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-neutral-800 mb-4">Career Opportunities</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.careerOpportunities.map((career, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-accent-terracotta flex-shrink-0" />
                      <span className="text-neutral-600 text-sm">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Course Curriculum */}
        {course.modules?.length > 0 && (
          <div className="p-6 border-t border-neutral-100">
            <h4 className="text-lg font-semibold text-neutral-800 mb-4">Course Curriculum</h4>
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <div key={index} className="border border-neutral-200 rounded-xl overflow-hidden">
                  <div className="bg-primary-50 px-4 py-3 flex items-center justify-between">
                    <h5 className="font-semibold text-neutral-800">{module.title}</h5>
                    {module.duration && (
                      <span className="text-sm text-neutral-500 flex-shrink-0">{module.duration}</span>
                    )}
                  </div>
                  {module.topics?.length > 0 && (
                    <div className="p-4 text-neutral-600 text-sm">
                      <ul className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructor */}
        {course.instructor && (
          <div className="p-6 border-t border-neutral-100 bg-primary-50/40">
            <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-1">Instructor</h4>
            <p className="text-neutral-800 font-medium">{course.instructor}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseSelectorTabs = ({ selectedCourse, onSelectCourse, courses }) => {
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Scissors': Scissors,
      'Shirt': Shirt,
      'Music': Music,
      'PersonStanding': PersonStanding
    };
    return iconMap[iconName] || Scissors;
  };

  const getGradient = (category) => {
    const gradientMap = {
      'beauty-parlour': 'from-accent-terracotta to-primary-500',
      'tailoring': 'from-accent-ochre to-accent-terracotta',
      'music': 'from-accent-slate to-primary-600',
      'kathak': 'from-accent-sage to-accent-ochre'
    };
    return gradientMap[category] || 'from-primary-500 to-secondary-600';
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {courses.map((course) => {
        const IconComponent = getIconComponent(course.icon);
        return (
          <button
            key={course.id}
            onClick={() => onSelectCourse(course.category)}
            className={`flex items-center gap-3 p-4 rounded-xl border w-full text-left ${selectedCourse === course.category
                ? 'bg-primary-50 border-primary-200 shadow-medium'
                : 'bg-white border-neutral-200 hover:bg-primary-50/50 hover:border-primary-100'
              } transition-all duration-200`}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getGradient(course.category)} text-white flex items-center justify-center flex-shrink-0`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-800">{course.title}</h3>
              <p className="text-xs text-neutral-500">{course.duration}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const SuccessStoryCard = ({ imageSrc, altText, title, text, graduateInfo }) => {
  return (
    <div className="relative heritage-paper rounded-lg shadow-lg overflow-hidden border border-neutral-300 hover:shadow-xl hover:border-primary-500 hover:-translate-y-2 transition-all duration-300">
      <div className="heritage-rule absolute left-0 top-0 z-10 h-1 w-full" />
      <div className="aspect-w-4 aspect-h-3"> {/* Adjusted aspect ratio */}
        <img
          src={imageSrc}
          alt={altText}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
        <p className="text-neutral-600 text-sm leading-relaxed">{text}</p> {/* Adjusted size/leading */}
        <div className="pt-2">
          <p className="text-sm text-primary-600 font-medium">{graduateInfo}</p>
        </div>
      </div>
    </div>
  );
};

const ContactForm = () => { // "Mail Component"
  return (
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
  );
};

const FAQItem = ({ question, answer }) => {
   return (
     <div className="border border-neutral-200 rounded-xl p-4 hover:border-primary-200 transition-colors duration-200">
       <h4 className="font-medium text-neutral-800 mb-2">{question}</h4>
       <p className="text-neutral-600 text-sm">
         {answer}
       </p>
     </div>
   );
};


// --- Main GazraSkills Component ---

const GazraSkills = () => {
  const [selectedCourse, setSelectedCourse] = useState('beauty-parlour'); // Default course
  const [formStep, setFormStep] = useState(1); // For multi-step form
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    address: '',
    education: '',
    gender: '',
    courseSelected: '',
    batchTiming: '',
    priorExperience: '',
    experienceDetails: '',
    employmentStatus: '',
    motivation: '',
    heardFrom: '',
    accommodations: '',
    commitment: '',
    commitmentDetails: ''
  });

  const { getDocuments: getCourses } = useFirestore('skillsCourses');
  const { submit: addEnrollment } = usePublicSubmission('skillsEnrollment');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const result = await getCourses();
    if (result.success && result.data.length > 0) {
      const activeCourses = result.data.filter(course => course.active !== false);
      setCourses(activeCourses);
      if (activeCourses.length > 0) {
        setSelectedCourse(activeCourses[0].category);
      }
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    const result = await addEnrollment({
      ...formData,
      status: 'pending',
      submittedAt: new Date().toISOString()
    });

    if (result.success) {
      setSubmitted(true);
      setFormData({
        fullName: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: '',
        address: '',
        education: '',
        gender: '',
        courseSelected: '',
        batchTiming: '',
        priorExperience: '',
        experienceDetails: '',
        employmentStatus: '',
        motivation: '',
        heardFrom: '',
        accommodations: '',
        commitment: '',
        commitmentDetails: ''
      });
      setFormStep(1);
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      alert('Error submitting application. Please try again.');
    }
    setSubmitting(false);
  };

  const renderCourseContent = () => {
    const currentCourse = courses.find(c => c.category === selectedCourse);
    
    if (!currentCourse) {
      return (
        <div className="text-center py-12">
          <p className="text-neutral-600">Course details not available</p>
        </div>
      );
    }

    return <DynamicCourseDisplay course={currentCourse} />;
  };

  const successStories = [
     {
        imageSrc: "/images/image8.webp",
        altText: "Beauty Parlour graduate success story",
        title: "Ananya's Journey",
        text: "After completing the Beauty Parlour course, I started my own small business doing bridal makeup and hairstyling. The skills I learned at MCSU helped me build a client base and achieve financial independence.",
        graduateInfo: "Beauty Parlour Course Graduate"
     },
      {
        imageSrc: "/images/image9.webp",
        altText: "Tailoring graduate success story",
        title: "Rahul's Story",
        text: "The tailoring training opened doors I never thought possible. With loan assistance for a sewing machine after the course, I set up a home-based stitching business within a year.",
        graduateInfo: "Tailoring Course Graduate"
     },
      {
        imageSrc: "/images/image10.webp",
        altText: "Kathak dance graduate success story",
        title: "Maya's Success",
        text: "Learning Kathak gave me a deep connection to our traditional art form. I now teach dance classes of my own and perform at community events across Vadodara.",
        graduateInfo: "Kathak Dance Course Graduate"
     }
  ];

  const faqs = [
    { question: "Is financial assistance available for courses?", answer: "Yes, we offer financial assistance based on need through the Gazra Support Fund. We ensure economic barriers don't prevent dedicated individuals from accessing our skills training." },
    { question: "Do I need prior experience to join a course?", answer: "No prior experience is required. Our courses are designed for beginners and provide comprehensive foundational training. Your enthusiasm and commitment are what matter most." },
    { question: "Will I receive a certificate upon completion?", answer: "Yes, all graduates receive a certificate recognized by our industry partners. Additionally, we provide ongoing support with job placement and starting your own venture." },
    { question: "What is the selection process like?", answer: "After reviewing applications, shortlisted candidates are invited for a brief interview to discuss their goals and commitment. Our selection prioritizes motivation and need rather than prior qualifications." }
  ];


  return (
    <div className="min-h-screen bg-[var(--gazra-paper)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-950 min-h-[70vh] flex items-center">
        <video src="/video/skill.mp4" autoPlay loop muted playsInline
               preload="metadata" poster="/images/skill1.webp"
               className="absolute inset-0 w-full h-full object-contain" />
        {/* Darkening scrim — video alone isn't reliably dark enough for white text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
                      className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/40
                            bg-[rgba(251,244,231,0.88)] text-xs font-bold uppercase tracking-wide
                            text-accent-terracotta shadow-lg backdrop-blur-md">
              <Award className="w-3.5 h-3.5" />
              Gazra Skills Development
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white
                           drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              Empowering
              <span className="block text-primary-300">Through Practical</span>
              Skills Training
            </h1>

            <p className="text-primary-100/80 text-lg leading-relaxed max-w-lg">
              Develop marketable skills and build a sustainable livelihood with our industry-focused
              training programs designed for economic independence and professional growth.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#courses"
                 className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white
                            font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-200">
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#apply"
                 className="inline-flex items-center gap-2 border-2 border-primary-100/60
                            bg-neutral-950/20 hover:bg-primary-600 text-primary-50 hover:text-white
                            font-semibold px-6 py-3 rounded-lg backdrop-blur-md transition-all duration-200">
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
              Training That Transforms Lives
            </h2>
            <p className="text-lg text-neutral-600">
              We focus on practical, in-demand skills that open doors to employment and entrepreneurship.
              Our inclusive approach ensures that everyone has access to quality training regardless of their background.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-[var(--gazra-paper)] border border-[rgba(184,121,44,0.18)] rounded-lg p-6 hover:shadow-lg hover:border-primary-300/50 transition-all duration-300">
              <div className="w-12 h-12 rounded bg-primary-600 flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="h-[2px] w-0 group-hover:w-full mb-4 transition-all duration-500 rounded"
                   style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45)' }} />
              <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">Inclusive Learning</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Our programs are designed to be accessible to everyone, with special focus on creating supportive
                learning environments for the LGBTQIA+ community and women facing barriers to employment.
              </p>
            </div>
            <div className="group bg-[var(--gazra-paper)] border border-[rgba(184,121,44,0.18)] rounded-lg p-6 hover:shadow-lg hover:border-primary-300/50 transition-all duration-300">
              <div className="w-12 h-12 rounded bg-secondary-600 flex items-center justify-center mb-5">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="h-[2px] w-0 group-hover:w-full mb-4 transition-all duration-500 rounded"
                   style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45)' }} />
              <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">Industry Partnerships</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                We collaborate with businesses and industry experts to ensure our curriculum meets current market
                needs, creating pathways to employment for our graduates through our network of partners.
              </p>
            </div>
            <div className="group bg-[var(--gazra-paper)] border border-[rgba(184,121,44,0.18)] rounded-lg p-6 hover:shadow-lg hover:border-primary-300/50 transition-all duration-300">
              <div className="w-12 h-12 rounded bg-accent-terracotta flex items-center justify-center mb-5">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="h-[2px] w-0 group-hover:w-full mb-4 transition-all duration-500 rounded"
                   style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45)' }} />
              <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">Holistic Support</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Beyond technical skills, we provide mentorship, confidence-building, and ongoing support
                to help our students succeed professionally and personally in their chosen paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              Our Programs
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
              Skills Development Courses
            </h2>
            <p className="text-lg text-neutral-600">
              Select a program below to explore the curriculum and details. Our courses are designed to provide
              practical, market-relevant skills that lead to meaningful employment opportunities.
            </p>
          </div>

          {/* Course Selection Tabs */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading courses...</p>
            </div>
          ) : (
            <CourseSelectorTabs selectedCourse={selectedCourse} onSelectCourse={setSelectedCourse} courses={courses} />
          )}

          {/* Selected Course Content */}
          <div className="mt-12">
             {!loading && renderCourseContent()}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
              Transforming Lives Through Skills
            </h2>
            <p className="text-lg text-neutral-600">
              Meet some of our graduates who have successfully used their new skills to build careers and businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
                <SuccessStoryCard
                    key={index}
                    imageSrc={story.imageSrc}
                    altText={story.altText}
                    title={story.title}
                    text={story.text}
                    graduateInfo={story.graduateInfo}
                />
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-20 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
                Join Our Programs
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
                Apply for Skills Training
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Take the first step toward building a sustainable livelihood by applying to one of our skills development programs.
              </p>
            </div>

            {/* Multi-step form */}
            <div className="bg-white rounded-2xl shadow-medium border border-primary-100 overflow-hidden">
              {/* Form Header/Progress */}
              <div className="bg-gradient-to-r from-primary-500 to-accent-terracotta text-white p-6">
                <h3 className="text-xl font-bold mb-4">Course Application Form</h3>
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
                  </div>

                  <div className="text-sm text-white/80">
                    Step {formStep} of 3
                  </div>
                </div>
              </div>

              {/* Form Body - Step 1: Personal Information */}
              {formStep === 1 && (
                <div className="p-6 md:p-8">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-6">1. Personal Information</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Input fields for Name, DOB, Email, Phone, Address, Education, Gender */}
                      <div className="space-y-2">
                         <label className="block text-sm font-medium text-neutral-700">Full Name *</label>
                         <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your full name" required />
                      </div>
                       <div className="space-y-2">
                         <label className="block text-sm font-medium text-neutral-700">Date of Birth</label>
                         <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                      </div>
                       <div className="space-y-2">
                          <label className="block text-sm font-medium text-neutral-700">Email Address *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your email address" required />
                       </div>
                        <div className="space-y-2">
                           <label className="block text-sm font-medium text-neutral-700">Phone Number *</label>
                           <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your phone number" required />
                        </div>
                         <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-neutral-700">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your complete address" rows="3" ></textarea>
                         </div>
                          <div className="space-y-2">
                             <label className="block text-sm font-medium text-neutral-700">Highest Education Level</label>
                             <select name="education" value={formData.education} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                 <option value="">Select education level</option>
                                 <option value="primary">Primary</option>
                                 <option value="secondary">Secondary</option>
                                 <option value="higher-secondary">Higher Secondary</option>
                                 <option value="graduate">Graduate</option>
                                 <option value="post-graduate">Post Graduate</option>
                                 <option value="other">Other</option>
                             </select>
                          </div>
                           <div className="space-y-2">
                             <label className="block text-sm font-medium text-neutral-700">Gender</label>
                             <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="transgender">Transgender</option>
                                <option value="non-binary">Non-Binary</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                                <option value="other">Other</option>
                             </select>
                           </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setFormStep(2)}
                      className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 flex items-center"
                    >
                      Next Step <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Form Body - Step 2: Course Selection */}
              {formStep === 2 && (
                 <div className="p-6 md:p-8">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-6">2. Course Selection & Background</h4>
                    <div className="space-y-6">
                       {/* Course selection radio buttons, batch timing, prior experience, employment status */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-700">Which course are you interested in? *</label>
                            <div className="grid sm:grid-cols-2 gap-3 mt-2">
                                {courses.map(course => (
                                  <label key={course.id} className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                                    <input type="radio" name="courseSelected" value={course.title} checked={formData.courseSelected === course.title} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" required />
                                    <div className="ml-3">
                                      <div className="font-medium text-neutral-800">{course.title}</div>
                                      <div className="text-xs text-neutral-500">{course.duration}</div>
                                    </div>
                                  </label>
                                ))}
                            </div>
                        </div>
                         <div className="space-y-2">
                             <label className="block text-sm font-medium text-neutral-700">Preferred batch timing</label>
                             <div className="flex flex-wrap gap-4 mt-2">
                                  <label className="inline-flex items-center">
                                    <input type="radio" name="batchTiming" value="morning" checked={formData.batchTiming === 'morning'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                    <span className="ml-2 text-sm text-neutral-700">Morning (9 AM - 12 PM)</span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input type="radio" name="batchTiming" value="afternoon" checked={formData.batchTiming === 'afternoon'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                    <span className="ml-2 text-sm text-neutral-700">Afternoon (2 PM - 5 PM)</span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input type="radio" name="batchTiming" value="weekend" checked={formData.batchTiming === 'weekend'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                    <span className="ml-2 text-sm text-neutral-700">Weekend</span>
                                  </label>
                             </div>
                         </div>
                          <div className="space-y-2">
                              <label className="block text-sm font-medium text-neutral-700">Do you have any prior experience in the selected field?</label>
                              <div className="flex gap-4">
                                  <label className="inline-flex items-center">
                                    <input type="radio" name="priorExperience" value="yes" checked={formData.priorExperience === 'yes'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                    <span className="ml-2 text-sm text-neutral-700">Yes</span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input type="radio" name="priorExperience" value="no" checked={formData.priorExperience === 'no'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                    <span className="ml-2 text-sm text-neutral-700">No</span>
                                  </label>
                              </div>
                              <div className="mt-2">
                                <textarea name="experienceDetails" value={formData.experienceDetails} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="If yes, please describe..." rows="3"></textarea>
                              </div>
                          </div>
                           <div className="space-y-2">
                               <label className="block text-sm font-medium text-neutral-700">Current employment status</label>
                               <select name="employmentStatus" value={formData.employmentStatus} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                   <option value="">Select status</option>
                                   <option value="unemployed">Unemployed</option>
                                   <option value="employed-part-time">Employed (Part-time)</option>
                                   <option value="employed-full-time">Employed (Full-time)</option>
                                   <option value="self-employed">Self-employed</option>
                                   <option value="student">Student</option>
                                   <option value="other">Other</option>
                               </select>
                           </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                       <button onClick={() => setFormStep(1)} className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors duration-300"> Previous </button>
                       <button onClick={() => setFormStep(3)} className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 flex items-center"> Next Step <ArrowRight className="ml-2 w-4 h-4" /> </button>
                    </div>
                 </div>
              )}

              {/* Form Body - Step 3: Motivation & Commitment */}
              {formStep === 3 && (
                 <div className="p-6 md:p-8">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-6">3. Motivation & Commitment</h4>
                    <div className="space-y-6">
                       {/* Motivation textarea, How did you hear select, Accommodations textarea, Commitment radio, Declaration checkbox */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-700">Why are you interested in this course? What are your goals? *</label>
                            <textarea name="motivation" value={formData.motivation} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Tell us about your motivation..." rows="5" required></textarea>
                        </div>
                         <div className="space-y-2">
                           <label className="block text-sm font-medium text-neutral-700">How did you hear about Gazra Skills?</label>
                           <select name="heardFrom" value={formData.heardFrom} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                               <option value="">Select an option</option>
                               <option value="social-media">Social Media</option>
                               <option value="website">Website</option>
                               <option value="friend">Friend/Family</option>
                               <option value="community">Community Event</option>
                               <option value="newspaper">Newspaper</option>
                               <option value="other">Other</option>
                           </select>
                         </div>
                          <div className="space-y-2">
                             <label className="block text-sm font-medium text-neutral-700">Do you have any specific needs or accommodations we should be aware of?</label>
                             <textarea name="accommodations" value={formData.accommodations} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Please share any accessibility needs..." rows="3"></textarea>
                          </div>
                           <div className="space-y-2">
                               <label className="block text-sm font-medium text-neutral-700">Are you able to commit to the full duration of the program?</label>
                               <div className="flex gap-4">
                                 <label className="inline-flex items-center">
                                   <input type="radio" name="commitment" value="yes" checked={formData.commitment === 'yes'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                   <span className="ml-2 text-sm text-neutral-700">Yes</span>
                                 </label>
                                 <label className="inline-flex items-center">
                                   <input type="radio" name="commitment" value="no" checked={formData.commitment === 'no'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                   <span className="ml-2 text-sm text-neutral-700">No</span>
                                 </label>
                                 <label className="inline-flex items-center">
                                   <input type="radio" name="commitment" value="unsure" checked={formData.commitment === 'unsure'} onChange={handleInputChange} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                   <span className="ml-2 text-sm text-neutral-700">Not Sure</span>
                                 </label>
                               </div>
                               <div className="mt-2">
                                 <input type="text" name="commitmentDetails" value={formData.commitmentDetails} onChange={handleInputChange} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="If no or not sure, please explain" />
                               </div>
                           </div>
                    </div>
                    {submitted && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <h4 className="text-lg font-bold text-green-900">Application Submitted Successfully!</h4>
                            <p className="text-green-800">Thank you for your application. We will review it and contact you soon.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div className="mt-8 flex justify-between">
                       <button onClick={() => setFormStep(2)} className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors duration-300"> Previous </button>
                       <button onClick={handleFormSubmit} disabled={submitting} className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50 flex items-center gap-2">
                         {submitting && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
                         {submitting ? 'Submitting...' : 'Submit Application'}
                       </button>
                    </div>
                 </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & FAQ Section */}
      <section className="py-16 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900">Have Questions?</h3>
                <p className="text-neutral-600">
                  Reach out to our team for more information about our skills development programs,
                  application process, or any other inquiries.
                </p>
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary-100 text-primary-600"> <Phone className="w-5 h-5" /> </div>
                      <div> <h4 className="font-medium text-neutral-800">Call Us</h4> <p className="text-neutral-600">+91 82003 06871</p> <p className="text-sm text-neutral-500">Mon-Fri, 10 AM - 5 PM</p> </div>
                   </div>
                    <div className="flex items-start gap-3">
                       <div className="p-2 rounded-full bg-primary-100 text-primary-600"> <Mail className="w-5 h-5" /> </div>
                       <div> <h4 className="font-medium text-neutral-800">Email Us</h4> <p className="text-neutral-600">skills@gazra.org</p> <p className="text-sm text-neutral-500">Response within 48 hours</p> </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary-100 text-primary-600"> <MapPin className="w-5 h-5" /> </div>
                        <div> <h4 className="font-medium text-neutral-800">Visit Us</h4> <p className="text-neutral-600">Gazra Cafe, Shri Maharani Chimnabai Stree Udyogalaya, Vadodara</p> <p className="text-sm text-neutral-500">Drop in for a conversation</p> </div>
                     </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                     <FAQItem key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-500 to-accent-terracotta rounded-3xl shadow-medium overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12 text-white">
                  <h2 className="text-3xl font-display font-bold mb-4">Ready to Transform Your Future?</h2>
                  <p className="text-white/80 mb-6">
                    Take the first step toward a sustainable livelihood by applying to one of our skills development programs.
                    Empower yourself with market-relevant skills and join our community of successful graduates.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="#apply"
                      className="px-6 py-3 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-colors duration-300 font-medium inline-flex items-center"
                    >
                      Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="#courses"
                      className="px-6 py-3 bg-white/20 text-white border border-white/40 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors duration-300 inline-flex items-center"
                    >
                      Explore Courses
                    </motion.a>
                  </div>
                </div>
                <div className="hidden md:block h-full">
                  <video
                    src="/video/skill.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/images/skill1.webp"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GazraSkills;
