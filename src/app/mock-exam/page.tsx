"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock, FileText, BookOpen, ChevronRight, PlayCircle,
  Lock, CheckCircle2, Star, Zap, AlertCircle, GraduationCap,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXAM_TYPES = [
  {
    id: "full",
    title: "Full-Length Exit Exam",
    description: "Complete simulation of the national exit exam with all subjects",
    duration: "3 hours",
    questions: 100,
    subjects: ["Core", "Department", "General"],
    difficulty: "Standard",
    premium: false,
    icon: "🎓",
    color: "from-blue-600 to-blue-800",
    popular: true,
  },
  {
    id: "subject-cs",
    title: "Computer Science",
    description: "Data Structures, Algorithms, OS, Networks, Databases",
    duration: "90 min",
    questions: 50,
    subjects: ["Algorithms", "OOP", "Databases", "Networks"],
    difficulty: "Medium",
    premium: false,
    icon: "💻",
    color: "from-indigo-600 to-indigo-800",
    popular: false,
  },
  {
    id: "subject-se",
    title: "Software Engineering",
    description: "SDLC, Design Patterns, Testing, Project Management",
    duration: "90 min",
    questions: 50,
    subjects: ["SDLC", "Design Patterns", "Testing"],
    difficulty: "Medium",
    premium: false,
    icon: "🖥️",
    color: "from-violet-600 to-violet-800",
    popular: false,
  },
  {
    id: "ai-adaptive",
    title: "AI Adaptive Test",
    description: "Questions adjust to your performance level in real-time",
    duration: "60 min",
    questions: 40,
    subjects: ["Adaptive", "Personalized"],
    difficulty: "Adaptive",
    premium: true,
    icon: "🤖",
    color: "from-purple-600 to-fuchsia-700",
    popular: false,
  },
  {
    id: "quick",
    title: "Quick Practice",
    description: "10-minute drill for fast revision before your exam",
    duration: "10 min",
    questions: 15,
    subjects: ["Mixed"],
    difficulty: "Easy",
    premium: false,
    icon: "⚡",
    color: "from-amber-500 to-amber-700",
    popular: false,
  },
  {
    id: "previous",
    title: "Previous Year Papers",
    description: "Timed simulation using real past exit exam questions",
    duration: "3 hours",
    questions: 100,
    subjects: ["2024", "2023", "2022"],
    difficulty: "Real Exam",
    premium: true,
    icon: "📜",
    color: "from-emerald-600 to-emerald-800",
    popular: false,
  },
];

const LEADERBOARD = [
  { rank: 1, name: "Dawit M.", score: 96, dept: "CS" },
  { rank: 2, name: "Hana B.", score: 94, dept: "Medicine" },
  { rank: 3, name: "Yonas T.", score: 92, dept: "Civil Eng." },
  { rank: 4, name: "Sara A.", score: 90, dept: "Law" },
  { rank: 5, name: "Abebe K.", score: 87, dept: "CS" },
];

