'use client';

import React, { useState, useEffect } from 'react';

interface ExpertiseArea {
  title: string;
  description: string;
}

interface AreasOfExpertiseProps {}

const AreasOfExpertise: React.FC<AreasOfExpertiseProps> = React.memo((): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<number[]>([]);

  useEffect(() => {
    // Trigger main animation
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Staggered animation for individual cards
    const cardTimers = [0, 1, 2, 3, 4, 5].map((index) => 
      setTimeout(() => {
        setAnimatedCards(prev => [...prev, index]);
      }, 400 + (index * 150))
    );

    return () => {
      clearTimeout(timer);
      cardTimers.forEach(clearTimeout);
    };
  }, []);

  const expertiseAreas: ExpertiseArea[] = [
    {
      title: "AI Model Development",
      description: "Neural Networks, Regression, Supervised/Unsupervised Learning, Predictive & Reinforcement Learning. End-to-end from data to deployment."
    },
    {
      title: "Workflow Automation",
      description: "Reduce operational overhead with Selenium, BeautifulSoup, and Scrapy. Robust pipelines, retries, monitoring."
    },
    {
      title: "NLP & LLM Solutions",
      description: "Custom chatbots, vector databases/RAG, Unigram models, communication systems at enterprise scale."
    },
    {
      title: "Computer Vision",
      description: "OpenCV and YOLO v1-v10 for detection, tracking, inspection, analytics, and safety applications."
    },
    {
      title: "Full-Stack AI Apps",
      description: "Architecture → ML models → APIs → UI. Built with Django/React and modern cloud CI/CD."
    },
    {
      title: "Cloud & Tooling",
      description: "Python, C/C++, JS/TS, TensorFlow, PyTorch, Keras, scikit-learn, Diffusers, Xformers on AWS/GCP/Azure."
    }
  ];

  return (
    <section id="areas-of-expertise" className="relative bg-black py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/3 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Areas of Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              className={`group relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden ${
                animatedCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Enhanced background glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/8 to-blue-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              {/* Floating particles effect */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 group-hover:scale-150 group-hover:rotate-180 transition-all duration-500"></div>
                  <h3 className="text-white text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 group-hover:scale-105 group-hover:tracking-wide transition-all duration-500 transform">
                    {area.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 group-hover:translate-x-2 group-hover:scale-[1.02] transition-all duration-500 transform">
                  {area.description}
                </p>
                
                {/* Animated text highlight effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Animated underline for title */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-700 ease-out"></div>
                
                {/* Text reveal animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
              </div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

AreasOfExpertise.displayName = 'AreasOfExpertise';

export default AreasOfExpertise;
