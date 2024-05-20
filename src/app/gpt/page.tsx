"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string, from: 'user' | 'ai' }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() === '') return;

    setLoading(true);
    setMessages([...messages, { text: input, from: 'user' }]);

    try {
      const response = await axios.get(`https://sh.zanixon.xyz/api/gpt-4?q=${encodeURIComponent(input)}`);
      const aiResponse = response.data.gpt;
      setMessages([...messages, { text: input, from: 'user' }, { text: aiResponse, from: 'ai' }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const renderMessage = (message: { text: string, from: 'user' | 'ai' }) => {
    const isCode = message.text.includes('```');

    if (isCode) {
      const code = message.text.split('```')[1];
      const language = code.split('\n')[0];
      const codeContent = code.split('\n').slice(1).join('\n');

      return (
        <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
          <SyntaxHighlighter language={language} style={syntaxTheme}>
            {codeContent}
          </SyntaxHighlighter>
          <CopyToClipboard text={codeContent}>
            <button style={{ position: 'absolute', top: 0, right: 0 }}>Copy</button>
          </CopyToClipboard>
        </div>
      );
    }

    return <div style={{ marginBottom: '20px' }}>{message.text}</div>;
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '50%', maxWidth: '600px' }}>
        <h1>Chat with AI</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ marginTop: '10px', padding: '10px', width: '100%' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
        <div>
          {messages.map((message, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', marginRight: '10px' }}>{message.from === 'user' ? 'You:' : 'AI:'}</div>
              {renderMessage(message)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
