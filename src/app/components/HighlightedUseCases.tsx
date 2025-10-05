'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UseCase {
  title: string;
  challenge: string;
  solution: string;
  outcome: string;
  backgroundImage: string;
  stripeColor: string;
  stripeText: string;
  companyName: string;
}

interface HighlightedUseCasesProps {}

const HighlightedUseCases: React.FC<HighlightedUseCasesProps> = (): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<number[]>([]);
  const [loadingStates, setLoadingStates] = useState<{[key: number]: boolean}>({});
  const router = useRouter();

  const useCases: UseCase[] = useMemo(() => [
    {
      title: "AI Email Engine",
      challenge: "High manual handling time and error rate.",
      solution: "LLM-based extraction + validation pipeline with human-in-the-loop for edge cases.",
      outcome: "63% reduction in handling time; accuracy > 98% on structured docs.",
      backgroundImage: "/booookyolo1.jpg",
      stripeColor: "bg-purple-600",
      stripeText: "CW Closed Won",
      companyName: "BookYolo"
    },
    {
      title: "AI Helpdesk System",
      challenge: "Slow response to repetitive internal queries.",
      solution: "RAG over SOPs, tickets, and logs with usage analytics and guardrails.",
      outcome: "~40% faster first response; deflected ~55% of Tier-1 tickets.",
      backgroundImage: "/case1.jpg",
      stripeColor: "bg-green-500",
      stripeText: "SP FieldCall.ai",
      companyName: "FieldCall.ai"
    },
    {
      title: "Livekit Voice Agent",
      challenge: "Complex, flow-based customer support needs.",
      solution: "Dynamic, real-time conversational AI system with multi-voice capabilities.",
      outcome: "Robust, intelligent and flexible support infrastructure.",
      backgroundImage: "/case1.jpg",
      stripeColor: "bg-blue-600",
      stripeText: "LK Livekit",
      companyName: "Livekit Voice Agent"
    }
  ], []);

  useEffect(() => {
    // Trigger main animation
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Staggered animation for individual cards
    const cardTimers = useCases.map((_, index) => 
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
    <section id="highlighted-use-cases" className="bg-black py-20 relative overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title with CTA */}
        <div className={`relative mb-12 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Featured Case Studies
          </h2>
          <a 
            href="#contact" 
            className="absolute top-0 right-0 text-blue-400 hover:text-blue-300 text-lg font-medium transition-colors duration-200 hover:underline hidden md:block"
          >
            Discuss your project →
          </a>
          <div className="text-center md:hidden">
            <a 
              href="#contact" 
              className="text-blue-400 hover:text-blue-300 text-lg font-medium transition-colors duration-200 hover:underline"
            >
              Discuss your project →
            </a>
          </div>
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 ${
                animatedCards.includes(index) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
          style={{
            transitionDelay: `${index * 200}ms`,
            aspectRatio: '3/4',
            maxWidth: '350px',
            width: '100%',
            minHeight: '450px',
            height: '450px',
            margin: '0 auto'
          }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image 
                  src={
                    useCase.companyName === 'FieldCall.ai' 
                      ? '/hello2.jpg' 
                      : useCase.companyName === 'Livekit Voice Agent' 
                        ? '/assistant.png' 
                        : useCase.backgroundImage
                  } 
                  alt={useCase.title}
                  fill
                  className={
                    useCase.companyName === 'FieldCall.ai' 
                      ? 'object-cover [object-position:50%_-10px]' 
                      : 'object-cover'
                  }
                />
                {/* Light overlay for subtle text readability */}
                <div className="absolute inset-0 bg-black/20"></div>
              </div>


              {/* Bottom Section with Stripe-like Design */}
              <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* Stripe-like Text Section with Background Visible */}
                <div className={`bg-gray-800/70 backdrop-blur-sm border-t border-gray-600/50 ${
                  useCase.companyName === 'FieldCall.ai' ? 'p-2 pt-1' : 'p-4'
                }`}>
                  <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300 drop-shadow-lg text-center">
                    {useCase.companyName}
                  </h3>
                  
                  <p className="text-gray-200 text-sm mb-4 leading-relaxed group-hover:text-white transition-colors duration-300 drop-shadow-md">
                    {useCase.companyName === 'FieldCall.ai' 
                      ? 'AI-powered field service management platform for contractors. Streamlines operations and enhances customer communication. Helps field service businesses scale efficiently.'
                      : useCase.companyName === 'Livekit Voice Agent'
                        ? 'Engineered a Livekit Voice Agent, a dynamic, real-time conversational AI system. Designed for complex, flow-based customer support with multi-voice capabilities.'
                        : 'AI-powered rental listing analyzer that uncovers hidden risks and strengths. Identifies complaints, bias, and sentiment changes for confident booking decisions. Simple chat interface for structured inspections.'
                    }
                  </p>
                </div>
                
                {/* Case Study Button Section with Background Visible */}
                <div className="bg-gray-900/60 backdrop-blur-sm p-4 relative z-30">
                  <button 
                    onClick={async () => {
                      console.log('Button clicked! Navigating to case-study...', useCase.companyName);
                      setLoadingStates(prev => ({ ...prev, [index]: true }));
                      try {
                        // Navigate to different case study pages based on company - all open in same tab
                        if (useCase.companyName === 'BookYolo') {
                          console.log('Navigating to BookYolo case study');
                          window.location.href = '/case-study/bookyolo';
                        } else if (useCase.companyName === 'FieldCall.ai') {
                          console.log('Navigating to FieldCall.ai case study');
                          window.location.href = '/case-study/fieldcall-ai';
                        } else if (useCase.companyName === 'Livekit Voice Agent') {
                          console.log('Navigating to Livekit Voice Agent case study');
                          window.location.href = '/case-study/livekit-voice-agent';
                        } else {
                          console.log('Default navigation to BookYolo');
                          window.location.href = '/case-study/bookyolo';
                        }
                      } catch (error) {
                        console.error('Navigation error:', error);
                        setLoadingStates(prev => ({ ...prev, [index]: false }));
                      }
                    }}
                    disabled={loadingStates[index]}
                    className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-xl text-base border-2 cursor-pointer ${
                      loadingStates[index] 
                        ? 'bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed' 
                        : 'bg-black hover:bg-gray-800 text-white border-gray-700'
                    }`}
                  >
                    <span>{loadingStates[index] ? 'Loading...' : 'Read Case Study'}</span>
                    <div className="w-5 h-5 relative">
                      {/* Arrow icon made of squares */}
                      <div className="absolute top-0 left-0 w-2 h-2 bg-white"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 bg-white"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 bg-white"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-white"></div>
                      {/* Missing top-right square creates arrow effect */}
                      <div className="absolute top-0 right-0 w-2 h-2 bg-black"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Hover effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Floating particles on hover */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightedUseCases;
