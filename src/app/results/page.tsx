"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award, CheckCircle2, XCircle, TrendingUp, Share2, Download,
  ChevronLeft, BarChart3, Target, Clock, BookOpen, Star,
  Trophy, RefreshCw, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SCORE = 82;
const TOTAL = 50;
const CORRECT = 41;
const INCORRECT = 9;
const TIME_TAKEN = "1h 23m";
const RANK = 42;
const TOTAL_STUDENTS = 1847;

const SUBJECT_SCORES = [
  { subject: "Data Structures",    score: 90, questions: 12, correct: 11, color: "bg-blue-500",    light: "bg-blue-50 dark:bg-blue-900/20",    text: "text-blue-600 dark:text-blue-400" },
  { subject: "Algorithms",         score: 83, questions: 10, correct: 8,  color: "bg-indigo-500",  light: "bg-indigo-50 dark:bg-indigo-900/20",  text: "text-indigo-600 dark:text-indigo-400" },
  { subject: "Operating Systems",  score: 75, questions: 8,  correct: 6,  color: "bg-violet-500",  light: "bg-violet-50 dark:bg-violet-900/20",  text: "text-violet-600 dark:text-violet-400" },
  { subject: "Computer Networks",  score: 80, questions: 10, correct: 8,  color: "bg-cyan-500",    light: "bg-cyan-50 dark:bg-cyan-900/20",    text: "text-cyan-600 dark:text-cyan-400" },
  { subject: "Databases",          score: 80, questions: 10, correct: 8,  color: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
];

const WRONG_QUESTIONS = [
  { q: 3,  text: "Which SQL clause filters aggregated data?",     correct: "HAVING",          given: "WHERE" },
  { q: 7,  text: "What is the space complexity of merge sort?",   correct: "O(n)",            given: "O(log n)" },
  { q: 12, text: "Which layer handles end-to-end communication?", correct: "Transport Layer", given: "Network Layer" },
  { q: 19, text: "RAID-5 requires a minimum of how many disks?",  correct: "3",               given: "2" },
];

const HISTORY = [
  { date: "Jun 10, 2026", score: 82, exam: "CS Exit Exam 2024", time: "1h 23m" },
  { date: "Jun 5, 2026",  score: 74, exam: "CS Mock Test",       time: "1h 45m" },
  { date: "May 29, 2026", score: 68, exam: "CS Exit Exam 2023", time: "2h 01m" },
  { date: "May 22, 2026", score: 61, exam: "Quick Practice",     time: "0h 48m" },
];

function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="-rotate-90" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-100 dark:text-gray-800" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-gray-900 dark:text-white">{score}%</span>
        <span className="text-xs font-medium text-gray-400 mt-0.5">Score</span>
      </div>
    </div>
  );
}

