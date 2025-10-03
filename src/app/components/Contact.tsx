'use client';

import { useEffect, useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import Image from 'next/image';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface ContactProps {}

const Contact: React.FC<ContactProps> = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: ''
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
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
      // EmailJS configuration
      const serviceId = 'service_yotvu3d';
      const templateId = 'template_uujhwhn';
      const publicKey = 'Id7n5AZzArVL9Zys_';

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Not provided',
        message: formData.message
      };

      console.log('Sending email with:', { serviceId, templateId, templateParams, publicKey });
      
      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log('EmailJS result:', result);
      if (result.status === 200) {
        alert('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        console.error('EmailJS error status:', result.status);
        alert('Failed to send message. Please try again or email us directly.');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error details:', error);
      
      // More detailed error information
      if (error && typeof error === 'object') {
        console.error('Error status:', error.status);
        console.error('Error text:', error.text);
      }
      
      alert(`Failed to send message: ${error?.text || error}. Please try again or email us directly.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <section id="contact" className="bg-black py-20 relative overflow-hidden">
      {/* Enhanced Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-pink-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Information */}
          <div className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            {/* Title with enhanced animation */}
            <div className={`transition-all duration-1000 transform ${
              animatedElements.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-500">
                Contact Us
              </h2>
            </div>
            
            {/* Subtitle with enhanced animation */}
            <div className={`transition-all duration-1000 delay-200 transform ${
              animatedElements.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
                Talk to our team about your project or challenge.
              </p>
            </div>

            <div className="space-y-8">
              {/* Company Info with enhanced animation */}
              <div className={`group transition-all duration-1000 delay-400 transform ${
                animatedElements.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-white text-lg font-semibold mb-4 group-hover:text-purple-300 transition-colors duration-300">
                  Akeno Tech Team
                </h3>
              </div>

              {/* Contact Details with enhanced animations */}
              <div className="space-y-6">
                <div className={`group flex items-center space-x-4 transition-all duration-1000 delay-500 transform ${
                  animatedElements.includes(3) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative overflow-hidden">
                    {/* Icon background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {/* Floating particle */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                  </div>
                  <a 
                    href="mailto:Ask@akenotech.com" 
                    className="text-white text-lg hover:text-purple-300 transition-all duration-300 hover:underline group-hover:translate-x-1"
                  >
                    Ask@akenotech.com
                  </a>
                </div>

                <div className={`group flex items-center space-x-4 transition-all duration-1000 delay-600 transform ${
                  animatedElements.includes(4) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative overflow-hidden">
                    {/* Icon background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {/* Floating particle */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
                  </div>
                  <a 
                    href="tel:(888) 324-6560" 
                    className="text-white text-lg hover:text-blue-300 transition-all duration-300 hover:underline group-hover:translate-x-1"
                  >
                    (888) 324-6560
                  </a>
                </div>
              </div>

              {/* Enhanced Decorative elements */}
              <div className={`pt-8 transition-all duration-1000 delay-800 transform ${
                animatedElements.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="flex space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className={`transition-all duration-1000 delay-300 transform ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            
            <div className="group relative bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105">
              {/* Form background glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Name Field */}
                <div className="group/field">
                  <label htmlFor="name" className="block text-white text-sm font-medium mb-2 group-hover/field:text-purple-300 transition-colors duration-300">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400"
                    />
                    {/* Input glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="group/field">
                  <label htmlFor="email" className="block text-white text-sm font-medium mb-2 group-hover/field:text-purple-300 transition-colors duration-300">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@company.com"
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400"
                    />
                    {/* Input glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Company Field */}
                <div className="group/field">
                  <label htmlFor="company" className="block text-white text-sm font-medium mb-2 group-hover/field:text-purple-300 transition-colors duration-300">
                    Company (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Company name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400"
                    />
                    {/* Input glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Message Field */}
                <div className="group/field">
                  <label htmlFor="message" className="block text-white text-sm font-medium mb-2 group-hover/field:text-purple-300 transition-colors duration-300">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project or challenge"
                      rows={5}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-gray-600 resize-none group-hover/field:border-purple-400"
                    />
                    {/* Input glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Submit Button and Alternative */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group/btn relative bg-white text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {/* Button background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Button content */}
                    <span className="relative z-10 group-hover/btn:text-gray-800 transition-colors duration-300">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>

                    {/* Enhanced shimmer effect */}
                    <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                    
                    {/* Floating particles on hover */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover/btn:opacity-100 transition-all duration-300 group-hover/btn:animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover/btn:opacity-100 transition-all duration-300 group-hover/btn:animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </button>

                  <a 
                    href="mailto:Ask@akenotech.com" 
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:underline text-sm group-hover:translate-x-1"
                  >
                    Or email us directly
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;