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

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="chat-input">
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);

    const sendMessage = async (message: string) => {
        const newMessages = [...messages, { sender: 'user', text: message }];
        setMessages(newMessages);

        // Simulasi panggilan ke API
        const response = "Balasan dari API";  // Ganti dengan panggilan API sesungguhnya
        setMessages([...newMessages, { sender: 'bot', text: response }]);
    };

    return (
        <div className="chat">
            <div className="messages">
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender} text={msg.text} />
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
            <style jsx>{`
                .App {
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #282c34;
                    color: white;
                }

                .chat {
                    width: 500px;
                    background: #333;
                    padding: 20px;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                }

                .messages {
                    flex-grow: 1;
                    overflow-y: auto;
                    margin-bottom: 10px;
                }

                .message {
                    margin: 10px 0;
                }

                .message.user {
                    text-align: right;
                }

                .message-sender {
                    font-weight: bold;
                }

                .chat-input {
                    display: flex;
                }

                .chat-input input {
                    flex-grow: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .chat-input button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    background-color: #61dafb;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default ChatGPTClone;
