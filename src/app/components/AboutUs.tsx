'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AboutUsProps {}

const AboutUs: React.FC<AboutUsProps> = React.memo((): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);
  const [scrollAnimations, setScrollAnimations] = useState<{[key: string]: boolean}>({});
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const domainsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    const elementTimers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => 
      setTimeout(() => {
        setAnimatedElements(prev => [...prev, index]);
      }, 300 + (index * 100))
    );

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
    if (domainsRef.current) observer.observe(domainsRef.current);
    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    // Observe domain cards
    const domainElements = document.querySelectorAll('[data-animation-id^="domain-"]');
    domainElements.forEach(element => observer.observe(element));

    return () => {
      clearTimeout(timer);
      elementTimers.forEach(clearTimeout);
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - About Us */}
          <div className="lg:col-span-2">
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
                
                {/* Key Expertise Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                  {[
                    { icon: "🧠", title: "Machine Learning", desc: "Deep learning & neural networks" },
                    { icon: "💬", title: "NLP & LLMs", desc: "Natural language processing" },
                    { icon: "👁️", title: "Computer Vision", desc: "Image & video analysis" },
                    { icon: "🏗️", title: "Full-Stack AI", desc: "End-to-end AI applications" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      ref={(el) => {
                        if (el) cardsRef.current[index] = el;
                      }}
                      data-animation-id={`card-${index}`}
                      className={`group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-700 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 ${
                        animatedElements.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      } ${
                        scrollAnimations[`card-${index}`] ? 'animate-bounce' : ''
                      }`}
                      style={{ 
                        transitionDelay: `${index * 200}ms`,
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <span className={`text-2xl group-hover:scale-110 transition-transform duration-300 ${
                          scrollAnimations[`card-${index}`] ? 'animate-spin' : ''
                        }`} style={{ animationDuration: '3s' }}>{item.icon}</span>
                        <div>
                          <h4 className="text-white font-semibold mb-1 group-hover:text-purple-300 transition-colors duration-300">
                            {item.title}
                          </h4>
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  We design full-stack AI applications—architecture, models, deployment—and focus on scalable NLP/LLM systems to enhance communication and automate workflows. We collaborate effectively with distributed teams, particularly across U.S. markets.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - AI Domains */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div 
              ref={domainsRef}
              data-animation-id="domains"
              className={`w-full max-w-sm bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl transition-all duration-1000 transform hover:scale-105 hover:shadow-purple-500/20 hover:border-purple-500/50 group ${
                animatedElements.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${
                scrollAnimations.domains ? 'animate-pulse' : ''
              }`}
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <h3 className={`text-white text-3xl font-bold mb-2 transition-all duration-1000 transform group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 ${
                  animatedElements.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  AI Domains
                </h3>
                <div className={`flex items-center justify-center space-x-2 transition-all duration-1000 transform ${
                  animatedElements.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`} style={{ transitionDelay: '200ms' }}>
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 relative">
                    10+
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                  </span>
                  <span className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors duration-500">Expertise Areas</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-6 relative z-10">
                <div className="text-center">
                  <div 
                    data-animation-id="domain-0"
                    className={`bg-gray-700/50 rounded-lg p-4 mb-3 group/card hover:bg-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 border border-transparent hover:border-purple-500/30 ${
                      animatedElements.includes(7) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    } ${
                      scrollAnimations['domain-0'] ? 'animate-bounce' : ''
                    }`} 
                    style={{ transitionDelay: '400ms' }}
                  >
                    <span className="text-white text-lg font-medium group-hover/card:text-purple-300 transition-colors duration-300">
                      End-to-End Delivery
                    </span>
                  </div>
                  <div 
                    data-animation-id="domain-1"
                    className={`bg-gray-700/50 rounded-lg p-4 group/card hover:bg-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 border border-transparent hover:border-purple-500/30 ${
                      animatedElements.includes(8) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    } ${
                      scrollAnimations['domain-1'] ? 'animate-bounce' : ''
                    }`} 
                    style={{ transitionDelay: '600ms' }}
                  >
                    <span className="text-white text-lg font-medium group-hover/card:text-purple-300 transition-colors duration-300">
                      Architecture → Ops
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div 
                    data-animation-id="domain-2"
                    className={`bg-gray-700/50 rounded-lg p-4 mb-3 group/card hover:bg-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 border border-transparent hover:border-purple-500/30 ${
                      animatedElements.includes(9) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    } ${
                      scrollAnimations['domain-2'] ? 'animate-bounce' : ''
                    }`} 
                    style={{ transitionDelay: '800ms' }}
                  >
                    <span className="text-white text-lg font-medium group-hover/card:text-purple-300 transition-colors duration-300">
                      Enterprise Security
                    </span>
                  </div>
                  <div 
                    data-animation-id="domain-3"
                    className={`bg-gray-700/50 rounded-lg p-4 group/card hover:bg-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 border border-transparent hover:border-purple-500/30 ${
                      animatedElements.includes(10) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    } ${
                      scrollAnimations['domain-3'] ? 'animate-bounce' : ''
                    }`} 
                    style={{ transitionDelay: '1000ms' }}
                  >
                    <span className="text-white text-lg font-medium group-hover/card:text-purple-300 transition-colors duration-300">
                      Best Practices
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className={`mt-8 text-center transition-all duration-1000 transform ${
                animatedElements.includes(11) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`} style={{ transitionDelay: '1200ms' }}>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-500"></div>
              </div>

              {/* Floating particles on hover */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
              <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 right-2 w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;
