import React from 'react';

interface HeroProps {}

const Hero: React.FC<HeroProps> = React.memo((): React.JSX.Element => {
  return (
    <section className="bg-black min-h-screen flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Transform Your Business with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">
              Custom AI Solutions
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
            We build scalable AI systems that automate workflows, optimize operations, 
            and deliver actionable insights—for startups to global enterprises.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="#contact"
              className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
            >
              Get a Free Consultation
            </a>
            <a 
              href="#areas-of-expertise"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-block"
            >
              Explore Our Services
            </a>
          </div>
        </div>
      </div>
      
      {/* Background Decoration - Subtle glows like the first image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left side - deep muted purple glow */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-900/30 to-transparent"></div>
        {/* Right side - dark teal/blue glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-900/30 to-transparent"></div>
        {/* Subtle center glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl"></div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
