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

        // Simulasi panggilan ke API
        const response = "Balasan dari AI";  // Ganti dengan panggilan API sesungguhnya
        setMessages([...newMessages, { sender: 'ChatGPT', text: response }]);
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
            <style jsx>{`
                .chat {
                    max-width: 500px;
                    margin: 0 auto;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    overflow: hidden;
                    font-family: Arial, sans-serif;
                }

                .chat-header {
                    background-color: #4285f4;
                    color: white;
                    padding: 10px;
                    display: flex;
                    align-items: center;
                }

                .logo {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }

                .title {
                    font-size: 1.2rem;
                    font-weight: bold;
                }

                .chat-body {
                    padding: 10px;
                    overflow-y: auto;
                    max-height: 300px;
                }

                .message {
                    margin-bottom: 10px;
                }

                .message-sender {
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .message.ChatGPT {
                    text-align: right;
                    background-color: #f0f0f0;
                    border-radius: 10px;
                    padding: 10px;
                }

                .chat-input {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    background-color: #f0f0f0;
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
