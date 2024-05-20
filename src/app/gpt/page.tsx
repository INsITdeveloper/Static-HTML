"use client";
import { useState, CSSProperties } from 'react';

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

  return (
    <div style={styles.container}>
      <h1>Chat with AI</h1>
      <div style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
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
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default ChatPage;
