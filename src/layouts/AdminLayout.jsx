import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, Coffee, FileText,
  Image, MessageSquare, Settings, LogOut, Menu, X,
  TrendingUp, Heart, Mail, BookOpen, ChevronDown, Star, Clock, GraduationCap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cafeMenuOpen, setCafeMenuOpen] = useState(false);
  const [skillsMenuOpen, setSkillsMenuOpen] = useState(false);
  const { logout, monitorAuthState, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = monitorAuthState((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Auto-expand cafe menu if on a cafe route
  useEffect(() => {
    if (location.pathname.startsWith('/admin/cafe')) {
      setCafeMenuOpen(true);
    }
    if (location.pathname.startsWith('/admin/skills')) {
      setSkillsMenuOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: Users, label: 'Volunteers', path: '/admin/volunteers' },
    { icon: Heart, label: 'Support Requests', path: '/admin/support-requests' },
    { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: MessageSquare, label: 'Contact Messages', path: '/admin/messages' },
    { icon: Image, label: 'Gallery', path: '/admin/gallery' },
    { icon: BookOpen, label: 'Initiatives', path: '/admin/initiatives' },
  ];

  const cafeMenuItems = [
    { icon: Coffee, label: 'Menu Items', path: '/admin/cafe/menu' },
    { icon: Star, label: 'Features', path: '/admin/cafe/features' },
    { icon: MessageSquare, label: 'Testimonials', path: '/admin/cafe/testimonials' },
    { icon: Image, label: 'Moments', path: '/admin/cafe/moments' },
    { icon: Clock, label: 'Settings', path: '/admin/cafe/settings' },
  ];

  const skillsMenuItems = [
    { icon: BookOpen, label: 'Courses', path: '/admin/skills/courses' },
    { icon: Users, label: 'Enrollments', path: '/admin/skills/enrollments' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 fixed h-full transition-all duration-300 hidden lg:block z-30`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img src="https://gazra.org/logo.png" alt="Gazra" className="h-10 w-auto" />
              <span className="font-bold text-neutral-800">Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left ${
                location.pathname === item.path ? 'bg-primary-50 text-primary-600' : ''
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}

          {/* Cafe Management Section */}
          <div className="pt-2">
            <button
              onClick={() => setCafeMenuOpen(!cafeMenuOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left ${
                location.pathname.startsWith('/admin/cafe') ? 'bg-primary-50 text-primary-600' : ''
              }`}
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
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left text-sm ${
                        location.pathname === item.path ? 'bg-primary-100 text-primary-700 font-medium' : ''
                      }`}
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left ${
                location.pathname.startsWith('/admin/skills') ? 'bg-primary-50 text-primary-600' : ''
              }`}
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
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left text-sm ${
                        location.pathname === item.path ? 'bg-primary-100 text-primary-700 font-medium' : ''
                      }`}
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

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
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
            className="w-64 h-full bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://gazra.org/logo.png" alt="Gazra" className="h-10 w-auto" />
                <span className="font-bold text-neutral-800">Admin</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                    location.pathname === item.path ? 'bg-primary-50 text-primary-600' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}

              {/* Cafe Management Section */}
              <div className="pt-2">
                <button
                  onClick={() => setCafeMenuOpen(!cafeMenuOpen)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                    location.pathname.startsWith('/admin/cafe') ? 'bg-primary-50 text-primary-600' : ''
                  }`}
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
                            navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left text-sm ${
                            location.pathname === item.path ? 'bg-primary-100 text-primary-700 font-medium' : ''
                          }`}
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
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
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-800">{user?.email}</p>
              <p className="text-xs text-neutral-500">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
