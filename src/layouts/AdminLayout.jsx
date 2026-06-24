/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from '../lib/routerCompat';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, Coffee,
  Image, MessageSquare, LogOut, Menu, X,
  Heart, Mail, BookOpen, ChevronDown, Star, Clock, GraduationCap, CalendarCheck, Home, MapPinned, QrCode, FileText, LifeBuoy, LoaderCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cafeMenuOpen, setCafeMenuOpen] = useState(false);
  const [skillsMenuOpen, setSkillsMenuOpen] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeLoadingLabel, setRouteLoadingLabel] = useState('Loading page');
  const { logout, monitorAuthState, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = monitorAuthState(async (user) => {
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (!adminDoc.exists()) {
        await logout();
        navigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-expand cafe menu if on a cafe route
  useEffect(() => {
    if (location.pathname.startsWith('/admin/cafe')) {
      setCafeMenuOpen(true);
    }
    if (location.pathname.startsWith('/admin/skills')) {
      setSkillsMenuOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    setRouteLoading(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!routeLoading) return undefined;
    const timeout = window.setTimeout(() => setRouteLoading(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [routeLoading]);

  const navigateWithLoader = (path, label = 'page', closeMobileMenu = false) => {
    if (path !== location.pathname) {
      setRouteLoadingLabel(label);
      setRouteLoading(true);
    }
    navigate(path);
    if (closeMobileMenu) {
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: MapPinned, label: 'Event Locations', path: '/admin/events/locations' },
    { icon: QrCode, label: 'Event Check-In', path: '/admin/events/check-in' },
    { icon: Users, label: 'Volunteers', path: '/admin/volunteers' },
    { icon: Heart, label: 'Support Requests', path: '/admin/support-requests' },
    { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: MessageSquare, label: 'Contact Messages', path: '/admin/messages' },
    { icon: Image, label: 'Gallery', path: '/admin/gallery' },
    { icon: BookOpen, label: 'Initiatives', path: '/admin/initiatives' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: LifeBuoy, label: 'Resources', path: '/admin/resources' },
  ];

  const cafeMenuItems = [
    { icon: Coffee, label: 'Menu Items', path: '/admin/cafe/menu' },
    { icon: Star, label: 'Features', path: '/admin/cafe/features' },
    { icon: MessageSquare, label: 'Testimonials', path: '/admin/cafe/testimonials' },
    { icon: Image, label: 'Moments', path: '/admin/cafe/moments' },
    { icon: CalendarCheck, label: 'Bookings', path: '/admin/cafe/bookings' },
    { icon: Calendar, label: 'Closed Dates', path: '/admin/cafe/closed-dates' },
    { icon: Clock, label: 'Settings', path: '/admin/cafe/settings' },
  ];

  const skillsMenuItems = [
    { icon: BookOpen, label: 'Courses', path: '/admin/skills/courses' },
    { icon: Users, label: 'Enrollments', path: '/admin/skills/enrollments' },
  ];

  const navButtonClass = (active = false) => (
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left border ${
      active
        ? 'bg-primary-600 text-white border-primary-700 shadow-sm'
        : 'text-neutral-700 border-transparent hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200'
    }`
  );

  const subNavButtonClass = (active = false) => (
    `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left text-sm border ${
      active
        ? 'bg-primary-100 text-primary-800 border-primary-200 font-semibold'
        : 'text-neutral-600 border-transparent hover:bg-primary-50 hover:text-primary-700 hover:border-primary-100'
    }`
  );

  return (
    <div className="admin-heritage min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } heritage-paper border-r-2 border-[rgba(184,121,44,0.45)] fixed h-full transition-all duration-300 hidden lg:block z-30 shadow-xl`}
      >
        <div className="heritage-rule h-1.5 w-full" />
        <div className="p-4 border-b border-[rgba(184,121,44,0.22)] flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Gazra" className="h-10 w-auto" />
              <div>
                <span className="block font-display text-lg font-black text-neutral-900">Gazra</span>
                <span className="block text-[11px] font-bold uppercase tracking-wide text-primary-700">Admin</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 rounded-lg border border-transparent hover:border-primary-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pt-4">
          <button
            onClick={() => navigateWithLoader('/', 'website')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/70 border border-[rgba(184,121,44,0.22)] hover:bg-primary-50 hover:text-primary-700 transition-colors text-left shadow-sm"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">View Website</span>}
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigateWithLoader(item.path, item.label)}
              className={navButtonClass(location.pathname === item.path)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}

          {/* Cafe Management Section */}
          <div className="pt-2">
            <button
              onClick={() => setCafeMenuOpen(!cafeMenuOpen)}
              className={navButtonClass(location.pathname.startsWith('/admin/cafe'))}
            >
              <Coffee className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium flex-1">Cafe Management</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${cafeMenuOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            <AnimatePresence>
              {cafeMenuOpen && sidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden ml-4 mt-1 space-y-1"
                >
                  {cafeMenuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigateWithLoader(item.path, item.label)}
                      className={subNavButtonClass(location.pathname === item.path)}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skills Management Section */}
          <div className="pt-2">
            <button
              onClick={() => setSkillsMenuOpen(!skillsMenuOpen)}
              className={navButtonClass(location.pathname.startsWith('/admin/skills'))}
            >
              <GraduationCap className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium flex-1">Skills Management</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${skillsMenuOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            <AnimatePresence>
              {skillsMenuOpen && sidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden ml-4 mt-1 space-y-1"
                >
                  {skillsMenuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigateWithLoader(item.path, item.label)}
                      className={subNavButtonClass(location.pathname === item.path)}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-[rgba(184,121,44,0.22)] bg-[rgba(251,244,231,0.88)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="heritage-paper w-72 h-full border-r-2 border-[rgba(184,121,44,0.55)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="heritage-rule h-1.5 w-full" />
            <div className="p-4 border-b border-[rgba(184,121,44,0.22)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="Gazra" className="h-10 w-auto" />
                <div>
                  <span className="block font-display text-lg font-black text-neutral-900">Gazra</span>
                  <span className="block text-[11px] font-bold uppercase tracking-wide text-primary-700">Admin</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
              <button
                onClick={() => {
                  navigateWithLoader('/', 'website', true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/70 border border-[rgba(184,121,44,0.22)] hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">View Website</span>
              </button>

              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigateWithLoader(item.path, item.label, true);
                  }}
                  className={navButtonClass(location.pathname === item.path)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}

              {/* Cafe Management Section */}
              <div className="pt-2">
                <button
                  onClick={() => setCafeMenuOpen(!cafeMenuOpen)}
                  className={navButtonClass(location.pathname.startsWith('/admin/cafe'))}
                >
                  <Coffee className="w-5 h-5" />
                  <span className="text-sm font-medium flex-1">Cafe Management</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${cafeMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {cafeMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-4 mt-1 space-y-1"
                    >
                      {cafeMenuItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigateWithLoader(item.path, item.label, true);
                          }}
                          className={subNavButtonClass(location.pathname === item.path)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </nav>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="heritage-paper border-b-2 border-[rgba(184,121,44,0.35)] flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="absolute inset-x-0 bottom-0 gazra-toran-stripe" />
          <div className="relative flex w-full items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 rounded-lg border border-transparent hover:border-primary-200"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-800">{user?.email}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shadow-sm border border-primary-700">
              {user?.email?.[0].toUpperCase()}
            </div>
          </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative p-4 sm:p-6">
          <AnimatePresence>
            {routeLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/35 px-4 backdrop-blur-sm"
                aria-live="polite"
                aria-busy="true"
              >
                <motion.div
                  initial={{ scale: 0.96, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 8 }}
                  className="heritage-paper relative w-full max-w-sm overflow-hidden rounded-lg border border-[rgba(184,121,44,0.45)] p-6 text-center shadow-2xl"
                >
                  <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
                  <LoaderCircle className="mx-auto mb-4 h-10 w-10 animate-spin text-primary-600" />
                  <h2 className="font-display text-xl font-black text-neutral-900">Loading {routeLoadingLabel}</h2>
                  <p className="mt-2 text-sm text-neutral-600">The required page is loading. Please wait.</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
