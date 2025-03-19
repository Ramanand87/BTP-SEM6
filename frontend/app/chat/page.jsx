// components/ChatRoom.js
"use client";
import { useState, useEffect } from 'react';

const ChatRoom = ({ roomName }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
        setSocket(socketInstance);

        socketInstance.onmessage = function(e) {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        return () => socketInstance.close();
    }, [roomName]);

    const sendMessage = () => {
        if (socket && input.trim()) {
            socket.send(JSON.stringify({
                'message': input,
                'username': 'YourUsername', // Replace with dynamic username
            }));
            setInput('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.username}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;
