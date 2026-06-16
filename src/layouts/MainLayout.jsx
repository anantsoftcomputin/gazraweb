/* eslint-disable react/prop-types */
import Navbar from '../components/shared/Navbar';
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
      </div>
    </div>
  );
};

export default MainLayout;
