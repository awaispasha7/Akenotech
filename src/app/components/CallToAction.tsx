'use client';

import { useEffect, useState } from 'react';

interface CallToActionProps {}

const CallToAction: React.FC<CallToActionProps> = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);

  useEffect(() => {
    // Trigger main animation
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Staggered animation for individual elements
    const elementTimers = [0, 1, 2].map((index) => 
      setTimeout(() => {
        setAnimatedElements(prev => [...prev, index]);
      }, 400 + (index * 300))
    );

    return () => {
      clearTimeout(timer);
      elementTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="bg-black py-20 relative overflow-hidden">
      {/* Enhanced Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-pink-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main Card Container */}
        <div className={`group relative bg-gradient-to-r from-purple-900/40 via-black/60 to-teal-900/40 rounded-2xl p-12 md:p-16 transition-all duration-1000 transform hover:scale-105 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Enhanced Card background glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-teal-500/10 group-hover:from-purple-500/20 group-hover:to-teal-500/20 transition-all duration-500"></div>
          
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Main Title with enhanced animation */}
            <div className={`transition-all duration-1000 transform ${
              animatedElements.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-teal-300 transition-all duration-500">
                Ready to Supercharge Your Business with AI?
              </h2>
            </div>

            {/* Subtitle with enhanced animation */}
            <div className={`transition-all duration-1000 delay-300 transform ${
              animatedElements.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-lg md:text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
                Let&apos;s design a roadmap tailored to your goals.
              </p>
            </div>

            {/* CTA Button with enhanced animation */}
            <div className={`transition-all duration-1000 delay-600 transform ${
              animatedElements.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <a 
                href="#contact"
                className="group/btn relative bg-white text-black px-12 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/30 overflow-hidden inline-block"
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button content */}
                <span className="relative z-10 group-hover/btn:text-gray-800 transition-colors duration-300">
                  Schedule a Call
                </span>

                {/* Enhanced shimmer effect */}
                <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                
                {/* Floating particles on hover */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover/btn:opacity-100 transition-all duration-300 group-hover/btn:animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-teal-400 rounded-full opacity-0 group-hover/btn:opacity-100 transition-all duration-300 group-hover/btn:animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Decorative elements */}
        <div className={`mt-16 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex justify-center space-x-4">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
