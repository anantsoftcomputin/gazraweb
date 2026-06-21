import { useState, useEffect, useRef } from 'react';
import { Link } from '../../lib/routerCompat';
import { ArrowRight, Coffee, Wallet, Smartphone, Briefcase, Newspaper, Volume2, VolumeX } from 'lucide-react';

const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };
  const serviceButtons = [
    { icon: Smartphone, title: "Gazra Mitra", url: "https://mitra.gazra.org", isExternal: true },
    { icon: Wallet, title: "Gazra Support Fund", url: "/gazra-support" },
    { icon: Coffee, title: "Gazra Cafe", url: "/cafe" },
    { icon: Briefcase, title: "Gazra Skill Hub", url: "/gazra-skills" }
  ];

  return (
    <div className="relative min-h-[86vh] overflow-hidden bg-neutral-950 -mt-[134px] lg:mt-0">
      <div className="absolute inset-0 overflow-hidden">
        {isDesktop ? (
          /* Desktop (768px+): muted ambient video — mute=1 required for browser autoplay policy */
          <iframe
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.18]"
            src="https://www.youtube.com/embed/0Dv_G_SzTmk?start=68&autoplay=1&mute=1&controls=0&disablekb=1&fs=0&playsinline=1&loop=1&playlist=0Dv_G_SzTmk&modestbranding=1&rel=0&iv_load_policy=3&cc_load_policy=0"
            title="Project Gazra community video"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            aria-hidden="true"
          />
        ) : (
          /* Mobile/tablet: local video via <video> tag — supports playsInline for mobile autoplay */
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/video/Gazra%20Cafe.mp4" type="video/mp4" />
          </video>
        )}
        {!isDesktop && (
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            className="absolute bottom-5 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/15 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,244,231,0.08)_1px,transparent_1px)] bg-[length:100%_5px] opacity-30 mix-blend-soft-light" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--gazra-paper)] via-[rgba(251,244,231,0.76)] to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative flex min-h-[86vh] w-full items-end pt-[160px] pb-10 px-4 sm:px-8 sm:pt-[160px] sm:pb-12 lg:items-center lg:px-12 xl:px-16 lg:pt-16 lg:pb-16">
        <div className="max-w-3xl space-y-4 md:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded border border-primary-200/40 bg-[rgba(251,244,231,0.88)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-accent-terracotta shadow-lg backdrop-blur-md">
              <Newspaper className="w-3.5 h-3.5" />
              Shri Maharani Chimnabai Stree Udyogalaya
            </div>

            {/* Logos side by side — hidden on mobile to keep video visible */}
            <div className="hidden sm:flex space-x-4 items-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[rgba(251,244,231,0.78)] p-2 shadow-lg backdrop-blur-md">
                <img src="https://gazra.org/logo.png" alt="Gazra Logo" className="w-full h-full object-contain"/>
              </div>
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[rgba(251,244,231,0.78)] p-2 shadow-lg backdrop-blur-md">
                <img src="https://i0.wp.com/mcsu.in/wp-content/uploads/2022/07/Logo.png?w=512&ssl=1" alt="MCSU Logo" className="w-full h-full object-contain"/>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="font-display text-5xl lg:text-5xl xl:text-7xl font-black leading-[1.08] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]">
              The Gazra Project
            </h1>

            {/* Description */}
            <p className="text-base lg:text-xl text-primary-50 max-w-2xl leading-relaxed drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)]">
              Join a Vibrant Community where Authenticity Thrives. Together, We create a world of Acceptance and Empowerment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="group inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-700">
                Join Our Community
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-100/80 bg-neutral-950/20 px-6 py-3 font-semibold text-primary-50 backdrop-blur-md transition-all duration-300 hover:bg-primary-600 hover:text-white">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service Buttons Section — hidden on mobile to keep video visible */}
            <div className="hidden md:block pt-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                Our Initiatives
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {serviceButtons.map((service, index) => (
                  service.isExternal ? (
                    <a
                      key={index}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-3 rounded-lg border border-primary-100/25 bg-[rgba(251,244,231,0.86)] p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[rgba(251,244,231,0.94)] hover:shadow-xl"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded border border-primary-700/20 bg-primary-600 text-white">
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <span className="mb-1 block text-sm font-bold text-neutral-900">{service.title}</span>
                        <span className="flex items-center justify-center gap-1 text-xs font-semibold text-accent-terracotta">
                          Know More
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={service.url}
                      className="group flex flex-col items-center gap-3 rounded-lg border border-primary-100/25 bg-[rgba(251,244,231,0.86)] p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[rgba(251,244,231,0.94)] hover:shadow-xl"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded border border-primary-700/20 bg-primary-600 text-white">
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <span className="mb-1 block text-sm font-bold text-neutral-900">{service.title}</span>
                        <span className="flex items-center justify-center gap-1 text-xs font-semibold text-accent-terracotta">
                          Know More
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
