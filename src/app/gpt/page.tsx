"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string, from: 'user' | 'ai' }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() === '') return;

    setLoading(true);
    setMessages([...messages, { text: input, from: 'user' }]);
    setInput('');

    try {
      const response = await axios.get(`https://sh.zanixon.xyz/api/gpt-4?q=${encodeURIComponent(input)}`);
      const aiResponse = response.data.gpt;
      setMessages([...messages, { text: aiResponse, from: 'ai' }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as React.FormEvent);
    }
  };

  const renderMessage = (message: { text: string, from: 'user' | 'ai' }, index: number) => {
    const isCode = message.text.includes('```');

    if (isCode) {
      const code = message.text.split('```')[1];
      const language = code.split('\n')[0];
      const codeContent = code.split('\n').slice(1).join('\n');

      return (
        <div key={index} style={{ position: 'relative', marginBottom: '1rem', width: '100%' }}>
          <SyntaxHighlighter language={language} style={syntaxTheme}>
            {codeContent}
          </SyntaxHighlighter>
          <CopyToClipboard text={codeContent}>
            <button style={{ position: 'absolute', top: 0, right: 0 }}>Copy</button>
          </CopyToClipboard>
        </div>
      );
    }

    return (
      <div key={index} style={{ marginBottom: '1rem' }}>
        {message.text}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <h1 style={styles.header}>Chat with AI</h1>
        <div style={{ overflowY: 'scroll', maxHeight: '400px' }}>
          {messages.map((message, index) => (
            <div key={index} style={styles.messageContainer}>
              <div style={styles.messageSender}>{message.from === 'user' ? 'You:' : 'AI:'}</div>
              {renderMessage(message, index)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  chatBox: {
    width: '100%',
    maxWidth: '500px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
  },
  header: {
    fontSize: '1.5rem',
    marginBottom: '1.25rem',
    textAlign: 'center',
  },
  form: {
    marginTop: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.625rem',
    boxSizing: 'border-box',
    fontSize: '1rem',
    resize: 'none',
    minHeight: '3rem',
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
    wordWrap: 'break-word',
  },
  messageSender: {
    fontWeight: 'bold',
    marginRight: '0.625rem',
  },
};

export default ChatPage;
