'use client';

import ChatInterface from './ChatInterface';

interface ChatBotButtonProps {
  className?: string;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export default function ChatBotButton({ className = '', isChatOpen, setChatOpen }: ChatBotButtonProps) {
  const toggleChatBot = () => {
    setChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Floating Chat Bot Button - Only visible when chat is closed */}
      {!isChatOpen && (
        <button
          onClick={toggleChatBot}
          className={`fixed right-4 sm:right-8 bottom-8 z-50 flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-4 bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] hover:from-[#1a1a1a] hover:to-[#2a2a2a] text-white font-semibold rounded-2xl shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-[#2a2a2a]/20 ${className}`}
          aria-label="Open chat bot"
        >
        {/* Chat Bot Icon */}
        <img
          src="/final.png"
          alt="Akeno Tech Logo"
          className="w-6 h-6 object-contain rounded-lg"
        />
        
        {/* Button Text */}
        <span className="text-white font-semibold text-sm sm:text-base">Ask Aken</span>
        </button>
      )}

      {/* Chat Interface */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
