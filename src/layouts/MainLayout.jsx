/* eslint-disable react/prop-types */
import Navbar from '../components/shared/Navbar';
import AmbientThreeScene from '../components/shared/AmbientThreeScene';
import FooterPreview from '../components/home/FooterPreview';
import ParrotDecor from '../components/shared/ParrotDecor';

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <AmbientThreeScene />

      {/*
       * Decorative parrots — fixed to the viewport sides so they accompany the
       * user as they scroll through every page. z-30: above page content (z-10)
       * and the bottom nav (z-50 covers them only when bottom nav overlaps).
       * Hidden on very narrow phones where they'd obscure content.
       */}
      <div
        className="fixed left-0 z-30 pointer-events-none hidden sm:block gazra-parrot-bob"
        style={{ top: '42%' }}
      >
        <ParrotDecor size={44} flip={false} opacity={0.32} />
      </div>
      <div
        className="fixed right-0 z-30 pointer-events-none hidden sm:block"
        style={{ top: '42%', animation: 'gazra-parrot-bob 3.8s ease-in-out 1.5s infinite', willChange: 'transform' }}
      >
        <ParrotDecor size={44} flip={true} opacity={0.32} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        {/* Main Content */}
        <main className="heritage-site flex-grow">
          {children}
        </main>

        <FooterPreview />
      </div>
    </div>
  );
};

export default MainLayout;
