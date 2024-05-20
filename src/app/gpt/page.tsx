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
        <div style={{ position: 'relative', marginBottom: '1rem', width: '100%' }}>
          <SyntaxHighlighter language={language} style={syntaxTheme}>
            {codeContent}
          </SyntaxHighlighter>
          <CopyToClipboard text={codeContent}>
            <button style={{ position: 'absolute', top: 0, right: 0 }}>Copy</button>
          </CopyToClipboard>
        </div>
      );
    }

    return <div style={{ marginBottom: '1rem' }}>{message.text}</div>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <h1 style={styles.header}>Chat with AI</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
        <div>
          {messages.map((message, index) => (
            <div key={index} style={styles.messageContainer}>
              <div style={styles.messageSender}>{message.from === 'user' ? 'You:' : 'AI:'}</div>
              {renderMessage(message)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  chatBox: {
    width: '100%',
    maxWidth: '37.5rem', // 600px
    '@media (min-width: 640px)': {
      width: '50%',
    },
    '@media (max-width: 639px)': {
      width: '90%',
    },
  },
  header: {
    fontSize: '1.5rem',
    marginBottom: '1.25rem',
  },
  form: {
    marginBottom: '1.25rem',
  },
  input: {
    width: '100%',
    padding: '0.625rem',
    boxSizing: 'border-box',
    fontSize: '1rem',
  },
  button: {
    marginTop: '0.625rem',
    padding: '0.625rem',
    width: '100%',
    fontSize: '1rem',
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
  },
  messageSender: {
    fontWeight: 'bold',
    marginRight: '0.625rem',
  },
};

export default ChatPage;
