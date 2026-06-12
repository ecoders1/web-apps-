"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, GraduationCap, ChevronDown, Zap, LayoutDashboard, LogOut, User, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdmin } from "@/lib/supabase/admin";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/departments", label: "Departments" },
  { href: "/exams", label: "Exams" },
  {
    label: "Practice",
    children: [
      { href: "/exam-practice", label: "⚡ Exam Practice", desc: "Timed question practice" },
      { href: "/mock-exam",     label: "🎯 Mock Tests",    desc: "Full-length simulations" },
      { href: "/results",       label: "📊 My Results",    desc: "Analytics & history" },
    ],
  },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Get current session
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const isDark = scrolled || isOpen;
  const userIsAdmin = isAdmin(user?.email);
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-gray-800"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-2">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group mr-6 shrink-0" onClick={() => setIsOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className={cn("font-black text-base transition-colors", isDark ? "text-gray-900 dark:text-white" : "text-white")}>
                Exit Exam
              </span>
              <span className={cn("font-black text-base ml-1 transition-colors", isDark ? "text-blue-600 dark:text-blue-400" : "text-amber-400")}>
                Ethiopia
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isDark
                      ? "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}>
                    {link.label}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === link.label && "rotate-180")} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 pt-1 z-50">
                      <div className="w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 border border-gray-200 dark:border-gray-800 overflow-hidden p-1.5">
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{child.label}</span>
                            <span className="text-xs text-gray-400 mt-0.5">{child.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href!}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isDark
                      ? "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* ── Right actions ── */}
          <div className="hidden md:flex items-center gap-2 ml-auto shrink-0">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDark
                    ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {user ? (
              /* ── Logged-in user menu ── */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border",
                    isDark
                      ? "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      : "border-white/30 text-white hover:bg-white/10"
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform shrink-0", userMenuOpen && "rotate-180")} />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 pt-1 z-50 w-52">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 border border-gray-200 dark:border-gray-800 overflow-hidden p-1.5">
                      <div className="px-3 py-2 mb-1">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                        <LayoutDashboard className="w-4 h-4 text-blue-500" />
                        Dashboard
                      </Link>
                      {userIsAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                          <ShieldCheck className="w-4 h-4 text-violet-500" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm text-red-600 dark:text-red-400">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Guest auth buttons ── */
              <>
                <Link href="/login"
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                    isDark
                      ? "border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      : "border-white/40 text-white hover:bg-white/10"
                  )}
                >
                  Sign In
                </Link>
                <Link href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 transition-all shadow-md shadow-blue-600/25"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile controls ── */}
          <div className="flex md:hidden items-center gap-1.5 ml-auto">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn("p-2 rounded-lg", isDark ? "text-gray-600 dark:text-gray-400" : "text-white")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn("p-2 rounded-lg transition-colors", isDark ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" : "text-white hover:bg-white/10")}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{link.label}</p>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href!}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-blue-500" />
                    Dashboard
                  </Link>
                  {userIsAdmin && (
                    <Link href="/admin" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <ShieldCheck className="w-4 h-4 text-violet-500" />
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
