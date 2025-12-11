'use client';

import { usePathname } from 'next/navigation';
import ChatBotButton from './ChatBotButton';
import ChatInterface from './ChatInterface';
import { useChat } from './ChatProvider';

export default function ConditionalChatButton() {
  const { isChatOpen, setChatOpen } = useChat();
  const pathname = usePathname();
  
  // Hide chatbot button on schedule consultation page, but always render ChatInterface
  const showChatButton = pathname !== '/schedule';
  
  return (
    <>
      {/* Show button only on non-schedule pages */}
      {showChatButton && (
        <ChatBotButton isChatOpen={isChatOpen} setChatOpen={setChatOpen} />
      )}
      
      {/* Always render ChatInterface so it can be opened from schedule page */}
      {!showChatButton && (
        <ChatInterface isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
      )}
    </>
  );
}
