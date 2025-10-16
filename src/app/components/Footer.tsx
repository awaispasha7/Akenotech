'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FooterProps {}

const Footer: React.FC<FooterProps> = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);

  useEffect(() => {
    // Trigger main animation
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Staggered animation for individual elements
    const elementTimers = [0, 1, 2, 3, 4, 5, 6, 7].map((index) => 
      setTimeout(() => {
        setAnimatedElements(prev => [...prev, index]);
      }, 300 + (index * 100))
    );

    return () => {
      clearTimeout(timer);
      elementTimers.forEach(clearTimeout);
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 relative overflow-hidden">
      {/* Enhanced Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/3 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/3 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/3 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-pink-500/3 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-cyan-500/3 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className={`py-16 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className={`lg:col-span-1 transition-all duration-1000 transform ${
              animatedElements.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="group flex items-center mb-6">
                <div className="w-12 h-12 mr-3 rounded-full overflow-hidden bg-black group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Image
                    src="/final.png"
                    alt="Akeno Tech Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-white text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-500">Akeno</span>
                  <span className="text-white text-xl font-light ml-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-500">Tech</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-500">
                Transform your business with custom AI solutions. We build scalable AI systems that automate workflows, optimize operations, and deliver actionable insights.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.linkedin.com/company/akenotech/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group hover:scale-110 hover:rotate-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white relative z-10 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                </a>
                <a href="https://www.instagram.com/akenotech?igsh=MXcwYXF1cHNkM2F5Ng==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-all duration-300 group hover:scale-110 hover:rotate-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white relative z-10 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className={`transition-all duration-1000 transform ${
              animatedElements.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h3 className="text-white text-lg font-semibold mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-500">Services</h3>
              <ul className="space-y-3">
                {['AI Model Development', 'Workflow Automation', 'NLP & LLM Solutions', 'Computer Vision', 'Full-Stack AI Apps', 'Cloud & Tooling'].map((service, index) => (
                  <li key={index} className="group">
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm group flex items-center group-hover:translate-x-2"
                    >
                      <span className="w-1 h-1 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"></span>
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className={`transition-all duration-1000 transform ${
              animatedElements.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h3 className="text-white text-lg font-semibold mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-teal-300 transition-all duration-500">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Our Team', 'Case Studies', 'Testimonials', 'Careers', 'Blog'].map((item, index) => (
                  <li key={index} className="group">
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm group flex items-center group-hover:translate-x-2"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Legal */}
            <div className={`transition-all duration-1000 transform ${
              animatedElements.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h3 className="text-white text-lg font-semibold mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-300 group-hover:to-green-300 transition-all duration-500">Contact & Legal</h3>
              <ul className="space-y-3">
                <li className="group">
                  <a 
                    href="mailto:Ask@akenotech.com" 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm group flex items-center group-hover:translate-x-2"
                  >
                    <span className="w-1 h-1 bg-teal-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"></span>
                    Ask@akenotech.com
                  </a>
                </li>
                <li className="group">
                  <a 
                    href="tel:(888) 324-6560" 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm group flex items-center group-hover:translate-x-2"
                  >
                    <span className="w-1 h-1 bg-teal-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"></span>
                    (888) 324-6560
                  </a>
                </li>
                <li className="group">
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm group flex items-center group-hover:translate-x-2"
                  >
                    <span className="w-1 h-1 bg-teal-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"></span>
                    Privacy Policy
                  </a>
                </li>
                <li className="group">
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm group flex items-center group-hover:translate-x-2"
                  >
                    <span className="w-1 h-1 bg-teal-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"></span>
                    Terms of Service
                  </a>
                </li>
                <li className="group">
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm group flex items-center group-hover:translate-x-2"
                  >
                    <span className="w-1 h-1 bg-teal-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"></span>
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className={`border-t border-gray-800 py-6 transition-all duration-1000 transform ${
          animatedElements.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0 group-hover:text-gray-300 transition-colors duration-500">
              © {currentYear} Akeno Tech. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {['Services', 'About', 'Contact', 'Privacy', 'Terms'].map((link, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-gray-400 hover:text-white transition-all duration-300 text-sm group hover:translate-y-[-2px] relative"
                >
                  {link}
                  {/* Underline effect */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
