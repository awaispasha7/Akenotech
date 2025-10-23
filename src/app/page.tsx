'use client';

import { useEffect } from 'react';
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
  useEffect(() => {
    // Handle hash navigation when page loads (e.g., from blog page)
    const handleHashNavigation = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Handle initial load
    handleHashNavigation();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      {/* Demo comment - Latest update with EmailJS integration and CORS fixes */}
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
