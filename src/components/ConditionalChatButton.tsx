'use client';

import { usePathname } from 'next/navigation';
import ChatBotButton from './ChatBotButton';
import { useChat } from './ChatProvider';

export default function ConditionalChatButton() {
  const { isChatOpen, setChatOpen } = useChat();
  const pathname = usePathname();
  
  // Hide chatbot on schedule consultation page
  const showChatButton = pathname !== '/schedule';
  
  if (!showChatButton) {
    return null;
  }
  
  return <ChatBotButton isChatOpen={isChatOpen} setChatOpen={setChatOpen} />;
}
