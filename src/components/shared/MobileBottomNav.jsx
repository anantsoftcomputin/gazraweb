import { useState } from 'react';
import { Link, useLocation } from '../../lib/routerCompat';
import { X, Home, Info, Calendar, MapPin, Heart, Coffee, BookOpen, Camera, LifeBuoy } from 'lucide-react';

// Mobile navigation items (simplified for bottom nav) — Cafe is placed dead
// center of the bar (4th of 7 items) per design request.
const mobileNavItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Initiatives', path: null, icon: BookOpen, isDropdown: true },
  { name: 'Cafe', path: '/cafe', icon: Coffee },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Gallery', path: '/gallery', icon: Camera },
  { name: 'Contact', path: '/contact', icon: MapPin }
];

// Cafe is intentionally excluded here — the bottom pill already has its own
// dedicated raised Cafe button, so listing it again in this sheet would be redundant.
const programLinks = [
  { name: 'Gazra Mitra', path: 'https://mitra.gazra.org', isExternal: true },
  { name: 'Gazra Support Fund', path: '/gazra-support' },
  { name: 'Resources', path: '/resources' },
  { name: 'Gazra Skill Hub', path: '/gazra-skills' }
];

// Renders at the END of the page layout (after the footer) so its trailing
// spacer reserves room above the fixed pill without pushing page content
// down at the top — see MainLayout.jsx.
const MobileBottomNav = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col-reverse gap-2 px-3 pb-3">
        {/* Floating nav pill — outer wrapper is intentionally NOT overflow-hidden so the
            raised circular Cafe button can poke out above the rounded top edge */}
        <div className="relative rounded-2xl bg-[rgba(251,244,231,0.97)] backdrop-blur-xl border border-[rgba(184,121,44,0.18)] shadow-[0_8px_32px_rgba(45,33,20,0.22)]">
          {/* Clipped inner content — toran stripe + nav row stay confined to rounded corners */}
          <div className="rounded-2xl overflow-hidden">
            {/* Mini toran stripe — brand textile at the crown of the pill */}
            <div
              className="h-[3px] w-full"
              style={{ background: 'linear-gradient(90deg, #9F2F28 0%, #D9A13A 20%, #2F6B45 40%, #D9A13A 60%, #9F2F28 80%, #D9A13A 100%)' }}
            />
            {/* Nav items */}
            <div className="flex h-[54px]">
              {mobileNavItems.map((item, index) => {
                if (item.name === 'Cafe') {
                  // Visible button is rendered separately below (raised circle); this
                  // keeps the flex column width allocated so the layout stays balanced.
                  return <div key={index} className="flex-1" aria-hidden="true" />;
                }

                const isActive =
                  (item.path && location.pathname === item.path) ||
                  (item.isDropdown && sheetOpen);

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
                    <button key={index} className={cls} onClick={() => setSheetOpen((open) => !open)}>
                      {innerContent}
                    </button>
                  );
                }
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={cls}
                    onClick={() => setSheetOpen(false)}
                  >
                    {innerContent}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Raised circular Cafe button — half above the pill's top edge, half inside it */}
          <Link
            to="/cafe"
            onClick={() => setSheetOpen(false)}
            aria-label="Gazra Cafe"
            className={`absolute left-1/2 -translate-x-1/2 -top-7 z-10 flex flex-col items-center justify-center w-14 h-14 rounded-full border-[3px] border-[rgba(251,244,231,0.97)] shadow-[0_6px_16px_rgba(45,33,20,0.32)] transition-colors duration-200 ${
              location.pathname === '/cafe' ? 'bg-primary-700' : 'bg-primary-600'
            }`}
          >
            <Coffee size={20} className="text-white" strokeWidth={1.8} />
            <span className="text-[8px] font-bold mt-0.5 leading-none text-white/90">Cafe</span>
          </Link>
        </div>

        {/* Programs sheet — appears above the pill (flex-col-reverse stacks upward) */}
        {sheetOpen && (
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
                  onClick={() => setSheetOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-primary-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="gazra-folk-chain mb-3" />
              <div className="grid grid-cols-2 gap-2">
                {programLinks.map((subItem, subIndex) => (
                  subItem.isExternal ? (
                    <a
                      key={subIndex}
                      href={subItem.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(184,121,44,0.06)] border border-[rgba(184,121,44,0.12)] hover:bg-primary-50 hover:border-primary-400 transition-all"
                      onClick={() => setSheetOpen(false)}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                        {subItem.name === 'Gazra Mitra' && <BookOpen size={14} />}
                        {subItem.name === 'Gazra Support Fund' && <Heart size={14} />}
                        {subItem.name === 'Resources' && <LifeBuoy size={14} />}
                        {subItem.name === 'Gazra Skill Hub' && <BookOpen size={14} />}
                      </div>
                      <span className="text-xs font-bold text-neutral-800 leading-snug">{subItem.name}</span>
                    </a>
                  ) : (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(184,121,44,0.06)] border border-[rgba(184,121,44,0.12)] hover:bg-primary-50 hover:border-primary-400 transition-all"
                      onClick={() => setSheetOpen(false)}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                        {subItem.name === 'Gazra Mitra' && <BookOpen size={14} />}
                        {subItem.name === 'Gazra Support Fund' && <Heart size={14} />}
                        {subItem.name === 'Resources' && <LifeBuoy size={14} />}
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

export default MobileBottomNav;
