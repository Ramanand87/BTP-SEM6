"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic, ChevronDown } from "lucide-react";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Bargaining suggestions for farmers
  const suggestions = [
    "Can we negotiate the price?",
    "I can offer ₹__ per kg",
    "Would you accept ₹__ for bulk purchase?",
    "Can we meet halfway at ₹__?",
    "Is there any discount for regular orders?",
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // WebSocket connection
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [receiveMessages]);

  const toggleVoiceInput = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
      setIsListening(!isListening);
    } else {
      alert("Speech recognition not supported in your browser");
    }
  };

  const handleSend = () => {
    if (message.trim() && socket) {
      const messageData = {
        message,
        username: currentUser,
        timestamp: new Date().toISOString(),
      };

      socket.send(JSON.stringify(messageData));
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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

  const insertSuggestion = (suggestion) => {
    setMessage(suggestion.replace("__", ""));
    setShowSuggestions(false);
  };

  return (
    <div className="flex h-[calc(100vh-10rem)]">
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
          {receiveMessages.map((msg, index) => {
            const messageDate = formatDate(msg.timestamp);
            const showDate = index === 0 || 
              formatDate(receiveMessages[index-1].timestamp) !== messageDate;

            return (
              <div className="px-4" key={index}>
                {showDate && (
                  <div className="text-center text-sm text-gray-500 font-medium my-2">
                    {messageDate}
                  </div>
                )}
                 <div className={`flex ${
      msg.username === currentUser ? "justify-end" : "justify-start"
    } mb-3`}>
      <div className={`px-4 py-2 rounded-lg shadow-md max-w-xs ${
        msg.username === currentUser 
          ? "bg-blue-500 text-white" 
          : "bg-gray-300 text-black"
      }`}>
        <p className="break-words whitespace-pre-wrap overflow-hidden">
          {msg.message}
        </p>
        <p className={`text-xs mt-1 ${
          msg.username === currentUser 
            ? "text-blue-100" 
            : "text-gray-500"
        }`}>
          {formatTime(msg.timestamp)}
        </p>
      </div>
    </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        {currentChat && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
            {/* Bargaining Suggestions */}
            <div className="relative mb-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-green-700"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                Bargaining Suggestions <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showSuggestions && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white border rounded-lg shadow-lg z-10">
                  {suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => insertSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="max-w-2xl mx-auto flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 border-2 border-green-700"
              />
              <Button
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleVoiceInput}
              >
                <Mic className="w-4 h-4" />
              </Button>
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