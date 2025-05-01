"use client"; // mark this as a client component
//This is tiffany's code. She can get rid of the red underline if she wants. I tried and stopped.
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import supabase from "@/app/api/supabaseClient";
import type {Notification, NotificationContextValue} from "@/types";

// Shape of a notification row

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 1) Fetch initial batch
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error loading notifications:", error.message);
      } else if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      }
    }

    load();
  }, []);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
  
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
  
      channel = supabase
        .channel('notifications-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
            setUnreadCount((c) => c + 1);
          }
        )
        .subscribe();
    };
  
    setupRealtime();
  
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);
  
  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("Failed to mark notification read:", error.message);
      return;
    }

    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  return ctx;
}