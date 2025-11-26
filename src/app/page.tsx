'use client';

import { useEffect, Suspense } from 'react';
import Link from "next/link";
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

      {/* AI Video Generation CTA */}
      <section className="bg-gradient-to-br from-[#050816] via-black to-slate-900 text-white border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20 grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-4 md:space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300/80">
              New capability
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Prototype AI video concepts in minutes, not weeks.
            </h2>
            <p className="text-sm md:text-base text-gray-300 max-w-xl">
              Let your teams describe a scenario in natural language and instantly see it as a short video.
              Ideal for pitching AI use cases, storytelling product flows, and validating motion concepts
              without a production crew.
            </p>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white/5 border border-white/15 rounded-2xl p-5 md:p-6 backdrop-blur-sm space-y-3">
              <p className="text-sm font-semibold text-emerald-300/90">
                What you get
              </p>
              <ul className="space-y-2 text-sm text-gray-200 list-disc list-inside">
                <li>Short Sora-powered clips tailored to your prompts.</li>
                <li>Configurable durations for quick explorations or deeper dives.</li>
                <li>Ready-to-share links you can drop into decks or send to stakeholders.</li>
              </ul>
            </div>
            <Link
              href="/generate-video"
              className="inline-flex items-center justify-center bg-emerald-500 text-black px-8 py-3 rounded-full font-semibold text-base shadow-xl hover:shadow-2xl hover:bg-emerald-400 hover:scale-105 transition-all"
            >
              Generate a video now
            </Link>
          </div>
        </div>
      </section>

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
