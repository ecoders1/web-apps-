"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, ShieldCheck, Loader2, Eye, EyeOff, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Role = "student" | "admin";

export default function CreateUserPage() {
  const router = useRouter();

  const [email, setEmail]           = useState("");
  const [fullName, setFullName]     = useState("");
  const [role, setRole]             = useState<Role>("student");
  const [password, setPassword]     = useState("");
  const [autoPass, setAutoPass]     = useState(false);
  const [showPassword, setShowPass] = useState(false);

  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [success, setSuccess]               = useState(false);
  const [generatedPass, setGeneratedPass]   = useState<string | null>(null);
  const [copied, setCopied]                 = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        full_name: fullName,
        role,
        auto_password: autoPass,
        ...(autoPass ? {} : { password }),
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Failed to create user");
      return;
    }

    setSuccess(true);
    setGeneratedPass(json.generated_password ?? null);
  };

  const copyPass = async () => {
    if (!generatedPass) return;
    await navigator.clipboard.writeText(generatedPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setEmail(""); setFullName(""); setRole("student");
    setPassword(""); setAutoPass(false);
    setSuccess(false); setGeneratedPass(null); setError("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/users"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create User</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Add a new student or admin account
          </p>
        </div>
      </div>

      {/* Success state */}
      {success ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User created!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className="font-medium text-gray-800 dark:text-gray-200">{email}</span> has been added as{" "}
              <span className="font-medium">{role}</span>.
            </p>
          </div>

          {generatedPass && (
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
              <code className="flex-1 text-sm font-mono text-gray-800 dark:text-gray-100 text-left break-all">
                {generatedPass}
              </code>
              <button onClick={copyPass}
                className="shrink-0 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-300"
                aria-label="Copy password">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
          {generatedPass && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Copy this password now — it won&apos;t be shown again.
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={reset}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Create another
            </button>
            <button onClick={() => router.push("/admin/users")}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors">
              View users
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5">

          {/* Error banner */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Full name */}
          <div className="space-y-1.5">
            <label htmlFor="full_name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="full_name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Abebe Kebede"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <div className="flex gap-3">
              {(["student", "admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all",
                    role === r
                      ? r === "admin"
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  {r === "admin"
                    ? <ShieldCheck className="w-4 h-4" />
                    : <User className="w-4 h-4" />}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={autoPass}
                  onChange={(e) => setAutoPass(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Auto-generate
              </label>
            </div>

            {!autoPass && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required={!autoPass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}
            {autoPass && (
              <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl px-4 py-2.5 border border-gray-200 dark:border-gray-700">
                A secure password will be generated and shown after creation.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 text-sm mt-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Creating user…</>
            ) : (
              <><UserPlus className="w-4 h-4" />Create User</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
