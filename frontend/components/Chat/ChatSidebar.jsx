"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChatSidebar = ({ rooms, currentChat, setCurrentChat }) => {
  const [notifications, setNotifications] = useState(null);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.access;

  useEffect(() => {
    if (!token) return;

    // Connect WebSocket
    const ws = new WebSocket('ws://localhost:5000/ws/notifications/');

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ token })); // Send token for authentication
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(" notification:", data);
      setNotifications(data);

      
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws) ws.close();
    };
  }, [token]);
  const router = useRouter();
  console.log( 'notifications:', notifications)

  // Convert notifications into a lookup map
  const notificationMap = notifications?.lastmessages?.reduce((acc, obj) => {
    const [roomId, data] = Object.entries(obj)[0];
    acc[roomId] = data;
    return acc;
  }, {});

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
                onClick={() => setCurrentChat(chat)}
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
