"use client"; // mark this as a client component

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import supabase from "@/app/api/supabaseClient";

// Shape of a notification row
interface Notification {
  id: string;
  user_id: string;
  type: string;
  payload: { title: string; [key: string]: any };
  read: boolean;
  created_at: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
}

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
    // 2) Real-time listener for new notifications
    let subscription: any;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      subscription = supabase
        .from(`notifications:user_id=eq.${user.id}`)
        .on("INSERT", (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadCount((c) => c + 1);
        })
        .subscribe();
    });

    return () => {
      if (subscription) supabase.removeSubscription(subscription);
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