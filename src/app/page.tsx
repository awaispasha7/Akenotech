import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedCompanies from './components/TrustedCompanies';
import AboutUs from './components/AboutUs';
import AreasOfExpertise from './components/AreasOfExpertise';
import TechnologiesTools from './components/TechnologiesTools';
import HighlightedUseCases from './components/HighlightedUseCases';
import CallToAction from './components/CallToAction';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <AboutUs />
      <AreasOfExpertise />
      <TechnologiesTools />
      <HighlightedUseCases />
      <CallToAction />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