export default function MockExamPage() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [step, setStep] = useState<"list" | "instructions">("list");

  const exam = EXAM_TYPES.find((e) => e.id === selectedExam);

  if (step === "instructions" && exam) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e] flex flex-col">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep("list")} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-sm text-gray-900 dark:text-white">Exam Instructions</span>
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
          {/* Exam summary card */}
          <div className={cn("relative rounded-2xl p-6 overflow-hidden text-white bg-gradient-to-br", exam.color)}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)" }}
            />
            <div className="relative flex items-start gap-5">
              <div className="text-5xl">{exam.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{exam.title}</h2>
                <p className="text-white/70 text-sm mt-1">{exam.description}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {[
                    { icon: Clock, val: exam.duration, label: "Duration" },
                    { icon: FileText, val: `${exam.questions} Q`, label: "Questions" },
                    { icon: Star, val: exam.difficulty, label: "Level" },
                  ].map(({ icon: Icon, val, label }) => (
                    <div key={label} className="flex items-center gap-2 glass px-3 py-2 rounded-xl border border-white/20">
                      <Icon className="w-4 h-4 text-white/70" />
                      <div>
                        <p className="text-xs font-bold">{val}</p>
                        <p className="text-[10px] text-white/50">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="premium-card p-6 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Read Before Starting
            </h3>
            <ul className="space-y-3">
              {[
                `This exam contains ${exam.questions} multiple-choice questions.`,
                `You have ${exam.duration} to complete the test. The timer starts immediately.`,
                "Each question has exactly one correct answer. Choose carefully.",
                "You can navigate between questions using the Previous/Next buttons.",
                "Mark questions for review using the flag icon — revisit before submitting.",
                "Once submitted, your answers cannot be changed.",
                `Do not close or refresh the browser during the exam.`,
                "AI explanations are available after you answer each question.",
              ].map((instruction, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{instruction}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects covered */}
          <div className="premium-card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              Subjects Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {exam.subjects.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <button onClick={() => setStep("list")}
              className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              Go Back
            </button>
            <Link href="/exam-practice"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-500 hover:to-blue-600 transition-all shadow-xl shadow-blue-600/25 text-sm"
            >
              <PlayCircle className="w-5 h-5" />
              Start Exam Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e]">

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b4b] via-[#1a3580] to-[#1e3a8a]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-[#0a0f1e] to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs mb-5">
            <Zap className="w-3.5 h-3.5" />
            Timed simulation exams — just like the real thing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Mock <span className="text-gold-gradient">Test Center</span>
          </h1>
          <p className="text-blue-100/70 text-lg max-w-xl mx-auto">
            Practice with full-length exit exams, subject-wise tests, and AI-adaptive questions.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Exam Cards ── */}
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Choose Your Test
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAM_TYPES.map((exam) => (
              <div key={exam.id}
                className={cn(
                  "premium-card p-5 flex flex-col gap-4 relative overflow-hidden cursor-pointer transition-all",
                  selectedExam === exam.id && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900",
                )}
                onClick={() => setSelectedExam(exam.id)}
              >
                {/* Popular badge */}
                {exam.popular && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                    POPULAR
                  </div>
                )}
                {/* Premium badge */}
                {exam.premium && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    PREMIUM
                  </div>
                )}

                {/* Gradient icon bg */}
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br shadow-lg", exam.color)}>
                  {exam.icon}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{exam.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{exam.description}</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{exam.duration}</span>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{exam.questions} Q</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">{exam.difficulty}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExam(exam.id);
                    setStep("instructions");
                  }}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    exam.premium
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-500/25"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20"
                  )}
                >
                  {exam.premium ? <><Lock className="w-4 h-4" />Unlock Premium</> : <><PlayCircle className="w-4 h-4" />Start Test</>}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Leaderboard ── */}
        <div className="premium-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Top Students This Week
            </h2>
            <Link href="/leaderboard" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              Full Board <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {LEADERBOARD.map((entry) => (
              <div key={entry.rank} className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors",
                entry.rank === 5
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                  entry.rank === 1 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                  : entry.rank === 2 ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  : entry.rank === 3 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                )}>
                  {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {entry.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.name}</p>
                  <p className="text-xs text-gray-400">{entry.dept}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{entry.score}%</span>
                </div>
                {entry.rank === 5 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold">YOU</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Payment options ── */}
        <div className="premium-card p-5 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-700/30">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-amber-500" />
                Unlock Premium — 150 ETB/month
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">AI explanations, adaptive tests, offline access, certificates</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Telebirr", icon: "📱", color: "bg-blue-600 hover:bg-blue-700" },
                  { label: "CBE Birr", icon: "🏦", color: "bg-emerald-600 hover:bg-emerald-700" },
                ].map(({ label, icon, color }) => (
                  <button key={label} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors shadow-md", color)}>
                    <span>{icon}</span>{label}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1">
              {["AI Explanations", "Offline Access", "Certificates", "Priority Support"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
