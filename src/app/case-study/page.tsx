'use client';

import Image from 'next/image';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Loading component for better UX
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  );
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export default function CaseStudyPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Trigger main animation
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Staggered animation for individual elements
    const elementTimers = [0, 1, 2, 3, 4, 5].map((index) => 
      setTimeout(() => {
        setAnimatedElements(prev => [...prev, index]);
      }, 300 + (index * 150))
    );

    return () => {
      clearTimeout(timer);
      elementTimers.forEach(clearTimeout);
    };
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save form data to Firebase Firestore
      const docRef = await addDoc(collection(db, 'caseStudySubmissions'), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        caseStudy: 'BookYolo',
        submittedAt: serverTimestamp(),
        source: 'Case Study Page'
      });
      
      console.log('Document written with ID: ', docRef.id);
      
      // Open the BookYolo PDF in a new tab
      window.open('/Bookyolo.pdf', '_blank');
      
      // Show success message
      alert('Case study downloaded! The PDF has opened in a new tab.');
      setFormData({ firstName: '', lastName: '', phone: '', email: '' });
    } catch (error) {
      console.error('Error submitting form to Firebase:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-screen bg-gray-900">
        {/* Navbar-style logo at top */}
        <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/akeno-tech.png" 
                alt="Akeno Tech Logo" 
                width={120}
                height={40}
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-white">Akeno Tech</span>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
            >
              Go Back
            </button>
          </div>
        </nav>
        
        {/* Main content area */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Text Content */}
            <div className={`space-y-8 transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <div>
                <h1 className="text-3xl font-bold text-white mb-4">BookYolo</h1>
                <p className="text-base text-gray-300 mb-4 leading-relaxed">
                  AI engine that decodes patterns in short‑term rental listings to reveal hidden risks and real strengths.
                </p>
                <p className="text-base text-gray-300 mb-4 leading-relaxed">
                  Surfaces complaints, overselling, bias, skipped reviews, and sentiment shifts for confident bookings.
                </p>
                <p className="text-base text-gray-300 mb-4 leading-relaxed">
                  Simple chat UX: paste an Airbnb URL, get a structured deep inspection, ask follow‑up questions.
                </p>
                <p className="text-base text-gray-300 mb-4 leading-relaxed">
                  How Akeno Tech helped:
                </p>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">AI pattern recognition engine</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">Sentiment analysis for reviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">Chat interface development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">Risk assessment algorithms</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">The Challenge</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Travelers needed better insights into rental listings to avoid hidden risks and make confident bookings.
                  </p>
                </div>

                <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">The Solution</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    We developed AI algorithms to analyze rental patterns, detect bias, and surface hidden risks through simple chat interface.
                  </p>
                </div>

                <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">The Results</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    95% accuracy in risk detection, 80% reduction in booking regrets, and 3x faster decision making.
                  </p>
                </div>
              </div>
              
            </div>

            {/* Right Column - Form */}
            <div className={`transition-all duration-1000 delay-300 transform ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <div className="group relative bg-gray-900 rounded-3xl p-10 border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02] overflow-hidden w-full max-w-2xl mx-auto">
                {/* Enhanced form background glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/8 to-blue-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Enhanced animated border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                {/* BookYolo Image at top of form with better spacing */}
                <div className="mb-8">
                  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
                    <Image 
                      src="/BookYOLO.png" 
                      alt="BookYolo Logo" 
                      width={400}
                      height={200}
                      className="w-full h-full object-cover rounded-xl"
                      priority
                    />
                  </div>
                </div>
                
                {/* Enhanced Form Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 rounded-2xl mb-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-xl">BY</span>
                      </div>
                      <div className="text-white">
                        <div className="font-bold text-xl tracking-wide">BOOKYOLO</div>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-white text-2xl font-bold mb-6 leading-tight">
                    Transform Your Reading Experience With The Power Of AI
                  </h2>
                  <div className="flex items-center justify-end">
                    <div className="text-white text-right">
                      <div className="text-sm opacity-90 font-medium">AI-Powered Reading</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Form Content with better spacing */}
                <div className="p-8 relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* First Name Field */}
                    <div className="group/field">
                      <label htmlFor="firstName" className="block text-white text-sm font-semibold mb-3 group-hover/field:text-purple-300 transition-colors duration-300">
                        First Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          required
                          className="w-full px-5 py-4 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400 backdrop-blur-sm text-base"
                        />
                        {/* Enhanced input glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Last Name Field */}
                    <div className="group/field">
                      <label htmlFor="lastName" className="block text-white text-sm font-semibold mb-3 group-hover/field:text-purple-300 transition-colors duration-300">
                        Last Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          required
                          className="w-full px-5 py-4 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400 backdrop-blur-sm text-base"
                        />
                        {/* Enhanced input glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    
                    {/* Phone Number Field */}
                    <div className="group/field">
                      <label htmlFor="phone" className="block text-white text-sm font-semibold mb-3 group-hover/field:text-purple-300 transition-colors duration-300">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          required
                          className="w-full px-5 py-4 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400 backdrop-blur-sm text-base"
                        />
                        {/* Enhanced input glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    
                    {/* Business Email Field */}
                    <div className="group/field">
                      <label htmlFor="email" className="block text-white text-sm font-semibold mb-3 group-hover/field:text-purple-300 transition-colors duration-300">
                        Business Email *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your business email"
                          required
                          className="w-full px-5 py-4 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400 backdrop-blur-sm text-base"
                        />
                        {/* Enhanced input glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group/btn relative bg-white text-black px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden w-full"
                      >
                        {/* Enhanced button background animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Button content */}
                        <span className="relative z-10 group-hover/btn:text-gray-800 transition-colors duration-300">
                          {isSubmitting ? 'Downloading...' : 'Download Case Study'}
                        </span>

                        {/* Enhanced shimmer effect */}
                        <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                        
                        {/* Enhanced floating particles on hover */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full opacity-0 group-hover/btn:opacity-100 transition-all duration-300 group-hover/btn:animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover/btn:opacity-100 transition-all duration-300 group-hover/btn:animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
