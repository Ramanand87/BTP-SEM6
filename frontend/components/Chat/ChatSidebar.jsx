"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChatSidebar = ({ rooms, currentChat, setCurrentChat }) => {
  const [notifications, setNotifications] = useState(null);
  const [ws, setWs] = useState(null);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.access;

  useEffect(() => {
    if (!token) return;

    // Maintain a single WebSocket connection
    const websocket = new WebSocket("ws://localhost:5000/ws/notifications/");
    setWs(websocket);

    websocket.onopen = () => {
      console.log("WebSocket connected");
      websocket.send(JSON.stringify({ token })); // Authenticate WebSocket
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Notification received:", data);
      setNotifications(data); // Update notifications in real-time
    
      // Automatically mark messages as read if user is already in the chat
      if (data?.lastmessages) {
        const updatedMessages = data.lastmessages.map((msg) => {
          const [roomId, roomData] = Object.entries(msg)[0];
          
          if (currentChat?.name === roomId) {
            console.log(`Auto-marking chat ${roomId} as read`);
            websocket.send(
              JSON.stringify({
                token: token,
                room_name: roomId,
                type: "mark_as_read",
              })
            );
            return { [roomId]: { ...roomData, unread: 0 } };
          }
    
          return msg;
        });
    
        setNotifications((prev) => ({ ...prev, lastmessages: updatedMessages }));
      }
    };
    

    websocket.onclose = () => console.log("WebSocket disconnected");
    websocket.onerror = (error) => console.error("WebSocket error:", error);

    return () => {
      websocket.close();
    };
  }, [token]);

  const router = useRouter();
  console.log("notifications:", notifications);

  // Convert notifications into a lookup map
  const notificationMap = notifications?.lastmessages?.reduce((acc, obj) => {
    const [roomId, data] = Object.entries(obj)[0];
    acc[roomId] = data;
    return acc;
  }, {});

  // Function to handle chat click and mark as read
  const handleChatClick = (chat) => {
    setCurrentChat(chat);

    if (!ws || !token) return;

    console.log(`Marking chat ${chat.name} as read`);

    // Send WebSocket message to mark chat as read
    ws.send(
      JSON.stringify({
        token: token,
        room_name: chat.name,
        type: "mark_as_read",
      })
    );

    // Optimistically update state to reflect unread count = 0
    setNotifications((prev) => {
      if (!prev) return prev;

      const updatedMessages = prev.lastmessages.map((msg) => {
        if (msg[chat.name]) {
          return { [chat.name]: { ...msg[chat.name], unread: 0 } };
        }
        return msg;
      });

      return { ...prev, lastmessages: updatedMessages };
    });
  };

  return (
    <Card className="w-80 h-[calc(100vh-8rem)] p-4 bg-gradient-to-b from-green-50 to-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        <div className="space-y-2">
          {rooms?.data?.map((chat) => {
            const roomNotif = notificationMap?.[chat.name];

            return (
              <div
                key={chat.name}
                onClick={() => handleChatClick(chat)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                  currentChat?.name === chat.name
                    ? "bg-green-200 shadow-md"
                    : "hover:bg-green-100"
                }`}
              >
                <Avatar>
                  <AvatarImage src={chat.profile.image} className="object-cover" />
                  <AvatarFallback>{chat.profile.name[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <p className="font-semibold">{chat.profile.name}</p>
                  <p className={`${roomNotif?.message ? "text-black font-bold" : "text-gray-500"} text-xs`}>
                    {roomNotif?.message || "@" + chat.chat_user}
                  </p>
                </div>
                {roomNotif?.unread > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {roomNotif.unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ChatSidebar;
