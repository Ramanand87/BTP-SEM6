"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetRoomsQuery } from "@/redux/Service/chatApi";
import ChatSidebar from "@/components/Chat/ChatSidebar";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [receiveMessages, setReceiveMessages] = useState([]);
  const { data: rooms, isLoading, isError } = useGetRoomsQuery();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const currentUser = userInfo?.data.username;

  const [socket, setSocket] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentChat?.name) {
      console.log("Connecting to WebSocket for room:", currentChat.name);
      const ws = new WebSocket(
        `ws://localhost:5000/ws/chat/${currentChat.name}/`
      );

      ws.onopen = () => console.log("WebSocket Connected!");
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log("Message received:", msg);
        setReceiveMessages((prev) =>
          Array.isArray(msg.messages) ? msg.messages : [...prev, msg]
        );
      };

      ws.onerror = (error) => console.error("WebSocket Error:", error);
      ws.onclose = () => console.log("WebSocket Closed!");

      setSocket(ws);
      return () => ws.close();
    }
  }, [currentChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [receiveMessages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp).toDateString();
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate === today) return "Today";
    if (messageDate === yesterday.toDateString()) return "Yesterday";
    return messageDate;
  };

  const renderMessages = () => {
    let lastDate = null;
    return receiveMessages.map((msg, index) => {
      const messageDate = formatDate(msg.timestamp);
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div className="px-4" key={index}>
          {showDate && (
            <div className="text-center text-sm text-gray-500 font-medium my-2">
              {messageDate}
            </div>
          )}
          <div
            className={`flex ${
              msg.username === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
  className={`px-4 py-2 flex justify-between items-end rounded-lg shadow-md max-w-xs break-words ${
    msg.username === currentUser
      ? "bg-blue-500 text-white"
      : "bg-gray-300 text-black"
  }`}
>
  {/* Message Text */}
  <p className="text-base mb-2">{msg.message}</p>

  {/* Timestamp */}
  <p className="text-xs text-gray-400 ml-2">
    {formatTime(msg.timestamp)}
  </p>
</div>
          </div>
        </div>
      );
    });
  };

  const handleSend = () => {
    if (message.trim() && socket) {
      const messageData = {
        message,
        username: currentUser,
        timestamp: new Date().toISOString(),
      };

      console.log("Sending message:", messageData);
      socket.send(JSON.stringify(messageData));
      setMessage("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] ">
      {/* Sidebar */}
      <ChatSidebar
        rooms={rooms}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />

      {/* Chat Section */}
      <div className="flex flex-col flex-1 h-full bg-gray-100">
        {/* Chat Header */}
        <div className="p-4 bg-white shadow-md">
          {currentChat ? (
            <div className="flex items-center space-x-3">
              <img
                src={currentChat.profile.image}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{currentChat.profile.name}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center text-gray-500">
              <img
                src="/chatIcon.png"
                alt="Chat Illustration"
                className="w-48 h-48 mb-4 opacity-80"
              />
              <h2 className="text-xl font-semibold text-gray-700">
                Welcome to your inbox!
              </h2>
              <p className="text-md text-gray-500 max-w-sm">
                Select a chat from the list to start messaging. Stay connected
                and enjoy seamless conversations. 🚀
              </p>
            </div>
          )}
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {renderMessages()}
          <div ref={messagesEndRef} /> {/* Scroll anchor */}
        </div>

        {/* Input Section */}
        {currentChat && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
            <div className="max-w-2xl mx-auto flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border-2 border-green-700"
              />
              <Button onClick={handleSend} disabled={!socket}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
