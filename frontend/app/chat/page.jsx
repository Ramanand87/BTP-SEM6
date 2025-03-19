'use client'
import { useState } from "react";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import ChatWindow from "@/components/Chat/ChatWindow";
import ChatInput from "@/components/Chat/ChatInput";


const Marketplace = () => {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "Hey, are you available?",
      messages: [
        { sender: "me", text: "Hi John!", timestamp: "2023-10-10T10:00:00" },
        { sender: "john", text: "Hello!", timestamp: "2023-10-10T10:01:00" },
        { sender: "me", text: "I have a new batch of tomatoes.", timestamp: "2023-10-10T10:02:00" },
        { sender: "john", text: "Great! What's the price?", timestamp: "2023-10-10T10:03:00" },
        { sender: "me", text: "₹50 per kg.", timestamp: "2023-10-10T10:04:00" },
        { sender: "john", text: "Can you do ₹45?", timestamp: "2023-10-10T10:05:00" },
        { sender: "me", text: "Let's meet at ₹47.", timestamp: "2023-10-10T10:06:00" },
        { sender: "john", text: "Deal!", timestamp: "2023-10-10T10:07:00" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "Let's discuss the price.",
      messages: [
        { sender: "me", text: "Hi Jane!", timestamp: "2023-10-10T10:00:00" },
        { sender: "jane", text: "Hello!", timestamp: "2023-10-10T10:01:00" },
        { sender: "me", text: "I have fresh potatoes.", timestamp: "2023-10-10T10:02:00" },
        { sender: "jane", text: "What's the rate?", timestamp: "2023-10-10T10:03:00" },
        { sender: "me", text: "₹30 per kg.", timestamp: "2023-10-10T10:04:00" },
        { sender: "jane", text: "Can you deliver today?", timestamp: "2023-10-10T10:05:00" },
        { sender: "me", text: "Yes, I can.", timestamp: "2023-10-10T10:06:00" },
        { sender: "jane", text: "Great! I'll take 100 kg.", timestamp: "2023-10-10T10:07:00" },
      ],
    },
    {
      id: 3,
      name: "Alice Johnson",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "I need 200 kg of wheat.",
      messages: [
        { sender: "me", text: "Hi Alice!", timestamp: "2023-10-10T10:00:00" },
        { sender: "alice", text: "Hello!", timestamp: "2023-10-10T10:01:00" },
        { sender: "me", text: "I have wheat available.", timestamp: "2023-10-10T10:02:00" },
        { sender: "alice", text: "What's the price?", timestamp: "2023-10-10T10:03:00" },
        { sender: "me", text: "₹25 per kg.", timestamp: "2023-10-10T10:04:00" },
        { sender: "alice", text: "Can you deliver tomorrow?", timestamp: "2023-10-10T10:05:00" },
        { sender: "me", text: "Yes, I can.", timestamp: "2023-10-10T10:06:00" },
        { sender: "alice", text: "Perfect! I'll confirm the order.", timestamp: "2023-10-10T10:07:00" },
      ],
    },
    {
      id: 4,
      name: "Bob Brown",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "Interested in your carrots.",
      messages: [
        { sender: "me", text: "Hi Bob!", timestamp: "2023-10-10T10:00:00" },
        { sender: "bob", text: "Hello!", timestamp: "2023-10-10T10:01:00" },
        { sender: "me", text: "I have fresh carrots.", timestamp: "2023-10-10T10:02:00" },
        { sender: "bob", text: "What's the rate?", timestamp: "2023-10-10T10:03:00" },
        { sender: "me", text: "₹40 per kg.", timestamp: "2023-10-10T10:04:00" },
        { sender: "bob", text: "Can you do ₹35?", timestamp: "2023-10-10T10:05:00" },
        { sender: "me", text: "Let's meet at ₹37.", timestamp: "2023-10-10T10:06:00" },
        { sender: "bob", text: "Deal!", timestamp: "2023-10-10T10:07:00" },
      ],
    },
    {
      id: 5,
      name: "Charlie Davis",
      avatar: "https://via.placeholder.com/40",
      lastMessage: "Looking for onions.",
      messages: [
        { sender: "me", text: "Hi Charlie!", timestamp: "2023-10-10T10:00:00" },
        { sender: "charlie", text: "Hello!", timestamp: "2023-10-10T10:01:00" },
        { sender: "me", text: "I have onions in stock.", timestamp: "2023-10-10T10:02:00" },
        { sender: "charlie", text: "What's the price?", timestamp: "2023-10-10T10:03:00" },
        { sender: "me", text: "₹20 per kg.", timestamp: "2023-10-10T10:04:00" },
        { sender: "charlie", text: "Can you deliver today?", timestamp: "2023-10-10T10:05:00" },
        { sender: "me", text: "Yes, I can.", timestamp: "2023-10-10T10:06:00" },
        { sender: "charlie", text: "Great! I'll take 50 kg.", timestamp: "2023-10-10T10:07:00" },
      ],
    },
  ]);

  const [currentChat, setCurrentChat] = useState(chats[0]);

  const handleSendMessage = (message) => {
    const updatedChats = chats.map((chat) =>
      chat.id === currentChat.id
        ? {
            ...chat,
            messages: [
              ...chat.messages,
              { sender: "me", text: message, timestamp: new Date() },
            ],
          }
        : chat
    );
    setChats(updatedChats);
  };

  return (
    <div className="flex h-[calc(100vh-16rem)]">
      <ChatSidebar
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow currentChat={currentChat} />
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default Marketplace;
