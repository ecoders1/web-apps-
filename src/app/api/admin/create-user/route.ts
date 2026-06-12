import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/** Generate a random password: 12 chars, upper+lower+digits+symbols */
function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;
  const rand = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
  // Guarantee at least one of each category
  const required = [rand(upper), rand(lower), rand(digits), rand(symbols)];
  const rest = Array.from({ length: 8 }, () => rand(all));
  return [...required, ...rest].sort(() => Math.random() - 0.5).join("");
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify the caller is an authenticated admin
    const serverClient = await createServerClient();
    const { data: { user: caller } } = await serverClient.auth.getUser();
    if (!caller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: callerProfile } = await serverClient
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();
    if (callerProfile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin only" }, { status: 403 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { email, full_name, role = "student", auto_password = false } = body as {
      email: string;
      full_name?: string;
      role?: "student" | "admin";
      auto_password?: boolean;
    };

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const password = auto_password ? generatePassword() : body.password;
    if (!password) {
      return NextResponse.json({ error: "password is required" }, { status: 400 });
    }

    // 3. Create the user via service role (bypasses email confirmation)
    const service = createServiceClient();
    const { data: newUser, error: createError } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name ?? "", role },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // 4. Set role in profiles table (trigger creates the row, we just update role)
    if (role === "admin" && newUser.user) {
      await service
        .from("profiles")
        .update({ role: "admin", full_name: full_name ?? "" })
        .eq("id", newUser.user.id);
    }

    return NextResponse.json({
      success: true,
      user: { id: newUser.user?.id, email, full_name, role },
      ...(auto_password ? { generated_password: password } : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
