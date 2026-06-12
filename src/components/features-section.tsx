import { FileText, Bot, ShieldCheck, Download, Smartphone, BarChart3, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: FileText,
    title: "500+ Past Exam Papers",
    description: "Comprehensive library of past exit exam papers from all departments and universities across Ethiopia.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "rgba(59,130,246,0.15)",
    tag: "FREE",
    tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  },
  {
    icon: Bot,
    title: "AI Study Assistant",
    description: "Get instant explanations, personalized study tips, and intelligent guidance for every question.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "rgba(139,92,246,0.15)",
    tag: "AI",
    tagColor: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  },
  {
    icon: Clock,
    title: "Timed Mock Exams",
    description: "Full-length, timed exit exam simulations that mirror the real exam experience with instant scoring.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "rgba(16,185,129,0.15)",
    tag: "POPULAR",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  {
    icon: Download,
    title: "Offline Access",
    description: "Download exams in PDF, DOCX, and PPT formats. Study anywhere, anytime — even without internet.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.15)",
    tag: "PREMIUM",
    tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track your performance across subjects, view score trends, and get smart study recommendations.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "rgba(244,63,94,0.15)",
    tag: "NEW",
    tagColor: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description: "Earn shareable achievement certificates when you pass mock exams. Share on LinkedIn & Telegram.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "rgba(6,182,212,0.15)",
    tag: "PREMIUM",
    tagColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Fully responsive on mobile, tablet, and desktop. Study on any device with the same premium experience.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    glow: "rgba(99,102,241,0.15)",
    tag: "FREE",
    tagColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description: "Enterprise-grade security via Supabase. Your data and exam progress are always safe and private.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    glow: "rgba(20,184,166,0.15)",
    tag: "FREE",
    tagColor: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  },
];

export function FeaturesSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #080e20, #060c1a)" }}
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(26,86,219,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/8 text-blue-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Everything You Need
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
            Built for Ethiopian Students
          </h2>
          <p className="text-white/40 text-base max-w-xl mx-auto">
            Every tool you need to prepare, practice, and pass your national exit examination — all in one platform.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-300 cursor-default hover:-translate-y-1.5",
                  feature.border
                )}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `0 0 24px ${feature.glow}` }}
                />

                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", feature.bg)}>
                    <Icon className={cn("w-5 h-5", feature.color)} />
                  </div>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", feature.tagColor)}>
                    {feature.tag}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mb-1.5 leading-snug">{feature.title}</h3>
                <p className="text-white/35 text-xs leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
