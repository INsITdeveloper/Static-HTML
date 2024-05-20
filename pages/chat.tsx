// pages/chat.tsx

import { use client } from 'use client';
import ChatGPTClone from '../app/gpt/route';

const ChatPage: React.FC = () => {
  use client(); // Tandai halaman ini sebagai komponen klien
  return (
    <div>
      <ChatGPTClone />
    </div>
  );
};

export default ChatPage;
