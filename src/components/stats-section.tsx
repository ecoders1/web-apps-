"use client";

import { useEffect, useRef, useState } from "react";
import { University, BookOpen, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: University,
    value: 45,
    suffix: "+",
    label: "Universities",
    sub: "Across Ethiopia",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "rgba(59,130,246,0.25)",
    accent: "#3b82f6",
  },
  {
    icon: BookOpen,
    value: 27,
    suffix: "+",
    label: "Departments",
    sub: "All fields covered",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.25)",
    accent: "#f59e0b",
  },
  {
    icon: FileText,
    value: 500,
    suffix: "+",
    label: "Exam Papers",
    sub: "Updated regularly",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "rgba(139,92,246,0.25)",
    accent: "#8b5cf6",
  },
  {
    icon: Users,
    value: 25000,
    suffix: "+",
    label: "Students",
    sub: "Active this year",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "rgba(16,185,129,0.25)",
    accent: "#10b981",
  },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(ease(progress) * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({
  icon: Icon, value, suffix, label, sub,
  color, bg, border, glow, animate,
}: (typeof stats)[0] & { animate: boolean }) {
  const count = useCountUp(value, 2200, animate);

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center text-center p-7 rounded-2xl border transition-all duration-300 cursor-default",
        "hover:-translate-y-1.5",
        bg, border
      )}
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)" }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `0 0 30px ${glow}`, background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, transparent 70%)` }}
      />

      <div className={cn("relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300", bg)}>
        <Icon className={cn("w-6 h-6", color)} />
      </div>

      <div className="relative">
        <div className="text-[2.6rem] font-black text-white leading-none tracking-tight">
          {count.toLocaleString()}
          <span className={cn("ml-1 text-2xl font-black", color)}>{suffix}</span>
        </div>
        <p className="mt-2 text-sm font-bold text-white/70">{label}</p>
        <p className="mt-0.5 text-xs text-white/30">{sub}</p>
      </div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #060c1a, #080e20)" }}
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
}
