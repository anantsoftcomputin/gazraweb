import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import InitiativesPage from './pages/Initiatives';
import GazraCafe from './pages/GazraCafe';
import EventsPage from './pages/Events';
import EventDetail from './pages/EventDetail';
import VolunteerPage from './pages/Volunteer';
import Gallery from './pages/Gallery';
import ContactPage from './pages/Contact';
import MenuCard from './components/shared/MenuCard';
import EventCalendarPage from './pages/EventCalendarPage';
import GazraSupportFund from './pages/GazraSupportFung';
import GazraSkills from './pages/GazraSkills';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminCafe from './pages/admin/AdminCafe';
import AdminCafeFeatures from './pages/admin/AdminCafeFeatures';
import AdminCafeTestimonials from './pages/admin/AdminCafeTestimonials';
import AdminCafeSettings from './pages/admin/AdminCafeSettings';
import AdminCafeMoments from './pages/admin/AdminCafeMoments';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminSupportRequests from './pages/admin/AdminSupportRequests';
import AdminGallery from './pages/admin/AdminGallery';
import AdminInitiatives from './pages/admin/AdminInitiatives';
import AdminSkillsCourses from './pages/admin/AdminSkillsCourses';
import AdminSkillsEnrollments from './pages/admin/AdminSkillsEnrollments';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/initiatives" element={<MainLayout><InitiativesPage /></MainLayout>} />
        <Route path="/cafe" element={<MainLayout><GazraCafe /></MainLayout>} />
        <Route path="/events" element={<MainLayout><EventsPage /></MainLayout>} />
        <Route path="/events/:id" element={<MainLayout><EventDetail /></MainLayout>} />
        <Route path="/volunteer" element={<MainLayout><VolunteerPage /></MainLayout>} />
        <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/Menu" element={<MainLayout><MenuCard /></MainLayout>} />
        <Route path="/calendar" element={<MainLayout><EventCalendarPage /></MainLayout>} />
        <Route path="/gazra-support" element={<MainLayout><GazraSupportFund /></MainLayout>} />
        <Route path="/gazra-skills" element={<MainLayout><GazraSkills /></MainLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        
        {/* Cafe Management Routes */}
        <Route path="/admin/cafe/menu" element={<AdminCafe />} />
        <Route path="/admin/cafe/features" element={<AdminCafeFeatures />} />
        <Route path="/admin/cafe/testimonials" element={<AdminCafeTestimonials />} />
        <Route path="/admin/cafe/settings" element={<AdminCafeSettings />} />
        <Route path="/admin/cafe/moments" element={<AdminCafeMoments />} />
        
        {/* Other Admin Routes */}
        <Route path="/admin/volunteers" element={<AdminVolunteers />} />
        <Route path="/admin/support-requests" element={<AdminSupportRequests />} />
        <Route path="/admin/newsletter" element={<AdminNewsletter />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/initiatives" element={<AdminInitiatives />} />
        <Route path="/admin/skills/courses" element={<AdminSkillsCourses />} />
        <Route path="/admin/skills/enrollments" element={<AdminSkillsEnrollments />} />
      </Routes>
    </Router>
  );
}

export default App;