import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  try {
    // Verify caller is admin
    const serverClient = await createServerClient();
    const { data: { user: caller } } = await serverClient.auth.getUser();
    if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: callerProfile } = await serverClient
      .from("profiles").select("role").eq("id", caller.id).single();
    if (callerProfile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { user_id, role } = await req.json() as { user_id: string; role: "student" | "admin" };
    if (!user_id || !role) {
      return NextResponse.json({ error: "user_id and role are required" }, { status: 400 });
    }

    const service = createServiceClient();
    const { error } = await service
      .from("profiles")
      .update({ role })
      .eq("id", user_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
