"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const ChatSidebar = ({ rooms, currentChat, setCurrentChat }) => {
  return (
    <Card className="w-80 h-[calc(100vh-8rem)] p-4 bg-gradient-to-b from-green-50 to-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        <div className="space-y-2">
          {rooms?.data?.map((chat) => (
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
                <AvatarImage src={chat.profile.image} className='object-cover'/>
                <AvatarFallback>{chat.profile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-semibold">{chat.profile.name}</p>
                <p className="text-gray-500 text-xs">@{chat.chat_user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ChatSidebar;
