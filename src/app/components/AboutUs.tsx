'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AboutUsProps {}

const AboutUs: React.FC<AboutUsProps> = React.memo((): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollAnimations, setScrollAnimations] = useState<{[key: string]: boolean}>({});
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations
    const timer = setTimeout(() => setIsVisible(true), 200);

    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute('data-animation-id');
          if (elementId) {
            setScrollAnimations(prev => ({ ...prev, [elementId]: true }));
          }
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    if (titleRef.current) observer.observe(titleRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="bg-black py-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12">
          {/* About Us Content */}
          <div>
            <div className={`transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Enhanced Title with Gradient */}
              <div 
                ref={titleRef}
                data-animation-id="title"
                className={`mb-8 transition-all duration-1000 transform ${
                  scrollAnimations.title ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
              >
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className={`bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent transition-all duration-1000 ${
                    scrollAnimations.title ? 'animate-pulse' : ''
                  }`}>
                    About Us
                  </span>
                </h2>
                <div className={`w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 transform ${
                  scrollAnimations.title ? 'scale-x-100' : 'scale-x-0'
                }`} style={{ transformOrigin: 'left' }}></div>
              </div>

              {/* Enhanced Content with Better Typography */}
              <div className="space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  We have proven expertise in the tech industry and specialize in building innovative AI solutions that drive business transformation.
                </p>

                <p className="text-gray-300 text-lg leading-relaxed">
                  We design full-stack AI applications—architecture, models, deployment—and focus on scalable NLP/LLM systems to enhance communication and automate workflows. We collaborate effectively with distributed teams, particularly across U.S. markets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;
