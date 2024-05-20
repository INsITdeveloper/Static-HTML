import React, { useState } from 'react';

interface MessageProps {
    sender: string;
    text: string;
    code?: boolean;
}

const Message: React.FC<MessageProps> = ({ sender, text, code }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        alert("Kode telah disalin!");
    };

    return (
        <div className={`message ${sender === 'ChatGPT' ? 'bot' : 'user'}`}>
            <div className={`message-text ${code ? 'code' : ''}`}>
                {code ? (
                    <>
                        <pre>{text}</pre>
                        <button className="copy-btn" onClick={handleCopy}>Copy</button>
                    </>
                ) : (
                    text
                )}
            </div>
        </div>
    );
};

interface ChatInputProps {
    onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSend(input.trim());
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
    const [messages, setMessages] = useState<MessageProps[]>([]);

    const sendMessage = (message: string) => {
        const newMessages = [...messages, { sender: 'User', text: message }];
        setMessages(newMessages);

        // Simulasi panggilan ke API
        const response = message.includes('kode') 
            ? "<span class='code'>function greet() {<br/>&nbsp;&nbsp;console.log('Hello, world!');<br/>}</span>"
            : "Halo! LinucxAI di sini untuk membantu Anda. Ada yang bisa saya bantu hari ini?";
        setMessages([...newMessages, { sender: 'ChatGPT', text: response, code: message.includes('kode') }]);
    };

    return (
        <div className="chat">
            <div className="chat-body">
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender} text={msg.text} code={msg.code} />
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
                    white-space: pre-wrap;
                    position: relative;
                }

                .message-text.code {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 5px;
                }

                .message-text pre {
                    margin: 0;
                    overflow-x: auto;
                }

                .copy-btn {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    padding: 3px 6px;
                    border: none;
                    background-color: #4285f4;
                    color: white;
                    border-radius: 3px;
                    cursor: pointer;
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
