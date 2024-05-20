"use client";
import { useState, CSSProperties } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ChatPage = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { user: 'You', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch(`/api/gpt-4?q=${encodeURIComponent(input)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const aiMessage = data.gpt;
      setMessages([...newMessages, { user: 'AI', text: aiMessage }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = (msg: { user: string; text: string }, index: number) => {
    const isCode = msg.text.startsWith('```') && msg.text.endsWith('```');
    const codeContent = isCode ? msg.text.slice(3, -3).trim() : '';

    return (
      <div key={index} style={styles.message}>
        <strong>{msg.user}:</strong>
        {isCode ? (
          <div style={styles.codeContainer}>
            <div style={styles.codeHeader}>
              <span>Code</span>
              <CopyToClipboard text={codeContent}>
                <button style={styles.copyButton}>Copy</button>
              </CopyToClipboard>
            </div>
            <SyntaxHighlighter language="javascript" style={coy}>
              {codeContent}
            </SyntaxHighlighter>
          </div>
        ) : (
          <span>{msg.text}</span>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Chat with AI</h1>
      {messages.length > 0 && (
        <div style={styles.chatContainer}>
          {messages.map(renderMessage)}
        </div>
      )}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message here..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  chatContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
  },
  message: {
    marginBottom: '10px',
  },
  codeContainer: {
    position: 'relative',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  codeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: '5px 10px',
    borderBottom: '1px solid #ccc',
  },
  copyButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default ChatPage;