function BarChart({ data }: { data: typeof SUBJECT_SCORES }) {
  const max = 100;
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.subject} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.subject}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{item.correct}/{item.questions}</span>
              <span className={cn("text-sm font-bold", item.text)}>{item.score}%</span>
            </div>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-1000", item.color)}
              style={{ width: `${(item.score / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "breakdown" | "history">("overview");
  const percentile = Math.round(((TOTAL_STUDENTS - RANK) / TOTAL_STUDENTS) * 100);
  const passed = SCORE >= 50;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-sm text-gray-900 dark:text-white">Results & Analytics</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">
              <Download className="w-3.5 h-3.5" /> Certificate
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── Score Hero Card ── */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d1b4b] via-[#1a3580] to-[#1e40af] p-6 sm:p-8 text-white shadow-2xl shadow-blue-900/30">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 10%, rgba(245,158,11,0.8) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.3) 0%, transparent 40%)" }}
          />
          <div className="relative flex flex-col sm:flex-row items-center gap-8">
            {/* Score ring */}
            <ScoreRing score={SCORE} />

            {/* Details */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <p className="text-blue-200/70 text-sm">Computer Science Exit Exam 2024</p>
                <h2 className="text-2xl font-extrabold mt-1">
                  {passed ? "🎉 Congratulations!" : "Keep Practicing!"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold glass border border-white/20", passed ? "text-emerald-300" : "text-red-300")}>
                  {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {passed ? "PASSED" : "NOT PASSED"}
                </div>
                <div className="flex items-center gap-1.5 glass border border-white/20 px-3 py-1.5 rounded-lg text-sm">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Rank #{RANK} of {TOTAL_STUDENTS.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 glass border border-white/20 px-3 py-1.5 rounded-lg text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Top {100 - percentile}%</span>
                </div>
              </div>
              <p className="text-blue-200/60 text-sm">
                You scored higher than <strong className="text-amber-400">{percentile}%</strong> of students who took this exam.
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: CheckCircle2, label: "Correct", value: CORRECT, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { icon: XCircle,      label: "Incorrect", value: INCORRECT, color: "text-red-500 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-900/20" },
            { icon: Clock,        label: "Time Taken", value: TIME_TAKEN, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { icon: Target,       label: "Accuracy",   value: `${Math.round((CORRECT / TOTAL) * 100)}%`, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="premium-card p-5 text-center flex flex-col items-center gap-2">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <p className={cn("text-xl font-black", color)}>{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {(["overview", "breakdown", "history"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
                activeTab === tab
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Subject performance chart */}
            <div className="premium-card p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" /> Performance by Subject
              </h3>
              <BarChart data={SUBJECT_SCORES} />
            </div>

            {/* Certificate CTA */}
            {passed && (
              <div className="premium-card p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border-amber-200 dark:border-amber-700/30 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">Download Your Certificate</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Share your achievement on LinkedIn, Telegram, or print it out.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md shadow-amber-500/25 shrink-0">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            )}

            {/* Share result */}
            <div className="premium-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Share Your Result</p>
                <p className="text-xs text-gray-400 mt-0.5">Inspire your classmates by sharing your score</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {[
                  { label: "Telegram", bg: "bg-[#26A5E4] hover:bg-[#1d96d4]" },
                  { label: "Copy Link", bg: "bg-gray-700 hover:bg-gray-600" },
                ].map(({ label, bg }) => (
                  <button key={label} className={cn("px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors", bg)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "breakdown" && (
          <div className="space-y-4">
            <div className="premium-card p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Questions to Review ({WRONG_QUESTIONS.length})
              </h3>
              <div className="space-y-3">
                {WRONG_QUESTIONS.map((wq) => (
                  <div key={wq.q} className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold">Q{wq.q}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 no-select">{wq.text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                        <p className="text-[10px] text-red-500 font-semibold mb-0.5">YOUR ANSWER</p>
                        <p className="text-xs text-red-700 dark:text-red-300 font-medium">{wq.given}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                        <p className="text-[10px] text-emerald-600 font-semibold mb-0.5">CORRECT ANSWER</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{wq.correct}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study recommendation */}
            <div className="premium-card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-700/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Study Recommendations</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-3">Based on your weak areas</p>
                  <div className="flex flex-wrap gap-2">
                    {["SQL & Databases", "Sorting Algorithms", "OSI Model"].map((topic) => (
                      <span key={topic} className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="premium-card p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Your Score Trend
              </h3>
              {/* Simple visual trend */}
              <div className="flex items-end gap-3 h-24 mb-4">
                {HISTORY.slice().reverse().map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{h.score}%</span>
                    <div className="w-full rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${(h.score / 100) * 80}px`,
                        background: `linear-gradient(to top, #1a56db, #60a5fa)`,
                        opacity: i === HISTORY.length - 1 ? 1 : 0.5 + (i / (HISTORY.length - 1)) * 0.5,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {HISTORY.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      h.score >= 80 ? "bg-emerald-50 dark:bg-emerald-900/20" : h.score >= 60 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-red-50 dark:bg-red-900/20"
                    )}>
                      <FileText className={cn("w-4 h-4",
                        h.score >= 80 ? "text-emerald-600 dark:text-emerald-400" : h.score >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{h.exam}</p>
                      <p className="text-xs text-gray-400">{h.date} · {h.time}</p>
                    </div>
                    <span className={cn("text-sm font-bold",
                      h.score >= 80 ? "text-emerald-600 dark:text-emerald-400" : h.score >= 60 ? "text-amber-500 dark:text-amber-400" : "text-red-500 dark:text-red-400"
                    )}>
                      {h.score}%
                    </span>
                    {i === 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold">LATEST</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Retake CTA */}
            <div className="flex gap-3">
              <Link href="/exam-practice"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-600/25"
              >
                <RefreshCw className="w-4 h-4" /> Retake Exam
              </Link>
              <Link href="/mock-exam"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                <Star className="w-4 h-4 text-amber-500" /> More Tests
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
