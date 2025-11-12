'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChat } from '../components/ChatProvider';
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

function HomeContent() {
  const searchParams = useSearchParams();
  const { setChatOpen } = useChat();

  useEffect(() => {
    // Check if chatbot should be opened from query parameter
    const openChat = searchParams.get('openChat');
    if (openChat === 'true') {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        setChatOpen(true);
        // Clean up URL by removing query parameter
        window.history.replaceState({}, '', '/');
      }, 300);
    }

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
  }, [searchParams, setChatOpen]);

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

export default function Home(): React.JSX.Element {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
