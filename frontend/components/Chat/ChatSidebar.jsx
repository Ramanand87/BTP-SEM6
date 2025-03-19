// components/ChatSidebar.js
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const ChatSidebar = ({ chats, currentChat, setCurrentChat }) => {
  return (
    <Card className="w-80 h-[calc(100vh-8rem)] p-4 bg-gradient-to-b from-green-50  to-white">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <div className="overflow-y-auto h-[calc(100vh-8rem)]"> {/* Scrollable container */}
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChat(chat)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                currentChat?.id === chat.id
                  ? "bg-green-100 shadow-md"
                  : "hover:bg-green-50"
              }`}
            >
              <Avatar>
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-semibold">{chat.name}</p>
                <p className="text-sm text-gray-500">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ChatSidebar;