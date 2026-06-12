"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap, Mail, Lock, Eye, EyeOff, Loader2,
  Phone, ChevronRight, Sparkles, Sun, Moon, KeyRound,
  ArrowRight, Users, BookOpen, FileText, Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type AuthTab = "email" | "phone";

const DEPARTMENTS = [
  "Computer Science", "Medicine", "Civil Engineering", "Law",
  "Pharmacy", "Electrical Eng.", "Economics", "Architecture",
];

const STATS = [
  { value: "500+", label: "Exam Papers",   icon: FileText },
  { value: "45+",  label: "Universities",  icon: Users },
  { value: "25K+", label: "Students",      icon: BookOpen },
];

// ── Graduation cap SVG illustration ──
function GradIllustration() {
  return (
    <svg viewBox="0 0 240 200" className="w-full max-w-[260px]" aria-hidden="true">
      {/* Podium */}
      <rect x="80" y="150" width="80" height="30" rx="4" fill="rgba(255,255,255,0.12)" />
      <rect x="90" y="140" width="60" height="15" rx="3" fill="rgba(255,255,255,0.15)" />
      {/* Figure */}
      <circle cx="120" cy="90" r="22" fill="rgba(59,130,246,0.4)" />
      <path d="M 96 145 Q 120 120 144 145" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="rgba(59,130,246,0.25)" />
      {/* Graduation cap */}
      <polygon points="120,55 90,68 120,81 150,68" fill="rgba(245,158,11,0.9)" />
      <rect x="118" y="55" width="4" height="3" fill="rgba(245,158,11,0.9)" />
      {/* Tassel */}
      <line x1="150" y1="68" x2="153" y2="82" stroke="#fcd34d" strokeWidth="2" />
      <circle cx="153" cy="84" r="3" fill="#fcd34d" />
      {/* Diploma */}
      <rect x="98" y="108" width="44" height="30" rx="3" fill="rgba(255,255,255,0.18)" />
      <line x1="104" y1="116" x2="136" y2="116" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" />
      <line x1="104" y1="121" x2="136" y2="121" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="104" y1="126" x2="128" y2="126" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* Stars */}
      <text x="44" y="55" fontSize="14" fill="rgba(245,158,11,0.7)">★</text>
      <text x="185" y="80" fontSize="10" fill="rgba(245,158,11,0.5)">★</text>
      <text x="55" y="120" fontSize="8" fill="rgba(255,255,255,0.3)">✦</text>
      <text x="175" y="130" fontSize="8" fill="rgba(255,255,255,0.3)">✦</text>
      {/* Books stack */}
      <rect x="34" y="145" width="36" height="8" rx="2" fill="rgba(59,130,246,0.5)" />
      <rect x="36" y="138" width="32" height="8" rx="2" fill="rgba(99,102,241,0.5)" />
      <rect x="38" y="131" width="28" height="8" rx="2" fill="rgba(139,92,246,0.4)" />
      {/* Trophy */}
      <path d="M 175 148 Q 168 135 175 122 Q 182 135 175 148 Z" fill="rgba(245,158,11,0.6)" />
      <rect x="172" y="148" width="6" height="4" rx="1" fill="rgba(245,158,11,0.6)" />
      <rect x="169" y="152" width="12" height="3" rx="1" fill="rgba(245,158,11,0.6)" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [tab, setTab] = useState<AuthTab>("email");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone]               = useState("");
  const [otpSent, setOtpSent]           = useState(false);
  const [otpCode, setOtpCode]           = useState("");
  const phoneInputRef                   = useRef<HTMLInputElement>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const getRedirectUrl = async (): Promise<string> => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) return next;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "/dashboard";
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    return profile?.role === "admin" ? "/admin" : "/dashboard";
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); }
    else { const dest = await getRedirectUrl(); router.push(dest); router.refresh(); }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const supabase = createClient();
    const normalised = "+251" + phone.replace(/^0/, "").replace(/\s+/g, "");
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: normalised });
    if (otpError) setError(otpError.message); else setOtpSent(true);
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const supabase = createClient();
    const normalised = "+251" + phone.replace(/^0/, "").replace(/\s+/g, "");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalised, token: otpCode, type: "sms",
    });
    if (verifyError) { setError(verifyError.message); setLoading(false); }
    else { const dest = await getRedirectUrl(); router.push(dest); router.refresh(); }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(oauthError.message);
  };

  const handleTelegramOtpBtn = () => {
    if (tab !== "phone") { setTab("phone"); setTimeout(() => phoneInputRef.current?.focus(), 50); }
    else phoneInputRef.current?.focus();
  };

  const handleGuestAccess = () => router.push("/exams");

  return (
    <div className="min-h-screen flex bg-[#070d1c] overflow-hidden">

      {/* ══════════════════════════════════════
          LEFT — Premium Illustration Panel
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-[52%] relative overflow-hidden">

        {/* Layered backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#070d1c] via-[#0d1b4b] to-[#0a1540]" />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 70% 50% at 30% 40%, rgba(26,86,219,0.35) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 70% 70%, rgba(245,158,11,0.18) 0%, transparent 60%)",
        }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-indigo-600/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none">Exit Exam</p>
              <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Ethiopia</p>
            </div>
          </Link>

          {/* Central illustration area */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8">

            {/* Illustration */}
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-6 rounded-full bg-blue-600/10 blur-2xl" />
              {/* Spinning dashed gold ring */}
              <div
                className="absolute -inset-8 rounded-full border-2 border-dashed border-amber-400/20 animate-spin pointer-events-none"
                style={{ animationDuration: "25s" }}
              />
              {/* Spinning solid blue ring */}
              <div
                className="absolute -inset-4 rounded-full border border-blue-500/20 animate-spin pointer-events-none"
                style={{ animationDuration: "18s", animationDirection: "reverse" }}
              />

              {/* Illustration container */}
              <div className="w-48 h-48 bg-gradient-to-br from-blue-600/25 to-indigo-700/25 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm">
                <div className="w-36 h-36 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-full flex items-center justify-center border border-white/15">
                  <GradIllustration />
                </div>
              </div>

              {/* Orbiting department pills */}
              {DEPARTMENTS.map((dept, i) => {
                const angle = (i / DEPARTMENTS.length) * 360;
                const rad   = (angle * Math.PI) / 180;
                const x     = 50 + 52 * Math.cos(rad - Math.PI / 2);
                const y     = 50 + 52 * Math.sin(rad - Math.PI / 2);
                return (
                  <div key={dept}
                    className="absolute glass rounded-full px-2.5 py-1 text-[10px] text-white/70 whitespace-nowrap border border-white/10 shadow-lg backdrop-blur-sm"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    {dept}
                  </div>
                );
              })}
            </div>

            {/* Headline */}
            <div className="text-center space-y-3 max-w-sm">
              <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">
                Ace Your{" "}
                <span className="text-gold-gradient">Exit Exam</span>
                <br />with Confidence
              </h2>
              <p className="text-blue-200/60 text-sm leading-relaxed">
                Access 500+ past papers from 45+ Ethiopian universities. AI-powered study tools, real-time analytics & mock exams.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 xl:gap-10">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center group">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <Icon className="w-3.5 h-3.5 text-amber-400/70" />
                    <p className="text-2xl font-black text-amber-400">{value}</p>
                  </div>
                  <p className="text-xs text-blue-200/50">{label}</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-3">
              {[
                { icon: Shield, text: "Secure" },
                { icon: BookOpen, text: "Free to Start" },
                { icon: Sparkles, text: "AI-Powered" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                  <Icon className="w-3 h-3 text-blue-400/70" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-blue-300/30 text-xs">© 2026 Exit Exam Ethiopia. All rights reserved.</p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT — Auth Form Panel
      ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:px-8 bg-white dark:bg-[#0d1117] relative overflow-y-auto">

        {/* Subtle bg pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,1) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }} />

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative w-full max-w-[400px] space-y-6">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-black text-base leading-none">Exit Exam</p>
              <p className="text-amber-500 text-xs font-semibold tracking-widest uppercase">Ethiopia</p>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Welcome back 👋</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Sign in to continue your exam preparation</p>
          </div>

          {/* Auth tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800/80 rounded-xl p-1 gap-1 shadow-inner">
            {(["email", "phone"] as AuthTab[]).map((t) => (
              <button key={t}
                onClick={() => { setTab(t); setError(""); setOtpSent(false); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                  tab === t
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                )}
              >
                {t === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                {t === "email" ? "Email" : "Phone / OTP"}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              {error}
            </div>
          )}

          {/* Email / Password form */}
          {tab === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="email" type="email" required autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu.et"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 text-sm"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>
                : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* Phone / OTP step 1 */}
          {tab === "phone" && !otpSent && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Ethiopian Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 select-none border-r border-gray-200 dark:border-gray-600 pr-2.5">
                    <span className="text-base leading-none">🇪🇹</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">+251</span>
                  </div>
                  <input id="phone" ref={phoneInputRef} type="tel" required
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="9X XXX XXXX"
                    className="w-full pl-24 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                  We&apos;ll send a one-time code via Telegram or SMS.
                </p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 text-sm"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending OTP…</>
                : <>Send OTP Code <ChevronRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* Phone / OTP step 2 */}
          {tab === "phone" && otpSent && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2">
                ✅ OTP sent! Check your Telegram or SMS.
              </div>
              <div className="space-y-1.5">
                <label htmlFor="otpCode" className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="otpCode" type="text" inputMode="numeric" maxLength={6} required
                    value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit code"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm tracking-widest transition-all"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 text-sm"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</>
                : <>Verify &amp; Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
              <button type="button" onClick={() => { setOtpSent(false); setOtpCode(""); setError(""); }}
                className="w-full text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors underline-offset-2 hover:underline"
              >
                ← Change phone number
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            <span className="text-xs text-gray-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>

          {/* Social sign-in buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button type="button" onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md"
              aria-label="Sign in with Google"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>

            {/* Telegram OTP */}
            <button type="button" onClick={handleTelegramOtpBtn}
              className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md"
              aria-label="Sign in with Telegram OTP"
            >
              <svg className="w-4 h-4 text-[#26A5E4]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.008 9.461c-.147.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.566-4.461c.537-.194 1.006.131.875.76z" />
              </svg>
              Telegram OTP
            </button>
          </div>

          {/* Guest access */}
          <button type="button" onClick={handleGuestAccess}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-600/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all text-sm font-semibold group"
          >
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Continue as Guest — Browse Free
          </button>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Create one free →
            </Link>
          </p>

          {/* Version */}
          <p className="text-center text-xs text-gray-300 dark:text-gray-700">
            Exit Exam Ethiopia v1.0 · Secured by Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
