import React from 'react';
import Hero from '../components/home/Hero';
import QuickOverview from '../components/home/QuickOverview';
import EventsPreview from '../components/home/EventsPreview';
import Newsletter from '../components/home/Newsletter';
import FooterPreview from '../components/home/FooterPreview';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section - Primary light background */}
      <section className="bg-primary-50">
        <Hero />
      </section>

      {/* Quick Overview Section - White background */}
      <section className="bg-bg-primary-80">
        <QuickOverview />
      </section>

      {/* Events Preview Section - Primary background */}
      <section className="bg-primary-100">
        <EventsPreview />
      </section>

      {/* Newsletter Section - Secondary light background */}
      <section className="bg-secondary-80">
        <Newsletter />
      </section>

      {/* Footer Preview Section - Neutral dark background */}
      <section className="bg-neutral-800 text-neutral-100">
        <FooterPreview />
      </section>
    </div>
  );
};

export default Home;