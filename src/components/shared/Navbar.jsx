import { useState } from 'react';
import { Link, useLocation } from '../../lib/routerCompat';
import { Menu, X, ChevronDown, Home, Info, Calendar, MapPin, Heart, Coffee, BookOpen, Utensils, Camera, Phone, CalendarCheck, Shield, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import ToranBorder from './ToranBorder';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const location = useLocation();

  // Main navigation items
  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { 
      name: 'Our Programs', 
      path: null,
      icon: BookOpen,
      submenu: [
        { name: 'Gazra Mitra', path: 'https://mitra.gazra.org', isExternal: true },
        { name: 'Gazra Support Fund', path: '/gazra-support' },
        { name: 'Gazra Cafe', path: '/cafe' },
        { name: 'Gazra Skill Hub', path: '/gazra-skills' }
      ]
    },
    // { name: 'Initiatives', path: '/initiatives', icon: Heart },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Volunteer', path: '/volunteer', icon: Heart },
    { name: 'Contact', path: '/contact', icon: MapPin }
  ];

  // Social media links
  const socialLinks = [
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/chimnabaiudyogalaya/?profile_tab_item_selected=about&_rdr',
      icon: FaFacebook
    },
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/chimnabai_udyogalaya/?hl=en',
      icon: FaInstagram
    },
    { 
      name: 'Google', 
      url: 'https://g.co/kgs/uX2R5uP',
      icon: FcGoogle
    }
  ];

  const isActivePath = (path) => {
    if (!path) return false;
    if (location.pathname === path) return true;
    // Check if any submenu item is active
    if (path === null && dropdownOpen) {
      const activeItem = navigationItems.find(item => item.name === dropdownOpen);
      if (activeItem && activeItem.submenu) {
        return activeItem.submenu.some(subItem => location.pathname === subItem.path);
      }
    }
    return false;
  };

  const toggleDropdown = (name) => {
    if (dropdownOpen === name) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(name);
    }
  };

  // Mobile navigation items (simplified for bottom nav)
  const mobileNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Initiatives', path: null, icon: BookOpen, isDropdown: true },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Contact', path: '/contact', icon: MapPin }
  ];

  // Cafe-specific mobile navigation items
  const cafeNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Menu', path: '/cafe', scrollTo: 'menu', icon: Utensils },
    { name: 'Moments', path: '/cafe', scrollTo: 'moments', icon: Camera },
    { name: 'Contact', path: '/contact', icon: Phone },
    { name: 'Book Table', action: 'openBooking', icon: CalendarCheck }
  ];

  // Determine which nav items to show
  const currentNavItems = location.pathname === '/cafe' ? cafeNavItems : mobileNavItems;

  // Handle scroll to section for cafe nav or open booking
  const handleCafeNavClick = (item) => {
    if (item.action === 'openBooking') {
      // Trigger floating booking form
      const event = new CustomEvent('openBookingForm');
      window.dispatchEvent(event);
    } else if (item.scrollTo && location.pathname === '/cafe') {
      setTimeout(() => {
        const element = document.getElementById(item.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-primary-800/10 bg-[rgba(251,244,231,0.50)] shadow-[0_10px_30px_rgba(45,33,20,0.10)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(251,244,231,0.42)]">
        {/* Top Bar */}
        <div className="bg-primary-900/70 text-white py-1.5 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Mail size={14} />
                  <span className="hidden sm:inline">info@mcsu.in</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  <span className="hidden sm:inline">82003 06871</span>
                </span>
              </div>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary-200 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
                <span className="hidden md:inline text-primary-200">|</span>
                <Link 
                  to="/become-a-partner"
                  className="hidden md:inline text-white hover:text-primary-200 transition-colors duration-300"
                >
                  Contribute to a Cause
                </Link>
                <Link
                  to="/admin/login"
                  className="hidden md:inline text-white hover:text-primary-200 transition-colors duration-300"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="border-b border-primary-800/10 bg-[rgba(251,244,231,0.46)] backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo with image */}
              <Link to="/" className="flex items-center">
                <img 
                  src="https://gazra.org/logo.png" 
                  alt="Gazra Logo" 
                  className="h-11 w-auto mr-2"
                />
                <span className="text-2xl font-bold text-primary-700">Project Gazra</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center">
                {navigationItems.map((item, index) => (
                  item.submenu ? (
                    <div key={index} className="relative group" onMouseLeave={() => setDropdownOpen(null)}>
                      <button
                        className={`px-5 py-2 text-sm font-medium transition-all duration-300 relative flex items-center
                          ${dropdownOpen === item.name
                            ? 'text-primary-600'
                            : 'text-neutral-600 hover:text-primary-600'
                          }
                        `}
                        onClick={() => toggleDropdown(item.name)}
                        onMouseEnter={() => setDropdownOpen(item.name)}
                      >
                        {item.name}
                        <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${dropdownOpen === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {dropdownOpen === item.name && (
                        <div className="heritage-paper absolute left-0 mt-0 w-56 rounded-lg shadow-medium border border-primary-800/10 py-2 z-20 backdrop-blur-xl">
                          {item.submenu.map((subItem, subIndex) => (
                            subItem.isExternal ? (
                              <a
                                key={subIndex}
                                href={subItem.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                              >
                                {subItem.name} ↗
                              </a>
                            ) : (
                              <Link
                                key={subIndex}
                                to={subItem.path}
                                className={`block px-4 py-2 text-sm hover:bg-primary-50
                                  ${location.pathname === subItem.path
                                    ? 'text-primary-600 bg-primary-50'
                                    : 'text-neutral-700 hover:text-primary-600'
                                  }
                                `}
                                onClick={() => setDropdownOpen(null)}
                              >
                                {subItem.name}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link 
                      key={index} 
                      to={item.path} 
                      className={`px-5 py-2 text-sm font-medium transition-all duration-300 relative
                        ${isActivePath(item.path)
                          ? 'text-primary-600'
                          : 'text-neutral-600 hover:text-primary-600'
                        }
                        before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5
                        before:bg-primary-600 before:transform before:scale-x-0
                        before:transition-transform before:duration-300
                        ${isActivePath(item.path) ? 'before:scale-x-100' : 'hover:before:scale-x-100'}
                      `}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>

              {/* Mobile Menu Button - Only visible on medium screens, hidden on small screens where bottom nav is used */}
              <div className="lg:hidden md:flex hidden items-center gap-2">
                <Link
                  to="/admin/login"
                  className="p-2 rounded-lg hover:bg-primary-100/70 transition-colors duration-300 text-neutral-700"
                  aria-label="Admin login"
                >
                  <Shield size={22} />
                </Link>
                <button 
                  className="p-2 rounded-lg hover:bg-primary-100/70 transition-colors duration-300 text-neutral-700"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
          <ToranBorder />
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="heritage-paper lg:hidden border-b border-primary-800/10 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item, index) => (
                  item.submenu ? (
                    <div key={index} className="space-y-2">
                      <button
                        className={`w-full flex justify-between items-center px-4 py-2 rounded-lg transition-colors duration-300
                          ${dropdownOpen === item.name ? 'bg-primary-50 text-primary-600' : 'text-neutral-600'}
                        `}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {dropdownOpen === item.name && (
                        <div className="pl-4 space-y-1 border-l-2 border-primary-200 ml-4">
                          {item.submenu.map((subItem, subIndex) => (
                            subItem.isExternal ? (
                              <a
                                key={subIndex}
                                href={subItem.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                              >
                                {subItem.name} ↗
                              </a>
                            ) : (
                              <Link
                                key={subIndex}
                                to={subItem.path}
                                className={`block px-4 py-2 text-sm rounded-lg
                                  ${location.pathname === subItem.path
                                    ? 'text-primary-600 bg-primary-50'
                                    : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                                  }
                                `}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link 
                      key={index} 
                      to={item.path} 
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                        isActivePath(item.path)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <Link
                  to="/admin/login"
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer: top-bar (~32px) + nav-row (64px) + toran-stripe (36px) + border (~2px) */}
      <div className="h-[134px]" aria-hidden="true" />

      {/* ── Bottom mobile navigation — floating folk-art pill ─────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col-reverse gap-2 px-3 pb-3">

        {/* Floating nav pill */}
        <div className="relative rounded-2xl overflow-hidden bg-[rgba(251,244,231,0.97)] backdrop-blur-xl border border-[rgba(184,121,44,0.18)] shadow-[0_8px_32px_rgba(45,33,20,0.22)]">
          {/* Mini toran stripe — brand textile at the crown of the pill */}
          <div
            className="h-[3px] w-full"
            style={{ background: 'linear-gradient(90deg, #9F2F28 0%, #D9A13A 20%, #2F6B45 40%, #D9A13A 60%, #9F2F28 80%, #D9A13A 100%)' }}
          />
          {/* Nav items */}
          <div className="flex h-[54px]">
            {currentNavItems.map((item, index) => {
              const isActive =
                (item.path && location.pathname === item.path && !item.scrollTo) ||
                (item.isDropdown && dropdownOpen === 'mobile-programs') ||
                (location.pathname === '/cafe' && item.scrollTo && item.name !== 'Home');

              const innerContent = (
                <>
                  {isActive && (
                    <span className="absolute inset-x-0.5 inset-y-0.5 rounded-xl bg-primary-600 -z-10" />
                  )}
                  <item.icon
                    size={17}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-neutral-500'}`}
                  />
                  <span
                    className={`text-[9px] font-bold mt-0.5 leading-none whitespace-nowrap transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-neutral-400'
                    }`}
                  >
                    {item.name}
                  </span>
                </>
              );

              const cls = 'relative flex flex-col items-center justify-center flex-1 h-full py-2 select-none';

              if (item.isDropdown) {
                return (
                  <button key={index} className={cls} onClick={() => toggleDropdown('mobile-programs')}>
                    {innerContent}
                  </button>
                );
              }
              if (item.action) {
                return (
                  <button key={index} className={cls} onClick={() => handleCafeNavClick(item)}>
                    {innerContent}
                  </button>
                );
              }
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={cls}
                  onClick={() => { setIsMenuOpen(false); handleCafeNavClick(item); }}
                >
                  {innerContent}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Programs sheet — appears above the pill (flex-col-reverse stacks upward) */}
        {dropdownOpen === 'mobile-programs' && (
          <div className="heritage-paper rounded-2xl border border-[rgba(184,121,44,0.22)] shadow-[0_-8px_24px_rgba(45,33,20,0.14)] overflow-hidden">
            {/* Sheet toran stripe */}
            <div
              className="h-[3px]"
              style={{ background: 'linear-gradient(90deg, #9F2F28 0%, #D9A13A 25%, #2F6B45 50%, #D9A13A 75%, #9F2F28 100%)' }}
            />
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display font-black text-base text-primary-800">Our Programs</h3>
                <button
                  onClick={() => setDropdownOpen(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-primary-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="gazra-folk-chain mb-3" />
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.find(item => item.name === 'Our Programs')?.submenu.map((subItem, subIndex) => (
                  subItem.isExternal ? (
                    <a
                      key={subIndex}
                      href={subItem.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(184,121,44,0.06)] border border-[rgba(184,121,44,0.12)] hover:bg-primary-50 hover:border-primary-400 transition-all"
                      onClick={() => setDropdownOpen(null)}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                        {subItem.name === 'Gazra Mitra' && <BookOpen size={14} />}
                        {subItem.name === 'Gazra Support Fund' && <Heart size={14} />}
                        {subItem.name === 'Gazra Cafe' && <Coffee size={14} />}
                        {subItem.name === 'Gazra Skill Hub' && <BookOpen size={14} />}
                      </div>
                      <span className="text-xs font-bold text-neutral-800 leading-snug">{subItem.name}</span>
                    </a>
                  ) : (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(184,121,44,0.06)] border border-[rgba(184,121,44,0.12)] hover:bg-primary-50 hover:border-primary-400 transition-all"
                      onClick={() => setDropdownOpen(null)}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                        {subItem.name === 'Gazra Mitra' && <BookOpen size={14} />}
                        {subItem.name === 'Gazra Support Fund' && <Heart size={14} />}
                        {subItem.name === 'Gazra Cafe' && <Coffee size={14} />}
                        {subItem.name === 'Gazra Skill Hub' && <BookOpen size={14} />}
                      </div>
                      <span className="text-xs font-bold text-neutral-800 leading-snug">{subItem.name}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer — accounts for floating pill height (3px stripe + 54px nav + 12px bottom gap) */}
      <div className="lg:hidden h-[72px]" aria-hidden="true" />
    </>
  );
};

export default Navbar;
