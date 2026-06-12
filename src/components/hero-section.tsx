import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Zap, Shield, Users, Play, Sparkles } from "lucide-react";

const FLOATING_TAGS = [
  { text: "Computer Science",   top: "15%", left: "5%",   delay: "0s" },
  { text: "Medicine",           top: "25%", right: "4%",  delay: "0.3s" },
  { text: "Civil Engineering",  top: "65%", left: "3%",   delay: "0.6s" },
  { text: "Law",                top: "72%", right: "6%",  delay: "0.9s" },
];

const DEPARTMENTS_PREVIEW = [
  "Computer Science", "Medicine", "Law", "Civil Engineering",
  "Nursing", "Pharmacy", "Economics", "Software Engineering",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060c1a]">

      {/* ── Layered backgrounds ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#08102a] via-[#0c1d5e] to-[#06101f]" />
      {/* Radial glow top center */}
      <div className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(26,86,219,0.38) 0%, transparent 65%)" }}
      />
      {/* Radial glow bottom right */}
      <div className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(ellipse 50% 50% at 100% 100%, rgba(245,158,11,0.10) 0%, transparent 60%)" }}
      />
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      {/* Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-700/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "5s" }} />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/12 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "7s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/5 rounded-full blur-[140px]" />

      {/* ── Floating department pills (desktop only) ── */}
      {FLOATING_TAGS.map((tag) => (
        <div key={tag.text}
          className="hidden lg:flex absolute items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white/55 animate-float"
          style={{
            top: tag.top, left: tag.left, right: tag.right,
            animationDelay: tag.delay,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
          } as React.CSSProperties}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
          {tag.text}
        </div>
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-32 text-center">

        {/* App preview pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8
          bg-gradient-to-r from-white/5 to-white/8 border border-white/12 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">Live</span>
          </div>
          <span className="w-px h-4 bg-white/20" />
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white/60 text-xs font-medium">AI-Powered Exit Exam Preparation</span>
        </div>

        {/* Title */}
        <div className="space-y-1 mb-7">
          <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black text-white leading-[0.95] tracking-tight">
            Pass Your
          </h1>
          <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black leading-[0.95] tracking-tight text-blue-gradient">
            Exit Exam
          </h1>
          <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black leading-[0.95] tracking-tight text-gold-gradient">
            Ethiopia
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/45 max-w-xl mx-auto leading-relaxed mb-10">
          Access 500+ past exam papers from 45+ Ethiopian universities. Take timed mock exams, get AI explanations, and track your progress to exam day.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link href="/register"
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm overflow-hidden transition-all shadow-2xl shadow-blue-600/30"
            style={{ background: "linear-gradient(135deg, #1a56db 0%, #2563eb 50%, #1d4ed8 100%)" }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #2563eb 100%)" }} />
            <GraduationCap className="relative w-5 h-5 text-white" />
            <span className="relative text-white">Start Free — No Card Needed</span>
            <ArrowRight className="relative w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/exams"
            className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(12px)", color: "white" }}
            onMouseEnter={() => {}} onMouseLeave={() => {}}
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Browse 500+ Exams</span>
          </Link>
        </div>

        {/* Trust indicators row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10">
          {[
            { icon: Shield,   text: "100% Free to Start",  color: "text-emerald-400" },
            { icon: Zap,      text: "AI Study Assistant",   color: "text-amber-400" },
            { icon: Users,    text: "25,000+ Students",     color: "text-blue-400" },
            { icon: BookOpen, text: "500+ Exam Papers",     color: "text-violet-400" },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2 text-white/38 text-sm">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              {text}
            </div>
          ))}
        </div>

        {/* Social proof + Department pills */}
        <div className="flex flex-col items-center gap-5">
          {/* Avatars */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {["A", "B", "D", "H", "Y", "J"].map((initial, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#08102a] flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/10"
                  style={{ background: `hsl(${200 + i * 28}, 72%, 48%)`, zIndex: 6 - i }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <p className="text-white/38 text-sm">
              Joined by <strong className="text-white/65 font-semibold">25,000+</strong> students this year
            </p>
          </div>

          {/* Scrolling department pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
            {DEPARTMENTS_PREVIEW.map((dept, i) => (
              <span key={dept}
                className="px-3 py-1 rounded-full text-xs font-medium text-white/45 animate-fade-in-up"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  animationDelay: `${i * 0.08}s`,
                  animationFillMode: "both",
                }}
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
        <div className="w-5 h-8 border border-white/15 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-1.5 bg-white/25 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
