import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Reply } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    setReplyTo,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // Helper function to find the replied to message
  const findRepliedMessage = (replyToId) => {
    return messages.find(m => m._id === replyToId);
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesContainerRef}>
        {messages.map((message, index) => {
          // Check if we need to show date separator
          const showDateSeparator = index === 0 || (
            new Date(message.createdAt).toDateString() !== 
            new Date(messages[index - 1].createdAt).toDateString()
          );

          // Get replied to message if exists
          const repliedToMessage = message.replyTo ? findRepliedMessage(message.replyTo) : null;

          return (
            <div key={message._id}>
              {showDateSeparator && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-base-300 text-base-content/70 px-3 py-1 rounded-full text-xs">
                    {new Date(message.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                </div>
              )}
              <div
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble-container relative group">
                  {/* Reply button */}
                  <button
                    onClick={() => setReplyTo(message)}
                    className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
                    btn btn-circle btn-ghost btn-xs"
                    style={{
                      [message.senderId === authUser._id ? 'left' : 'right']: '-2rem'
                    }}
                  >
                    <Reply className="w-3 h-3" />
                  </button>

                  {/* Replied message preview */}
                  {repliedToMessage && (
                    <div className="bg-base-300/50 rounded-lg px-3 py-1.5 mb-1 text-xs">
                      <div className="flex items-center gap-1 text-base-content/70 mb-0.5">
                        <Reply className="w-3 h-3" />
                        <span className="font-medium">
                          {repliedToMessage.senderId === authUser._id ? "You" : selectedUser.fullName}
                        </span>
                      </div>
                      <p className="truncate">
                        {repliedToMessage.text}
                        {repliedToMessage.image && " [Image]"}
                      </p>
                    </div>
                  )}

                  <div className={`chat-bubble ${message.senderId === authUser._id ? "bg-primary text-white" : "bg-secondary text-white"} flex flex-col`}>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;