import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });
    }, []);

    const sendMessage = () => {
        socket.emit('chat message', input);
        setInput('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
