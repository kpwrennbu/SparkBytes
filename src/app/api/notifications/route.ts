// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabaseServerClient";
/**
 * GET /api/notifications?user_id=…&limit=…
 * Returns the most recent notifications for a given user.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  if (!user_id) {
    return NextResponse.json(
      { error: "Missing required query parameter: user_id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/notifications
 * Body: { id: string, read?: boolean }
 * Marks a single notification as read (or use `read: false` to un-read).
 */
export async function PATCH(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { id, read } = body;
  if (!id) {
    return NextResponse.json(
      { error: "Missing required field: id" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ read: read === undefined ? true : read })
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}