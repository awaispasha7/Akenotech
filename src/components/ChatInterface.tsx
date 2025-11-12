'use client';

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '../config/api';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{id: string, type: 'user' | 'assistant', content: string, isTyping?: boolean}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isWelcomeTyping, setIsWelcomeTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simple typing effect using state
  const [typingText, setTypingText] = useState('');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);

  const startTypingEffect = (messageId: string, fullText: string, speed: number = 25, isWelcome: boolean = false) => {
    setTypingMessageId(messageId);
    setTypingText('');
    
    // Set welcome typing state if this is the welcome message
    if (isWelcome) {
      setIsWelcomeTyping(true);
    }
    
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypingText(fullText.substring(0, currentIndex));
        currentIndex++;
        scrollToBottom();
      } else {
        clearInterval(typeInterval);
        setTypingMessageId(null);
        setTypingText('');
        // Mark message as no longer typing
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, isTyping: false } : msg
        ));
        // Clear welcome typing state if this was the welcome message
        if (isWelcome) {
          setIsWelcomeTyping(false);
        }
      }
    }, speed);
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add typing effect to welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = `**Hi! I'm Aken from Akeno Tech**

I'm your **AI Solutions Expert**! I specialize in transforming businesses with cutting-edge AI technology. From custom AI models to intelligent automation, I help companies unlock their full potential through innovative solutions.

**What I Can Help You With:**

**Custom AI Solutions** - Tailored AI models for your specific business needs
**AI Integration** - Seamless deployment and integration services  
**Project Showcase** - See our successful AI implementations
**Transparent Pricing** - Clear, upfront costs for AI development

**Ready to transform your business with AI? Let's chat!**`;

      const welcomeMessage = {
        id: 'welcome-' + Date.now(),
        type: 'assistant' as const,
        content: welcomeText,
        isTyping: true
      };

      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Start typing effect after message is rendered
  useEffect(() => {
    if (messages.length === 1 && messages[0].isTyping) {
      const message = messages[0];
      // Start typing effect after a short delay - mark as welcome message
      setTimeout(() => {
        startTypingEffect(message.id, message.content, 20, true);
      }, 500);
    }
  }, [messages]);


  const handleSendMessage = async () => {
    if (!inputValue.trim() || isWelcomeTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Hit your backend chat API
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          session_id: `nextjs_session_${Date.now()}` // Generate session ID for Next.js frontend
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: data.response,
        isTyping: true
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Start typing effect after a short delay
      startTypingEffect(assistantMessage.id, data.response, 25);
    } catch (error) {
      console.error('Error:', error);
      
      // Determine error message based on error type
      let errorContent = "Sorry, I encountered an error. Please try again or contact us directly at ask@akenotech.com";
      
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          errorContent = "The AI service is temporarily unavailable. Please try again in a few moments or contact us at ask@akenotech.com";
        } else if (error.message.includes('404')) {
          errorContent = "The chat service endpoint was not found. Please contact us at ask@akenotech.com";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorContent = "Network connection issue. Please check your internet connection and try again.";
        }
      }
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: errorContent,
        isTyping: true
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Start typing effect for error message
      startTypingEffect(errorMessage.id, errorMessage.content, 25);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isWelcomeTyping) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleScheduleClick = () => {
    onClose(); // Close the chatbot first
    router.push('/schedule');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Chat Interface */}
      <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-auto sm:right-4 md:right-8 bottom-4 sm:bottom-16 z-50 w-auto sm:w-96 md:w-[28rem] max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-9rem)] flex flex-col animate-in slide-in-from-right-5 duration-300">
        {/* Chat Window */}
        <div className="relative bg-[#0a0a0a] rounded-lg shadow-xl w-full h-full flex flex-col border border-[#1a1a1a]">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#1a1a1a] bg-[#0a0a0a] rounded-t-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/final.png"
                alt="Akeno Tech Logo"
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-lg"
              />
              <div>
                <h3 className="font-medium text-white text-xs sm:text-sm">Akeno Tech</h3>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleScheduleClick}
                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] text-white text-xs rounded-md hover:from-[#3a3a3a] hover:to-[#4a4a4a] transition-all font-medium"
              >
                <span className="hidden sm:inline">Schedule Consultation</span>
                <span className="sm:hidden">Schedule</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto bg-[#0a0a0a]">
            <div className="space-y-4 sm:space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-lg ${
                        message.type === 'user'
                          ? 'bg-[#2a2a2a]/90 text-white border border-[#3a3a3a]/50 backdrop-blur-sm'
                          : 'bg-[#1a1a1a]/90 text-white border border-[#2a2a2a]/50 backdrop-blur-sm'
                      }`}
                    >
                      {message.type === 'assistant' && message.isTyping ? (
                        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          <span 
                            dangerouslySetInnerHTML={{
                              __html: typingMessageId === message.id ? 
                                typingText
                                  .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #9ca3af; font-weight: 700;">$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em style="color: #ffffff; font-weight: 600;">$1</em>') 
                                : ''
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="text-xs sm:text-sm leading-relaxed whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #9ca3af; font-weight: 700;">$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em style="color: #ffffff; font-weight: 600;">$1</em>')
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a1a1a]/90 text-white border border-[#2a2a2a]/50 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl backdrop-blur-sm shadow-lg">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm text-gray-300">Aken is typing</span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-6 border-t border-[#1a1a1a] bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a]">
            {isWelcomeTyping && (
              <div className="mb-3 flex items-center gap-2 text-xs text-gray-400">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Aken is introducing himself...</span>
              </div>
            )}
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isWelcomeTyping ? "Please wait while Aken introduces himself..." : "Ask me anything about AI solutions..."}
                disabled={isWelcomeTyping}
                className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-[#2a2a2a] rounded-xl bg-[#1a1a1a]/80 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 text-sm sm:text-base transition-all duration-300 hover:border-[#3a3a3a] ${isWelcomeTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isWelcomeTyping}
                className="px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] text-white rounded-xl hover:from-[#3a3a3a] hover:to-[#4a4a4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gray-500/25 transform hover:scale-105 disabled:transform-none"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
