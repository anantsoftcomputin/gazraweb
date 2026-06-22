/* eslint-disable react/prop-types */
import Navbar from '../components/shared/Navbar';
import MobileBottomNav from '../components/shared/MobileBottomNav';
import AmbientThreeScene from '../components/shared/AmbientThreeScene';
import FooterPreview from '../components/home/FooterPreview';

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <AmbientThreeScene />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        {/* Main Content */}
        <main className="heritage-site flex-grow">
          {children}
        </main>

        <FooterPreview />

        {/* Rendered last so its spacer reserves room at the END of the page,
            not before <main> — keeps the fixed top nav from pushing all
            page content down by an extra ~72px on mobile. */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
