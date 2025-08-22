import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if username exists in profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is what we want
      console.error("Error checking username:", error);
      return NextResponse.json(
        { error: "Failed to check username" },
        { status: 500 }
      );
    }

    // If data exists, username is taken
    const isAvailable = !data;

    return NextResponse.json({
      available: isAvailable,
      username: username,
    });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
