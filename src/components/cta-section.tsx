import Link from "next/link";
import { ArrowRight, GraduationCap, Zap, CheckCircle2 } from "lucide-react";

const PERKS = [
  "500+ past exam papers",
  "AI-powered explanations",
  "Timed mock tests",
  "Progress analytics",
  "Download for offline",
  "No credit card needed",
];

export function CtaSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d1b4b] via-[#1a3580] to-[#1e3a8a] p-8 sm:p-12 text-white shadow-2xl shadow-blue-900/30">
          {/* Background accents */}
          <div className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(245,158,11,0.20) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.06) 0%, transparent 50%)" }}
          />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />

          <div className="relative flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              Free forever — no card required
            </div>

            <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-5">
              <span className="text-gold-gradient">Your Exit Exam Today</span>
            </h2>

            <p className="text-blue-200/70 text-lg max-w-xl mb-8">
              Join 25,000+ Ethiopian university students who use Exit Exam Ethiopia every day to prepare, practice, and pass.
            </p>

            {/* Perks grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 w-full max-w-lg">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-2 text-sm text-blue-100/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {perk}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link href="/register"
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-black hover:from-amber-300 hover:to-amber-400 transition-all shadow-2xl shadow-amber-500/30 text-sm"
              >
                <GraduationCap className="w-5 h-5" />
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/exams"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-sm"
              >
                Browse Exams First
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
