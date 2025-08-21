import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the business profile data from request body
    const businessProfileData = await request.json();

    // Insert or update business profile
    const { data, error } = await supabase
      .from("business_profiles")
      .upsert(
        {
          userId: user.id,
          ...businessProfileData,
        },
        {
          onConflict: "userId",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving business profile:", error);
      return NextResponse.json(
        { error: "Failed to save business profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Business profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get business profile for the current user
    const { data, error } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("userId", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is fine for new users
      console.error("Error fetching business profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch business profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Business profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
