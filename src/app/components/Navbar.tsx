'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useChat } from '../../components/ChatProvider';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (): React.JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState<boolean>(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const isBlogPage = pathname === '/blog';
  const { setChatOpen } = useChat();

  const handleNavigation = useCallback((sectionId: string): void => {
    if (isBlogPage) {
      // If on blog page, navigate to home page first, then scroll to section
      window.location.href = `/#${sectionId}`;
    } else {
      // If on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If element not found, try navigating to home page with hash
        window.location.href = `/#${sectionId}`;
      }
    }
  }, [isBlogPage]);

  const handleContactClick = useCallback(() => {
    setChatOpen(true);
    setIsMenuOpen(false); // Close mobile menu if open
  }, [setChatOpen]);

  const handleDropdownMouseEnter = useCallback(() => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsResourcesDropdownOpen(true);
  }, [dropdownTimeout]);

  const handleDropdownMouseLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsResourcesDropdownOpen(false);
    }, 150); // Small delay to allow clicking
    setDropdownTimeout(timeout);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  return (
    <nav className="bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/"
            className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity duration-200 group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 mr-2 md:mr-3 rounded-full overflow-hidden bg-black group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Image
                src="/final.png"
                alt="Akeno Tech Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="group-hover:translate-x-1 transition-transform duration-300">
              <span className="text-white text-lg md:text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-500">Akeno</span>
              <span className="text-white text-lg md:text-xl font-light ml-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-500">Tech</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => handleNavigation('areas-of-expertise')}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Services
              </button>
              <button
                onClick={() => handleNavigation('technologies-tools')}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Technologies
              </button>
              <button
                onClick={() => handleNavigation('highlighted-use-cases')}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Case Studies
              </button>
              <button
                onClick={() => handleNavigation('testimonials')}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Testimonials
              </button>
              <button
                onClick={handleContactClick}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Contact
              </button>
              
              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                  className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  Resources
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isResourcesDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-20 bg-gray-800 rounded-md shadow-lg py-1 z-50 transform translate-x-4"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <Link
                      href="/blog"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200 text-center"
                      onClick={() => setIsResourcesDropdownOpen(false)}
                    >
                      Blog
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={handleContactClick}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-600"
            >
              Get a Free Consultation
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300 p-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              <svg className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="md:hidden relative z-50">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700 animate-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  handleNavigation('areas-of-expertise');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Services
              </button>
              <button
                onClick={() => {
                  handleNavigation('technologies-tools');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Technologies
              </button>
              <button
                onClick={() => {
                  handleNavigation('highlighted-use-cases');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Case Studies
              </button>
              <button
                onClick={() => {
                  handleNavigation('testimonials');
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Testimonials
              </button>
              <button
                onClick={handleContactClick}
                className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Contact
              </button>
              
              {/* Resources Section in Mobile Menu */}
              <div className="px-3 py-2">
                <div className="text-white text-base font-medium mb-2">Resources</div>
                <Link
                  href="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-1 rounded-md text-sm font-medium"
                >
                  Blog
                </Link>
              </div>
              <button
                onClick={handleContactClick}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-base font-medium mt-4 border border-gray-600"
              >
                Get a Free Consultation
              </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
