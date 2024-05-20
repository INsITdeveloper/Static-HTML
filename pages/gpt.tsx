import React, { useState } from 'react';

interface MessageProps {
    sender: string;
    text: string;
}

const Message: React.FC<MessageProps> = ({ sender, text }) => (
    <div className={`message ${sender}`}>
        <div className="message-sender">{sender}</div>
        <div className="message-text">{text}</div>
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

            // Panggil API
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
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);

    const sendMessage = async (message: string) => {
        const newMessages = [...messages, { sender: 'User', text: message }];
        setMessages(newMessages);
    };

    return (
        <div className="chat">
            <div className="chat-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/1200px-Google_Chrome_icon_%28September_2014%29.svg.png" alt="Google Logo" className="logo" />
                <span className="title">ChatGPT</span>
            </div>
            <div className="chat-body">
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>
            <ChatInput onSend={sendMessage} />
            <style jsx>{/* Your styles here */}</style>
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
