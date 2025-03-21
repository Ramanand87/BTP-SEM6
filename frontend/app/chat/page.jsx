"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]); // Stores sent messages
  const [receivedMessages, setReceivedMessages] = useState([]); // Stores received messages
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState("c382a796-e646-43ed-a5b6-b57c31edae16");
  const roomCreated = useRef(false);

  useEffect(() => {
    if (roomId) {
      console.log("Establishing WebSocket for room:", roomId);
      const ws = new WebSocket(`ws://localhost:5000/ws/chat/${roomId}/`);

      ws.onopen = () => console.log("WebSocket Connected!");

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message received:", data);
        setReceivedMessages((prevMessages) => [...prevMessages, data]); // Add received message to state
      };

      ws.onerror = (error) => console.error("WebSocket Error:", error);

      ws.onclose = () => console.log("WebSocket Closed!");

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [roomId]);

  const handleSend = () => {
    if (message.trim() && socket) {
      const messageData = {
        message: message,
        username: "dss45", // Replace with actual username
        timestamp: new Date().toISOString(), // Add timestamp
      };

      socket.send(JSON.stringify(messageData));
      setSentMessages((prevMessages) => [...prevMessages, messageData]); // Add sent message to state
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {/* Display Received Messages */}
        {receivedMessages.map((msg, index) => (
          <div key={index} className="flex justify-start mb-2">
            <div className="max-w-xs p-3 rounded-lg bg-gray-200 text-black">
              <strong>{msg.username}: </strong> {msg.message}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Display Sent Messages */}
        {sentMessages.map((msg, index) => (
          <div key={index} className="flex justify-end mb-2">
            <div className="max-w-xs p-3 rounded-lg bg-blue-500 text-white">
              <strong>{msg.username}: </strong> {msg.message}
              <div className="text-xs text-gray-200 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!socket}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;