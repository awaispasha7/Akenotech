'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';

interface TechnologiesToolsProps {}

const TechnologiesTools: React.FC<TechnologiesToolsProps> = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [currentCategory, setCurrentCategory] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Official Technology Logos using actual brand logos
  const techLogos: { [key: string]: React.ComponentType } = {
    "Python": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="#3776ab" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
          <path fill="#ffd43b" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
        </svg>
      </div>
    ),
    "C++": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="#00599C" d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.509.294-.926 1.013-.926 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.509.294 1.34.294 1.848 0l8.816-5.09c.509-.294.926-1.013.926-1.6V6.91c0-.294-.104-.62-.271-.91z"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C++</text>
        </svg>
      </div>
    ),
    "C": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#A8B9CC"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">C</text>
        </svg>
      </div>
    ),
    "HTML/CSS/JS": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="#E34F26" d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
        </svg>
      </div>
    ),
    "React": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
          <path fill="none" stroke="#61DAFB" strokeWidth="1" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1zm0 1c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(120 12 12)"/>
        </svg>
      </div>
    ),
    "Django": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="#092E20" d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.001 2.65-6.6 6.753-6.6.521 0 1.059.044 1.707.149V0zm0 9.143a3.29 3.29 0 0 0-1.325-.268c-1.348 0-2.216.89-2.216 2.453 0 1.562.868 2.453 2.216 2.453.433 0 .868-.089 1.325-.268V9.143z"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">D</text>
        </svg>
      </div>
    ),
    "TensorFlow": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="#FF6F00" d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-.014-5.31L12.46 0v24l4.095-2.378V7.603l6.168 3.564z"/>
        </svg>
      </div>
    ),
    "PyTorch": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="#EE4C2C" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 0-.333.034-.483.098l-2.482 1.44c-.01-.004-.022-.004-.033-.008l-.156-.09c-.272-.157-.597-.157-.869 0l-.156.09c-.011.004-.023.004-.033.008l-2.482-1.44c-.15-.064-.314-.098-.483-.098-.169 0-.333.034-.483.098L8.6 9.698c-.01-.004-.022-.004-.033-.008l-.156-.09c-.272-.157-.597-.157-.869 0l-.156.09c-.011.004-.023.004-.033.008L4.915 8.258c-.15-.064-.314-.098-.483-.098-.169 0-.333.034-.483.098L2.95 9.796c-.272.157-.45.45-.45.764v3.88c0 .314.178.607.45.764l2.482 1.44c.15.064.314.098.483.098.169 0 .333-.034.483-.098l2.482-1.44c.01.004.022.004.033.008l.156.09c.272.157.597.157.869 0l.156-.09c.011-.004.023-.004.033-.008l2.482 1.44c.15.064.314.098.483.098.169 0 .333-.034.483-.098l2.482-1.44c.272-.157.45-.45.45-.764v-3.88c0-.314-.178-.607-.45-.764l-2.482-1.44c-.15-.064-.314-.098-.483-.098z"/>
        </svg>
      </div>
    ),
    "Keras": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <path fill="#D00000" d="M24 10.935v2.131l-10 4.934v-2.23l7.76-3.836L14 10.935l10-4.934v2.131l-7.76 3.836L24 10.935zM0 10.935v2.131l10 4.934v-2.23L2.24 11.934 10 8.098V5.967L0 10.935z"/>
        </svg>
      </div>
    ),
    "scikit-learn": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#F7931E"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">sk</text>
        </svg>
      </div>
    ),
    "OpenCV": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#5C3EE8"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">CV</text>
        </svg>
      </div>
    ),
    "YOLO": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#00D8FF"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">YOLO</text>
        </svg>
      </div>
    ),
    "Selenium": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#43B02A"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SEL</text>
        </svg>
      </div>
    ),
    "BeautifulSoup": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#FF6B35"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">BS4</text>
        </svg>
      </div>
    ),
    "Scrapy": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#FF6B35"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SCR</text>
        </svg>
      </div>
    ),
    "NumPy": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#4DABCF"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">NP</text>
        </svg>
      </div>
    ),
    "Pandas": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#150458"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">PD</text>
        </svg>
      </div>
    ),
    "NLTK": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#4CAF50"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">NL</text>
        </svg>
      </div>
    ),
    "SciPy": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#8CAAE6"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SP</text>
        </svg>
      </div>
    ),
    "Diffusers": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#9C27B0"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">DF</text>
        </svg>
      </div>
    ),
    "Xformers": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="12" r="12" fill="#2196F3"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">XF</text>
        </svg>
      </div>
    ),
    "AWS": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#FF9900"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">AWS</text>
        </svg>
      </div>
    ),
    "GCP": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#4285F4"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">GCP</text>
        </svg>
      </div>
    ),
    "Azure": () => (
      <div className="w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#0078D4"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">AZ</text>
        </svg>
      </div>
    )
  };

  const technologies: string[] = useMemo(() => [
    // First row
    "Python", "C++", "C", "HTML/CSS/JS", "React", "Django", 
    "TensorFlow", "PyTorch", "Keras", "scikit-learn", "OpenCV", 
    "YOLO", "Selenium", "BeautifulSoup", "Scrapy", "NumPy",
    // Second row
    "Pandas", "NLTK", "SciPy", "Diffusers", "Xformers", 
    "AWS", "GCP", "Azure"
  ], []);

  useEffect(() => {
    // Scroll direction detection
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollY;
    };

    // Scroll-triggered animation with enhanced effects
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
    
    // Staggered animation for individual items
    const itemTimers = technologies.map((_, index) => 
      setTimeout(() => {
        setAnimatedItems(prev => [...prev, index]);
              }, 300 + (index * 100))
            );

            // Auto-rotate categories
            const categoryTimer = setInterval(() => {
              setCurrentCategory(prev => (prev + 1) % 4);
            }, 3000);

            // Clear timers when component unmounts
    return () => {
      itemTimers.forEach(clearTimeout);
              clearInterval(categoryTimer);
            };
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      const currentSectionRef = sectionRef.current;
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="technologies-tools" className="bg-black py-20 overflow-hidden relative">
      {/* Enhanced background floating elements with scroll effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl transition-all duration-1000 ${
          scrollDirection === 'down' ? 'animate-pulse' : 'animate-bounce'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl transition-all duration-1000 ${
          scrollDirection === 'up' ? 'animate-pulse' : 'animate-bounce'
        }`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-3xl transition-all duration-1000 ${
          scrollDirection === 'down' ? 'animate-bounce' : 'animate-pulse'
        }`} style={{ animationDelay: '4s' }}></div>
        <div className={`absolute bottom-1/3 left-1/3 w-32 h-32 bg-pink-500/10 rounded-full filter blur-3xl transition-all duration-1000 ${
          scrollDirection === 'up' ? 'animate-bounce' : 'animate-pulse'
        }`} style={{ animationDelay: '1s' }}></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title with enhanced animation */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-1000 ${
            scrollDirection === 'down' ? 'animate-bounce' : 'animate-pulse'
          }`}>
            Technologies & Tools
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto transition-all duration-1000 hover:text-white">
            We leverage cutting-edge technologies and industry-standard tools to deliver exceptional AI solutions
          </p>
          
          {/* Animated progress indicator */}
          <div className="mt-8 flex justify-center space-x-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  currentCategory === index 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Technology Categories with Spacious Layout */}
        <div className="space-y-16">
          {/* Programming Languages */}
          <div className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } ${currentCategory === 0 ? 'scale-105' : 'scale-100'}`}>
            <h3 className={`text-2xl font-bold text-white mb-8 text-center transition-all duration-500 ${
              currentCategory === 0 ? 'text-blue-400 animate-pulse' : 'text-white'
            }`}>
              Programming Languages
            </h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {["Python", "C++", "C", "HTML/CSS/JS"].map((tech, index) => (
                <div
                  key={tech}
                  className={`group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl px-8 py-4 text-white text-lg font-medium transition-all duration-700 cursor-pointer transform hover:scale-110 hover:-translate-y-4 hover:rotate-1 ${
                animatedItems.includes(index) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-90'
                  } ${
                    scrollDirection === 'down' ? 'hover:animate-bounce' : 'hover:animate-pulse'
                  }`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Multi-layer glow effects */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                  
                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(techLogos[tech])}
                    </div>
                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500 group-hover:font-bold">
                      {tech}
                    </span>
                  </div>

                  {/* Multiple floating particles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-1000"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks & Libraries */}
          <div className={`transition-all duration-1000 transform delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Frameworks & Libraries</h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {["React", "Django", "TensorFlow", "PyTorch", "Keras", "scikit-learn"].map((tech, index) => (
                <div
                  key={tech}
                  className={`group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl px-8 py-4 text-white text-lg font-medium transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-translate-y-3 ${
                    animatedItems.includes(index + 4) 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-90'
                  }`}
                  style={{ transitionDelay: `${600 + index * 150}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(techLogos[tech])}
                    </div>
                    <span className="group-hover:text-purple-300 transition-all duration-300">{tech}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                </div>
              ))}
            </div>
          </div>

          {/* AI & Data Science */}
          <div className={`transition-all duration-1000 transform delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">AI & Data Science</h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {["OpenCV", "YOLO", "NumPy", "Pandas", "NLTK", "SciPy", "Diffusers", "Xformers"].map((tech, index) => (
                <div
                  key={tech}
                  className={`group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl px-8 py-4 text-white text-lg font-medium transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-translate-y-3 ${
                    animatedItems.includes(index + 10) 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-90'
                  }`}
                  style={{ transitionDelay: `${900 + index * 150}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(techLogos[tech])}
                    </div>
                    <span className="group-hover:text-cyan-300 transition-all duration-300">{tech}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
            </div>
          ))}
            </div>
        </div>

          {/* Web Scraping & Cloud */}
          <div className={`transition-all duration-1000 transform delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Web Scraping & Cloud</h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {["Selenium", "BeautifulSoup", "Scrapy", "AWS", "GCP", "Azure"].map((tech, index) => (
                <div
                  key={tech}
                  className={`group relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl px-8 py-4 text-white text-lg font-medium transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-translate-y-3 ${
                    animatedItems.includes(index + 18) 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-90'
                  }`}
                  style={{ transitionDelay: `${1200 + index * 150}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(techLogos[tech])}
                    </div>
                    <span className="group-hover:text-green-300 transition-all duration-300">{tech}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced animated bottom accent */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="inline-block h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
          <div className="mt-2 inline-block h-0.5 w-16 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      {/* Enhanced custom CSS animations */}
      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8) rotate(12deg);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-10px) scale(1.05) rotate(-2deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }
        
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(100px) rotate(10deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(147, 51, 234, 0.6);
          }
        }
        
        .group:hover {
          animation: float 2s ease-in-out infinite, glow 1.5s ease-in-out infinite;
        }
        
        .scroll-down .group:nth-child(odd) {
          animation: slideInFromLeft 0.8s ease-out;
        }
        
        .scroll-up .group:nth-child(even) {
          animation: slideInFromRight 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default TechnologiesTools;
