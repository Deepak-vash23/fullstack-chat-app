import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// Helper function to get stored user
const getStoredUser = () => {
  const storedUser = localStorage.getItem('selectedUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: getStoredUser(),
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
      
      // If there's a stored user, find their updated data
      const storedUser = getStoredUser();
      if (storedUser) {
        const updatedUser = res.data.find(user => user._id === storedUser._id);
        if (updatedUser) {
          get().setSelectedUser(updatedUser);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not connected");
      return;
    }

    // Clean up existing subscription first
    get().unsubscribeFromMessages();

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      const authUser = useAuthStore.getState().authUser;
      
      // Check if message is part of current chat
      const isRelevantMessage = 
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser._id) ||
        (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser._id);

      if (isRelevantMessage) {
        set({
          messages: [...get().messages, newMessage],
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => {
    // Store in localStorage
    if (selectedUser) {
      localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem('selectedUser');
    }
    
    set({ selectedUser });
    if (selectedUser) {
      get().getMessages(selectedUser._id);
      get().subscribeToMessages();
    }
  },

  // Clear selected user (for logout)
  clearSelectedUser: () => {
    localStorage.removeItem('selectedUser');
    set({ selectedUser: null, messages: [] });
  }
}));