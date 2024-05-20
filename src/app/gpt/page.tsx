import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageProps {
    sender: string;
    text: string;
    isCode?: boolean;
}

const Message: React.FC<MessageProps> = ({ sender, text, isCode }) => (
    <div className="message-container">
        <div className={`message ${sender === 'ChatGPT' ? 'bot' : 'user'}`}>
            {isCode ? (
                <SyntaxHighlighter language="javascript" style={dracula}>
                    {text}
                </SyntaxHighlighter>
            ) : (
                <div className="message-text">{text}</div>
            )}
        </div>
    </div>
);

interface ChatInputProps {
    onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim()) {
            const message = input.trim();
            onSend(message);
            setInput('');

            try {
                const response = await fetch(`https://sh.zanixon.xyz/api/gpt-4?q=${encodeURIComponent(message)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                onSend(data.gpt);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    return (
        <div className="chat-input">
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                style={{ width: '80%', marginRight: '10px' }} // Inline CSS
            />
            <button 
                onClick={handleSend} 
                style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} // Inline CSS
            >
                Send
            </button>
        </div>
    );
};

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<MessageProps[]>([]);

    const sendMessage = (message: string) => {
        const newMessages = [...messages, { sender: 'User', text: message }];
        setMessages(newMessages);
    };

    return (
        <div className="chat">
            <div className="chat-body">
                {messages.map((msg, index) => (
                    <Message 
                        key={index} 
                        sender={msg.sender} 
                        text={msg.text} 
                        isCode={msg.isCode} 
                    />
                ))}
            </div>
            <ChatInput onSend={sendMessage} />
        </div>
    );
};

const ChatGPTClone: React.FC = () => {
    return (
        <div className="App">
            <Chat />
        </div>
    );
};

export default ChatGPTClone;
