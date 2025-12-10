'use client';

import Image from 'next/image';

import { Suspense, useEffect, useState, useCallback } from 'react';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { db } from '@/lib/firebase';

import emailjs from '@emailjs/browser';



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

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [focusMode, setFocusMode] = useState(false);

  const [currentFocusField, setCurrentFocusField] = useState<string>('firstName');

  const [showThankYou, setShowThankYou] = useState(false);





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

    

    // Clear error for this field when user starts typing

    if (errors[name as keyof typeof errors]) {

      setErrors(prev => ({

        ...prev,

        [name]: ''

      }));

    }

    

    // Special validation for phone field - show error immediately if non-numeric characters

    if (name === 'phone' && value.trim() !== '' && !/^[0-9]+$/.test(value)) {

      setErrors(prev => ({

        ...prev,

        phone: 'Please enter correct number'

      }));

    }



    // Focus mode auto-advance logic

    if (focusMode && name === currentFocusField) {

      const fieldOrder = ['firstName', 'lastName', 'email', 'phone'];

      const currentIndex = fieldOrder.indexOf(name);

      

      // Check if current field is valid and has content

      let isCurrentFieldValid = false;

      if (name === 'firstName' || name === 'lastName') {

        isCurrentFieldValid = value.trim() !== '';

      } else if (name === 'phone') {

        isCurrentFieldValid = value.trim() !== '' && /^[0-9]+$/.test(value);

      } else if (name === 'email') {

        isCurrentFieldValid = value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      }

      

      // If current field is valid and there's a next field, move to it

      if (isCurrentFieldValid && currentIndex < fieldOrder.length - 1) {

        const nextField = fieldOrder[currentIndex + 1];

        setCurrentFocusField(nextField);

        // Focus the next field after a short delay

        setTimeout(() => {

          const nextInput = document.getElementById(nextField) as HTMLInputElement;

          if (nextInput) {

            nextInput.focus();

          }

        }, 100);

      }

    }

  }, [errors, focusMode, currentFocusField]);



  const handleFieldFocus = useCallback((e: React.FocusEvent<HTMLInputElement>): void => {

    const { name } = e.target;

    

    // Check if we should show validation for this field when user focuses on it

    const newErrors: {[key: string]: string} = {};

    

    // Check fields in order and show only the first error

    if (!formData.firstName || formData.firstName.trim() === '') {

      newErrors.firstName = 'Please enter your first name';

    } else if (!formData.lastName || formData.lastName.trim() === '') {

      newErrors.lastName = 'Please enter your last name';

    } else if (!formData.email || formData.email.trim() === '') {

      newErrors.email = 'Please enter your business email';

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {

      newErrors.email = 'Please enter a valid email address';

    } else if (!formData.phone || formData.phone.trim() === '') {

      newErrors.phone = 'Please enter your phone number';

    } else if (!/^[0-9]+$/.test(formData.phone)) {

      newErrors.phone = 'Please enter correct number';

    }

    

    // Only set errors if there are any

    if (Object.keys(newErrors).length > 0) {

      setErrors(newErrors);

    }

  }, [formData]);



  const handleFocusModeToggle = useCallback((): void => {

    setFocusMode(true);

    setCurrentFocusField('firstName');

    // Focus the first name field

    setTimeout(() => {

      const firstNameInput = document.getElementById('firstName') as HTMLInputElement;

      if (firstNameInput) {

        firstNameInput.focus();

      }

    }, 100);

  }, []);



  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {

    e.preventDefault();

    

    // Clear any previous errors first

    setErrors({});

    

    // Validate fields one by one - show only the first empty field error

    const newErrors: {[key: string]: string} = {};

    

    // Check fields in order and show only the first error

    if (!formData.firstName || formData.firstName.trim() === '') {

      newErrors.firstName = 'Please enter your first name';

    } else if (!formData.lastName || formData.lastName.trim() === '') {

      newErrors.lastName = 'Please enter your last name';

    } else if (!formData.email || formData.email.trim() === '') {

      newErrors.email = 'Please enter your business email';

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {

      newErrors.email = 'Please enter a valid email address';

    } else if (!formData.phone || formData.phone.trim() === '') {

      newErrors.phone = 'Please enter your phone number';

    } else if (!/^[0-9]+$/.test(formData.phone)) {

      newErrors.phone = 'Please enter correct number';

    }

    

    // If there are any validation errors, show only the first one and stop

    if (Object.keys(newErrors).length > 0) {

      setErrors(newErrors);

      // Scroll to the first empty field when there are validation errors

      setTimeout(() => {

        // Find the first field that has an error (which means it's empty or invalid)

        const fieldOrder = ['firstName', 'lastName', 'email', 'phone'];

        let firstEmptyField = null;

        

        for (const fieldName of fieldOrder) {

          if (newErrors[fieldName]) {

            firstEmptyField = fieldName;

            break;

          }

        }

        

        // If we found an empty field, scroll to it

        if (firstEmptyField) {

          const fieldElement = document.getElementById(firstEmptyField);

          if (fieldElement) {

            fieldElement.scrollIntoView({ 

              behavior: 'smooth', 

              block: 'center' 

            });

            fieldElement.focus();

          }

        }

      }, 100);

      return;

    }

    

    setIsSubmitting(true);

    

    try {

      // Save form data to Firebase Firestore

      const docRef = await addDoc(collection(db, 'caseStudySubmissions'), {

        firstName: formData.firstName,

        lastName: formData.lastName,

        phone: formData.phone,

        email: formData.email,

        caseStudy: 'Stories We Tell',

        submittedAt: serverTimestamp(),

        source: 'Case Study Page'

      });

      

      console.log('Document written with ID: ', docRef.id);

      

      // Open the Stories We Tell PDF in a new tab

      window.open('/Stories-we-tell-case-study.pdf', '_blank');

      

      // Send EmailJS notification

      try {

        const serviceId = 'service_4yz4k76';

        const templateId = 'template_xhb8548';

        const publicKey = 'Id7n5AZzArVL9Zys_';



        const templateParams = {

          from_name: `${formData.firstName} ${formData.lastName}`,

          from_email: formData.email,

          company: 'Stories We Tell Case Study Download',

          message: `Case Study Download Details:

          

Name: ${formData.firstName} ${formData.lastName}

Email: ${formData.email}

Phone: ${formData.phone}

Case Study: Stories We Tell

Downloaded At: ${new Date().toLocaleString()}



This user has downloaded the Stories We Tell case study and their information has been saved to Firebase.`

        };



        await emailjs.send(serviceId, templateId, templateParams, publicKey);

        console.log('EmailJS notification sent successfully');

      } catch (emailError) {

        console.error('EmailJS notification failed:', emailError);

        // Don't show error to user as the main functionality (PDF download) worked

      }

      

      // Show thank you message at bottom of form

      setShowThankYou(true);

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

                src="/swt-logo.svg" 

                alt="Stories We Tell Logo" 

                width={40}

                height={40}

                priority

                placeholder="blur"

                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="

                className="rounded-full"

              />

              <span className="text-xl font-semibold text-white">Stories We Tell</span>

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

                <h1 className="text-3xl font-bold text-white mb-4">Stories We Tell</h1>

                <p className="text-base text-gray-300 mb-4 leading-relaxed">

                  AI-powered cinematic intake chatbot that transforms conversations into structured story elements through intelligent natural language processing.

                </p>

                <p className="text-base text-gray-300 mb-4 leading-relaxed">

                  Helps writers and content creators develop their narratives by extracting characters, themes, locations, and plot points from conversational interactions.

                </p>

                <p className="text-base text-gray-300 mb-4 leading-relaxed">

                  How Akeno Tech helped:

                </p>

                <ul className="space-y-2 text-gray-300 mb-6">

                  <li className="flex items-start">

                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>

                    <span className="text-sm">AI-powered conversation analysis</span>

                  </li>

                  <li className="flex items-start">

                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>

                    <span className="text-sm">Automatic story element extraction</span>

                  </li>

                  <li className="flex items-start">

                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>

                    <span className="text-sm">Real-time dossier generation</span>

                  </li>

                  <li className="flex items-start">

                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>

                    <span className="text-sm">Intelligent character and plot development</span>

                  </li>

                </ul>

                

                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">

                  <h3 className="text-lg font-semibold text-white mb-3">The Challenge</h3>

                  <p className="text-sm text-gray-300 leading-relaxed">

                    Writers and content creators needed a way to capture and structure their story ideas from natural conversations, automatically extracting key narrative elements without manual organization.

                  </p>

                </div>



                <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">

                  <h3 className="text-lg font-semibold text-white mb-3">The Solution</h3>

                  <p className="text-sm text-gray-300 leading-relaxed">

                    We developed an AI-powered chatbot that analyzes conversations in real-time, automatically extracting characters, themes, locations, and plot points into a structured dossier system.

                  </p>

                </div>



                <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-700/30">

                  <h3 className="text-lg font-semibold text-white mb-3">The Results</h3>

                  <p className="text-sm text-gray-300 leading-relaxed">

                    95% accuracy in story element extraction, 80% reduction in manual organization time, and 3x faster story development workflow.

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

                

                {/* Stories We Tell Image at top of form with better spacing */}

                <div className="mb-8">

                  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">

                    <Image 

                      src="/stories-we-tell-hero.png" 

                      alt="Stories We Tell Hero" 

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

                        <span className="text-white font-bold text-xl">SW</span>

                      </div>

                      <div className="text-white">

                        <div className="font-bold text-xl tracking-wide">STORIES WE TELL</div>

                      </div>

                    </div>

                  </div>

                  <h2 className="text-white text-2xl font-bold mb-6 leading-tight">

                    Transform Your Story Development With AI-Powered Conversations

                  </h2>

                  <div className="flex items-center justify-end">

                    <div className="text-white text-right">

                      <div className="text-sm opacity-90 font-medium">AI-Powered Story Development</div>

                    </div>

                  </div>

                </div>



                {/* Enhanced Form Content with better spacing */}

                <div className="p-8 relative z-10">

                  <form onSubmit={handleSubmit} className="space-y-8">

                    {/* First Name Field */}

                    <div className={`group/field transition-all duration-300 ${

                      focusMode && currentFocusField === 'firstName' ? 'ring-2 ring-green-500/50 rounded-xl p-2 bg-green-500/10' : ''

                    }`}>

                      <label htmlFor="firstName" className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${

                        focusMode && currentFocusField === 'firstName' 

                          ? 'text-green-300' 

                          : 'text-white group-hover/field:text-purple-300'

                      }`}>

                        First Name * {focusMode && currentFocusField === 'firstName' && '🎯'}

                      </label>

                      <div className="relative">

                        <input

                          type="text"

                          id="firstName"

                          name="firstName"

                          value={formData.firstName}

                          onChange={handleInputChange}

                          onFocus={handleFieldFocus}

                          placeholder="Enter your first name"

                          className={`w-full px-5 py-4 bg-gray-800/80 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400 backdrop-blur-sm text-base ${

                            errors.firstName && errors.firstName.trim() !== '' ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'

                          }`}

                        />

                        {/* Enhanced input glow effect */}

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      </div>

                      {errors.firstName && errors.firstName.trim() !== '' && (

                        <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">

                          <div className="flex items-center">

                            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center mr-2 flex-shrink-0">

                              <span className="text-white text-xs font-bold">!</span>

                            </div>

                            <span className="text-gray-800 text-sm font-medium">{errors.firstName}</span>

                          </div>

                        </div>

                      )}

                      

                    </div>



                    {/* Last Name Field */}

                    <div className={`group/field transition-all duration-300 ${

                      focusMode && currentFocusField === 'lastName' ? 'ring-2 ring-green-500/50 rounded-xl p-2 bg-green-500/10' : ''

                    }`}>

                      <label htmlFor="lastName" className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${

                        focusMode && currentFocusField === 'lastName' 

                          ? 'text-green-300' 

                          : 'text-white group-hover/field:text-purple-300'

                      }`}>

                        Last Name * {focusMode && currentFocusField === 'lastName' && '🎯'}

                      </label>

                      <div className="relative">

                        <input

                          type="text"

                          id="lastName"

                          name="lastName"

                          value={formData.lastName}

                          onChange={handleInputChange}

                          onFocus={handleFieldFocus}

                          placeholder="Enter your last name"

                          className={`w-full px-5 py-4 bg-gray-800/80 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400 backdrop-blur-sm text-base ${

                            errors.lastName && errors.lastName.trim() !== '' ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'

                          }`}

                        />

                        {/* Enhanced input glow effect */}

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      </div>

                      {errors.lastName && errors.lastName.trim() !== '' && (

                        <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">

                          <div className="flex items-center">

                            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center mr-2 flex-shrink-0">

                              <span className="text-white text-xs font-bold">!</span>

                            </div>

                            <span className="text-gray-800 text-sm font-medium">{errors.lastName}</span>

                          </div>

                        </div>

                      )}

                    </div>

                    

                    {/* Business Email Field */}

                    <div className={`group/field transition-all duration-300 ${

                      focusMode && currentFocusField === 'email' ? 'ring-2 ring-green-500/50 rounded-xl p-2 bg-green-500/10' : ''

                    }`}>

                      <label htmlFor="email" className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${

                        focusMode && currentFocusField === 'email' 

                          ? 'text-green-300' 

                          : 'text-white group-hover/field:text-purple-300'

                      }`}>

                        Business Email * {focusMode && currentFocusField === 'email' && '🎯'}

                      </label>

                      <div className="relative">

                        <input

                          type="text"

                          id="email"

                          name="email"

                          value={formData.email}

                          onChange={handleInputChange}

                          onFocus={handleFieldFocus}

                          placeholder="Enter your business email"

                          className={`w-full px-5 py-4 bg-gray-800/80 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400 backdrop-blur-sm text-base ${

                            errors.email && errors.email.trim() !== '' ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'

                          }`}

                        />

                        {/* Enhanced input glow effect */}

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      </div>

                      {errors.email && errors.email.trim() !== '' && (

                        <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">

                          <div className="flex items-center">

                            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center mr-2 flex-shrink-0">

                              <span className="text-white text-xs font-bold">!</span>

                            </div>

                            <span className="text-gray-800 text-sm font-medium">{errors.email}</span>

                          </div>

                        </div>

                      )}

                    </div>

                    

                    {/* Phone Number Field */}

                    <div className={`group/field transition-all duration-300 ${

                      focusMode && currentFocusField === 'phone' ? 'ring-2 ring-green-500/50 rounded-xl p-2 bg-green-500/10' : ''

                    }`}>

                      <label htmlFor="phone" className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${

                        focusMode && currentFocusField === 'phone' 

                          ? 'text-green-300' 

                          : 'text-white group-hover/field:text-purple-300'

                      }`}>

                        Phone Number * {focusMode && currentFocusField === 'phone' && '🎯'}

                      </label>

                      <div className="relative">

                        <input

                          type="tel"

                          id="phone"

                          name="phone"

                          value={formData.phone}

                          onChange={handleInputChange}

                          onFocus={handleFieldFocus}

                          placeholder="Enter your phone number"

                          className={`w-full px-5 py-4 bg-gray-800/80 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-gray-600 group-hover/field:border-purple-400 backdrop-blur-sm text-base ${

                            errors.phone && errors.phone.trim() !== '' ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'

                          }`}

                        />

                        {/* Enhanced input glow effect */}

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      </div>

                      {errors.phone && errors.phone.trim() !== '' && (

                        <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">

                          <div className="flex items-center">

                            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center mr-2 flex-shrink-0">

                              <span className="text-white text-xs font-bold">!</span>

                            </div>

                            <span className="text-gray-800 text-sm font-medium">{errors.phone}</span>

                          </div>

                        </div>

                      )}

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

                  
                  
                  {/* Thank You Message */}

                  {showThankYou && (

                    <div className="mt-8 p-6 bg-green-900/20 border border-green-700/30 rounded-xl">

                      <div className="text-center">

                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">

                          <span className="text-white text-2xl font-bold">✓</span>

                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>

                        <p className="text-green-300 text-sm">

                          Your case study has been downloaded successfully. The PDF has opened in a new tab.

                        </p>

                        <button

                          onClick={() => {

                            setShowThankYou(false);

                            setFormData({ firstName: '', lastName: '', phone: '', email: '' });

                            setErrors({});

                          }}

                          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors duration-300"

                        >

                          Submit Another Form

                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Suspense>

  );

}

