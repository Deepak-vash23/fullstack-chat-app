import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UserSearch from "./UserSearch";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  return (
    <aside className="border-r border-base-300 w-[280px] md:w-[320px] flex flex-col bg-neutral h-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-base-300">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 md:w-5 md:h-5" />
          <h2 className="font-medium text-sm md:text-base">Chat</h2>
        </div>
        <div className="mt-2 md:mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-1.5 md:gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs md:checkbox-sm"
            />
            <span className="text-xs md:text-sm">Show online only</span>
          </label>
          <span className="text-[10px] md:text-xs text-base-content/50">
            ({onlineUsers.length} online)
          </span>
        </div>
      </div>

      {/* Search Section */}
      <UserSearch showOnlineOnly={showOnlineOnly} />

      {/* Selected User */}
      {selectedUser && (
        <div className="py-3">
          <button
            onClick={() => setSelectedUser(selectedUser)}
            className="w-full p-3 flex items-center gap-3 hover:bg-base-300/10"
          >
            <div className="relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {onlineUsers.includes(selectedUser._id) && (
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                  rounded-full ring-2 ring-neutral"
                />
              )}
            </div>

            <div className="text-left min-w-0">
              <div className="font-medium truncate">{selectedUser.fullName}</div>
              <div className="text-sm text-base-content/70">
                @{selectedUser.username}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!selectedUser && (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-base-content/50">
          Search for users to start chatting
        </div>
      )}
    </aside>
  );
};

export default Sidebar;