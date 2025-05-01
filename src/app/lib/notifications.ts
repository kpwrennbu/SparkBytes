// src/app/lib/notifications.ts

import supabase from "@/app/api/supabaseClient";

/**
 * Fire off a new notification row in Supabase.
 *
 * @param userId  UUID of the user to notify.
 * @param type    A short string categorizing the notification.
 * @param payload An object with any extra data (e.g. { title, url }).
 */
export async function addNotification(
  userId: string,
  type: string,
  payload: Record<string, any>
) {
  const { error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: userId,
        type,
        payload,
      },
    ]);

  if (error) {
    console.error("Failed to add notification:", error.message);
  }
}