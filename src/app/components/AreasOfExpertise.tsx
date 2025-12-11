'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ExpertiseArea {
  title: string;
  description: string;
}

interface AreasOfExpertiseProps {}

const AreasOfExpertise: React.FC<AreasOfExpertiseProps> = React.memo((): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<number[]>([]);
  const [scrollAnimations, setScrollAnimations] = useState<{[key: string]: boolean}>({});
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Trigger main animation
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    // Staggered animation for individual cards
    const cardTimers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((index) => 
      setTimeout(() => {
        setAnimatedCards(prev => [...prev, index]);
      }, 400 + (index * 150))
    );

    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute('data-animation-id');
          if (elementId) {
            setScrollAnimations(prev => ({ ...prev, [elementId]: true }));
          }
        }
      });
    }, observerOptions);

    // Observe cards for scroll animations
    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => {
      clearTimeout(timer);
      cardTimers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  const expertiseAreas: ExpertiseArea[] = [
    {
      title: "Computer Vision & Visual AI",
      description: "• Detect, classify, segment, measure, or track objects, scenes, and behaviors in images/videos.\n\n• Applications: defect & quality inspection, object counting, inventory monitoring, CCTV analytics, OCR/document digitization, facial recognition, sports/player tracking, performance analytics."
    },
    {
      title: "Anomaly & Defect Detection",
      description: "• Identify unusual patterns, outliers, or faulty outputs in data or visuals.\n\n• Applications: manufacturing quality alerts, predictive maintenance, fraud detection, IoT/sensor anomaly alerts, safety monitoring."
    },
    {
      title: "Predictive Modeling & Forecasting",
      description: "• Predict future outcomes using historical or real-time data.\n\n• Applications: demand/sales forecasting, churn & risk scoring, predictive maintenance, financial forecasting, energy/time-series forecasting, inventory optimization."
    },
    {
      title: "Workflow & Process Automation",
      description: "• Automate business process steps using AI + RPA + integration.\n\n• Applications: email/ticket triaging, invoice/document processing, workflow orchestration, order handling, HR/admin automation, scheduling assistants, automated customer support."
    },
    {
      title: "Autonomous Task Agents & AI Assistants",
      description: "• Multi-step AI agents performing tasks, interacting with tools, or making decisions.\n\n• Applications: customer support, lead qualification, report generation, marketing automation, voice assistants, calling agents."
    },
    {
      title: "Natural Language Processing (NLP)",
      description: "• Understand, analyze, generate, or transform text-based data.\n\n• Applications: document classification, summarization, named entity recognition, sentiment analysis, question answering, translation/localization, text generation."
    },
    {
      title: "Speech & Voice AI",
      description: "• Process and respond to spoken audio.\n\n• Applications: voice bots, call transcription, automated IVR, voice search, content creation."
    },
    {
      title: "Multimodal AI (Text + Image + Audio)",
      description: "• Combine multiple input types for richer understanding.\n\n• Applications: visual question answering, image captioning, video summarization, document understanding, indexing."
    },
    {
      title: "Recommendation & Personalization Systems",
      description: "• Suggest best actions, content, or products based on user behavior or data.\n\n• Applications: personalized learning, product recommendations, targeted offers, media/content suggestions."
    },
    {
      title: "Optimization & Prescriptive Analytics",
      description: "• Recommend optimal actions or allocate resources efficiently.\n\n• Applications: supply chain/logistics optimization, pricing optimization, workforce scheduling, route planning, recommender systems."
    },
    {
      title: "Monitoring, Alerting & Control Systems",
      description: "• Real-time monitoring with automated notifications or actions.\n\n• Applications: equipment alerts, safety shutdowns, operational dashboards, threshold-based alerts."
    },
    {
      title: "Knowledge Retrieval & Semantic Search",
      description: "• AI-powered assistance to access and interpret information.\n\n• Applications: internal knowledge bots, FAQ automation, policy/document lookup, semantic search engines."
    },
    {
      title: "Summarization & Auto-Reporting",
      description: "• Convert long content into concise, actionable output.\n\n• Applications: KPI/operations reports, meeting summaries, legal/contract briefings, insight generation."
    },
    {
      title: "Content & Media Generation (Generative AI)",
      description: "• Auto-create text, images, audio, or video.\n\n• Applications: marketing copy, product visuals, social media posts, ad copy, synthetic datasets, style transfer."
    },
    {
      title: "AI Governance, Explainability & Compliance",
      description: "• Ensure AI decisions are interpretable, auditable, and compliant.\n\n• Applications: bias/fairness assessment, model interpretability, logging decisions, regulatory compliance, model audits."
    },
    {
      title: "Data Engineering, Integration & Pipeline Orchestration",
      description: "• Build pipelines for ingesting, cleaning, transforming, and delivering data.\n\n• Applications: ETL/ELT, real-time streaming, data quality checks, integration with enterprise systems (ERP, CRM, databases)."
    },
    {
      title: "Model Ops, Monitoring & Maintenance",
      description: "• Maintain AI model accuracy and performance in production.\n\n• Applications: model retraining triggers, drift detection, performance monitoring, A/B testing, scalable deployment (cloud, edge, hybrid)."
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
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              data-animation-id={`expertise-card-${index}`}
              className={`group relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden ${
                animatedCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              } ${
                scrollAnimations[`expertise-card-${index}`] ? 'animate-bounce' : ''
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                animationDelay: `${index * 100}ms`
              }}
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
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 group-hover:translate-x-2 group-hover:scale-[1.02] transition-all duration-500 transform whitespace-pre-line">
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
