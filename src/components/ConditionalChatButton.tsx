'use client';

import { usePathname } from 'next/navigation';
import ChatBotButton from './ChatBotButton';
import { useChat } from './ChatProvider';

export default function ConditionalChatButton() {
  const { isChatOpen, setChatOpen } = useChat();
  
  // Show chat button on all pages since navbar can open it from anywhere
  return <ChatBotButton isChatOpen={isChatOpen} setChatOpen={setChatOpen} />;
}
