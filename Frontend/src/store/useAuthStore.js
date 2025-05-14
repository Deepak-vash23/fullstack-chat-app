import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isConnecting: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, onlineUsers: [] });
      // Clear selected user from chat store
      useChatStore.getState().clearSelectedUser();
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, isConnecting } = get();
    if (!authUser || isConnecting) return;

    set({ isConnecting: true });

    // Disconnect existing socket if any
    get().disconnectSocket();

    try {
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
      });

      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected successfully");
        set({ isConnecting: false });
        // Start ping interval
        setInterval(() => {
          if (socket.connected) {
            socket.emit("ping");
          }
        }, 25000);
      });

      socket.on("pong", () => {
        console.log("Received pong from server");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        set({ isConnecting: false });
        toast.error("Connection lost. Retrying...");
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        if (reason === "io server disconnect") {
          // Server disconnected us, try to reconnect
          socket.connect();
        }
        set({ onlineUsers: [] });
      });

      socket.on("getOnlineUsers", (userIds) => {
        console.log("Received online users:", userIds);
        set({ onlineUsers: userIds });
      });

      set({ socket: socket });
    } catch (error) {
      console.error("Error setting up socket:", error);
      set({ isConnecting: false });
      toast.error("Failed to establish connection");
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      clearInterval(); // Clear any existing ping intervals
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("getOnlineUsers");
      socket.off("pong");
      socket.disconnect();
      set({ socket: null, isConnecting: false });
    }
  },
}));