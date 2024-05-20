import React, { useState } from 'react';

interface MessageProps {
    sender: string;
    text: string;
}

const Message: React.FC<MessageProps> = ({ sender, text }) => (
    <div className={`message ${sender === 'ChatGPT' ? 'bot' : 'user'}`}>
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

            // Panggil API ChatGPT
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
    const [messages, setMessages] = useState<MessageProps[]>([]);

    const sendMessage = (message: string) => {
        const newMessages = [...messages, { sender: 'User', text: message }];
        setMessages(newMessages);
    };

    return (
        <div className="chat">
            <div className="chat-body">
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>
            <ChatInput onSend={sendMessage} />
            <style jsx>{`
                .chat {
                    max-width: 500px;
                    margin: 20px auto;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-family: 'Roboto', sans-serif;
                }

                .chat-body {
                    padding: 10px;
                    overflow-y: auto;
                    max-height: 300px;
                }

                .message {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 5px;
                    max-width: 70%;
                }

                .message.bot {
                    background-color: #f0f0f0;
                    align-self: flex-start;
                }

                .message.user {
                    background-color: #d3eaff;
                    align-self: flex-end;
                }

                .message-text {
                    word-wrap: break-word;
                }

                .chat-input {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border-top: 1px solid #ccc;
                    border-bottom-left-radius: 5px;
                    border-bottom-right-radius: 5px;
                }

                .chat-input input {
                    flex-grow: 1;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    margin-right: 10px;
                    font-size: 0.9rem;
                }

                .chat-input button {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 5px;
                    background-color: #4285f4;
                    color: white;
                    cursor: pointer;
                    font-size: 0.9rem;
                }
            `}</style>
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
