'use client';

import { useEffect, useState } from 'react';

interface Testimonial {
  text: string;
  author: string;
  role: string;
}

interface TestimonialsProps {}

const Testimonials: React.FC<TestimonialsProps> = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<number[]>([]);

  const testimonials: Testimonial[] = [
    {
      text: "We were very satisfied. Their expertise in AI is proven.",
      author: "Tech Director",
      role: "Technology Company"
    },
    {
      text: "Working with Akeno Tech has been an outstanding experience from start to finish. They demonstrated exceptional skill in building and automating our DeepL API workflows, delivering precisely what we needed with efficiency and precision. Their communication was consistently clear and proactive, ensuring alignment at every step of the project. Akeno Tech's problem-solving approach is impressive—they quickly understood our goals, suggested thoughtful improvements, and implemented robust solutions that exceeded our expectations. I highly recommend them for any technical automation or API integration projects, and I look forward to collaborating again in the future.",
      author: "CTO",
      role: "Software Company"
    },
    {
      text: "They were always willing to jump on a call to troubleshoot concerns and truly cared about the quality of their work.",
      author: "Product Manager",
      role: "Tech Startup"
    },
    {
      text: "I highly recommend this team for ML/AI contract work.",
      author: "Data Scientist",
      role: "AI Company"
    }
  ];

  useEffect(() => {
    // Trigger main animation
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Staggered animation for individual cards
    const cardTimers = testimonials.map((_, index) => 
      setTimeout(() => {
        setAnimatedCards(prev => [...prev, index]);
      }, 300 + (index * 200))
    );

    return () => {
      clearTimeout(timer);
      cardTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section id="testimonials" className="bg-black py-20 relative overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className={`mb-16 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Testimonials
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${
                animatedCards.includes(index) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              } ${
                index === 1 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              {/* Card background glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-purple-400 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Testimonial text */}
                <blockquote className="text-gray-300 text-base leading-relaxed mb-6 group-hover:text-white transition-colors duration-300">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                {/* Author info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors duration-300">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-300">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

              {/* Floating particles on hover */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          ))}
        </div>

        {/* Bottom accent */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="inline-block h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;