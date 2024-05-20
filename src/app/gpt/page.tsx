import React, { useState } from 'react';
import axios from 'axios';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<{ user: string, ai: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() === '') return;

    setLoading(true);
    try {
      const response = await axios.get(`https://sh.zanixon.xyz/api/gpt-4?q=${encodeURIComponent(input)}`);
      const aiResponse = response.data.gpt;
      setMessages([...messages, { user: input, ai: aiResponse }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
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
          <div key={index} style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold' }}>You:</div>
            <div>{message.user}</div>
            <div style={{ fontWeight: 'bold', marginTop: '10px' }}>AI:</div>
            <div>{message.ai}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
