import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";
import { MessageSquare, Menu, X } from "lucide-react";

const ChatPage = () => {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-hide sidebar when a user is selected, show it when no user is selected
  useEffect(() => {
    if (selectedUser) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [selectedUser]);

  if (!authUser) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
      {/* Sidebar - hidden when in chat */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out fixed md:relative z-40 h-full`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile - only shown when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex relative">
        {/* Menu Button - shown only when in chat */}
        {selectedUser && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-3 left-3 btn btn-circle btn-sm btn-ghost z-50"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        )}

        {selectedUser ? (
          <ChatContainer />
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-4 text-base-content/50 p-4">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16" />
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-medium">Welcome, {authUser.fullName}!</h2>
              <p className="mt-2">Select a user to start chatting</p>
              <p className="text-sm mt-1">Your username: @{authUser.username}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage; 