import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler.
 * Supabase redirects here after a successful OAuth sign-in (e.g. Google).
 * It exchanges the `code` query param for a session and redirects the user.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // `next` lets callers specify a post-login destination
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If a `next` param was provided, honour it
      if (next) {
        return NextResponse.redirect(new URL(next, origin));
      }

      // Otherwise route based on role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        const dest = profile?.role === "admin" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(dest, origin));
      }

      return NextResponse.redirect(new URL("/dashboard", origin));
    }
  }

  // If anything goes wrong, redirect back to login with an error hint
  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", origin));
}
