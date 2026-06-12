"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Flag, Clock, CheckCircle2, XCircle,
  BarChart3, GraduationCap, AlertCircle, Bot, Zap, BookOpen,
  Trophy, RefreshCw, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    id: 1,
    subject: "Algorithms",
    difficulty: "Medium",
    text: "Which of the following best describes the time complexity of binary search on a sorted array of n elements?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    correct: 1,
    explanation: "Binary search divides the search space in half with each comparison, giving it O(log n) time complexity. At each step, the algorithm eliminates half of the remaining elements, so it takes at most log₂(n) comparisons to find a value or confirm it's absent.",
  },
  {
    id: 2,
    subject: "OOP",
    difficulty: "Easy",
    text: "In object-oriented programming, what is the concept of hiding internal implementation details from the outside world?",
    options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
    correct: 2,
    explanation: "Encapsulation is the bundling of data with the methods that operate on that data, restricting direct access to internal components. It protects the integrity of an object by preventing outside code from directly accessing or modifying its internal state.",
  },
  {
    id: 3,
    subject: "Databases",
    difficulty: "Medium",
    text: "Which SQL clause is used to filter results based on a condition applied to aggregated data?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correct: 1,
    explanation: "HAVING filters groups after aggregation (GROUP BY), unlike WHERE which filters individual rows before aggregation. HAVING can use aggregate functions like COUNT(), SUM(), and AVG(), but WHERE cannot.",
  },
  {
    id: 4,
    subject: "Networks",
    difficulty: "Hard",
    text: "In networking, which layer of the OSI model is responsible for end-to-end communication and data flow control?",
    options: ["Network Layer", "Data Link Layer", "Transport Layer", "Session Layer"],
    correct: 2,
    explanation: "The Transport Layer (Layer 4) provides end-to-end communication services, including flow control, error detection and correction, and connection multiplexing. TCP and UDP are the two main protocols at this layer.",
  },
  {
    id: 5,
    subject: "Data Structures",
    difficulty: "Easy",
    text: "Which data structure follows the Last In First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    correct: 1,
    explanation: "A Stack follows LIFO — the most recently added element is the first one removed. Key operations are push (add) and pop (remove). Common uses include function call stacks, expression parsing, undo mechanisms, and depth-first search.",
  },
];

const TOTAL_TIME = 20 * 60;
const DIFFICULTY_COLORS = {
  Easy:   "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  Medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Hard:   "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

function CircularTimer({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct  = timeLeft / total;
  const r    = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const urgent = timeLeft < 120;
  const color  = urgent ? "#ef4444" : timeLeft < 300 ? "#f59e0b" : "#1a56db";

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="-rotate-90 absolute inset-0" width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-100 dark:text-gray-800" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={cn("text-xs font-black tabular-nums leading-none", urgent ? "text-red-500" : "text-gray-900 dark:text-white")}>
          {formatTime(timeLeft)}
        </span>
        <span className="text-[8px] text-gray-400 mt-0.5">left</span>
      </div>
    </div>
  );
}

export default function ExamPracticePage() {
  const [current, setCurrent]             = useState(0);
  const [selected, setSelected]           = useState<Record<number, number>>({});
  const [marked, setMarked]               = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft]           = useState(TOTAL_TIME);
  const [submitted, setSubmitted]         = useState(false);
  const [showAI, setShowAI]               = useState(false);
  const [aiTyping, setAiTyping]           = useState(false);
  const [aiVisible, setAiVisible]         = useState("");

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  // Simulate AI typing
  const handleShowAI = useCallback(() => {
    if (showAI) { setShowAI(false); setAiVisible(""); return; }
    setShowAI(true);
    setAiTyping(true);
    setAiVisible("");
    const text = QUESTIONS[current].explanation;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAiVisible(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setAiTyping(false); }
    }, 12);
  }, [showAI, current]);

  const q = QUESTIONS[current];
  const isAnswered = selected[current] !== undefined;
  const isMarked   = marked.has(current);
  const progress   = (Object.keys(selected).length / QUESTIONS.length) * 100;
  const urgent     = timeLeft < 120;
  const score      = QUESTIONS.reduce((acc, _, i) => acc + (selected[i] === QUESTIONS[i].correct ? 1 : 0), 0);
  const accuracy   = Object.keys(selected).length > 0
    ? Math.round((score / Object.keys(selected).length) * 100) : 0;

  const toggleMark = () => setMarked((prev) => {
    const next = new Set(prev);
    next.has(current) ? next.delete(current) : next.add(current);
    return next;
  });

  const nav = (dir: number) => {
    setCurrent(Math.max(0, Math.min(QUESTIONS.length - 1, current + dir)));
    setShowAI(false); setAiVisible("");
  };

  // ── Results Screen ──
  if (submitted) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const passed = pct >= 50;
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-4">

          {/* Score card */}
          <div className="premium-card p-7 text-center space-y-5">
            {/* Trophy */}
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl",
              passed
                ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/30"
                : "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/30"
            )}>
              {passed ? <Trophy className="w-10 h-10 text-white" /> : <BarChart3 className="w-10 h-10 text-white" />}
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">{passed ? "🎉 Excellent work!" : "Keep practicing!"}</p>
              <div className="text-5xl font-black text-gold-gradient">{pct}%</div>
              <p className="text-gray-400 text-sm mt-1">{score} / {QUESTIONS.length} correct</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                <p className="text-emerald-600 dark:text-emerald-400 text-xl font-black">{score}</p>
                <p className="text-[10px] text-emerald-500/70 font-semibold">Correct</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                <p className="text-red-500 dark:text-red-400 text-xl font-black">{QUESTIONS.length - score}</p>
                <p className="text-[10px] text-red-500/70 font-semibold">Incorrect</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                <p className="text-amber-600 dark:text-amber-400 text-xl font-black">{marked.size}</p>
                <p className="text-[10px] text-amber-500/70 font-semibold">Marked</p>
              </div>
            </div>

            {/* Time used */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              Time used: <strong className="text-gray-700 dark:text-gray-300">{formatTime(TOTAL_TIME - timeLeft)}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { setCurrent(0); setSelected({}); setMarked(new Set()); setTimeLeft(TOTAL_TIME); setSubmitted(false); setShowAI(false); setAiVisible(""); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-600/25"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <Link href="/results"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              <BarChart3 className="w-4 h-4" /> Full Results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Exam Screen ──
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e] flex flex-col">

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/exams"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate leading-none">
                Computer Science — 2024
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Exam Practice Mode</p>
            </div>
          </div>

          {/* Live stats */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{score} correct</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{accuracy}% acc.</span>
            </div>
          </div>

          {/* Circular timer */}
          <CircularTimer timeLeft={timeLeft} total={TOTAL_TIME} />
        </div>

        {/* Overall progress bar */}
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800/80">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 flex flex-col gap-5">

        {/* ── Question Navigator ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {QUESTIONS.map((_, i) => {
            const answered = selected[i] !== undefined;
            const correct  = answered && selected[i] === QUESTIONS[i].correct;
            const wrong    = answered && selected[i] !== QUESTIONS[i].correct;
            const isMark   = marked.has(i);
            return (
              <button key={i}
                onClick={() => { setCurrent(i); setShowAI(false); setAiVisible(""); }}
                className={cn(
                  "w-10 h-10 rounded-xl text-xs font-bold transition-all border-2 relative",
                  i === current
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 scale-110"
                    : correct
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : wrong
                        ? "bg-red-500 text-white border-red-500 shadow-sm"
                        : isMark
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-400"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400"
                )}
              >
                {isMark && i !== current ? "⚑" : i + 1}
                {/* Answered dot */}
                {answered && i !== current && (
                  <span className={cn("absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-gray-900",
                    correct ? "bg-emerald-400" : "bg-red-400"
                  )} />
                )}
              </button>
            );
          })}
          <div className="ml-auto text-xs text-gray-400 font-medium">
            {Object.keys(selected).length}/{QUESTIONS.length} answered
          </div>
        </div>

        {/* ── Question Card ── */}
        <div className="premium-card p-5 sm:p-7 space-y-6">

          {/* Question header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
                Q{current + 1} / {QUESTIONS.length}
              </span>
              <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold">
                {q.subject}
              </span>
              <span className={cn("px-2 py-1 rounded-lg text-xs font-bold", DIFFICULTY_COLORS[q.difficulty as keyof typeof DIFFICULTY_COLORS])}>
                {q.difficulty}
              </span>
              {isAnswered && (
                selected[current] === q.correct
                  ? <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" />Correct!</span>
                  : <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 font-bold"><XCircle className="w-3.5 h-3.5" />Incorrect</span>
              )}
            </div>
            <button onClick={toggleMark}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0",
                isMarked
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700"
                  : "text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-amber-300 hover:text-amber-600"
              )}
            >
              <Flag className="w-3.5 h-3.5" />
              {isMarked ? "Marked" : "Mark"}
            </button>
          </div>

          {/* Question text */}
          <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-relaxed no-select">
            {q.text}
          </p>

          {/* Answer options */}
          <div className="space-y-3">
            {q.options.map((opt, oi) => {
              const isSelected = selected[current] === oi;
              const isCorrect  = oi === q.correct;
              return (
                <button key={oi}
                  onClick={() => { if (!isAnswered) { setSelected((p) => ({ ...p, [current]: oi })); setShowAI(false); setAiVisible(""); } }}
                  disabled={isAnswered}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all text-sm font-medium group",
                    !isAnswered && "hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/60 dark:hover:bg-blue-900/10 cursor-pointer active:scale-[0.99]",
                    isAnswered && isCorrect && "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600",
                    isAnswered && isSelected && !isCorrect && "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-600",
                    isAnswered && !isSelected && !isCorrect && "border-gray-100 dark:border-gray-800 opacity-50",
                    !isAnswered && !isSelected && "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50",
                    !isAnswered && isSelected && "border-blue-500 bg-blue-50/80 dark:bg-blue-900/20",
                  )}
                >
                  {/* Option bubble */}
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-all",
                    isAnswered && isCorrect ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : isAnswered && isSelected && !isCorrect ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                    : isSelected ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                  )}>
                    {["A", "B", "C", "D"][oi]}
                  </div>
                  <span className={cn("flex-1 no-select leading-relaxed",
                    isAnswered && isCorrect ? "text-emerald-800 dark:text-emerald-200 font-semibold"
                    : isAnswered && isSelected && !isCorrect ? "text-red-700 dark:text-red-300 font-semibold"
                    : "text-gray-800 dark:text-gray-200"
                  )}>
                    {opt}
                  </span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* AI Explanation */}
          {isAnswered && (
            <div className="space-y-3">
              <button onClick={handleShowAI}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md",
                  showAI
                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-violet-500/25"
                )}
              >
                <Bot className="w-4 h-4" />
                {showAI ? "Hide AI Explanation" : "✨ Show AI Explanation"}
              </button>

              {showAI && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-violet-700 dark:text-violet-300">AI Explanation</p>
                      {aiTyping && <p className="text-[10px] text-violet-500/70">Typing…</p>}
                    </div>
                  </div>
                  <p className="text-sm text-violet-800 dark:text-violet-200 leading-relaxed no-select">
                    {aiVisible}
                    {aiTyping && <span className="animate-pulse">▌</span>}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No answer yet hint */}
          {!isAnswered && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">Select an answer above. Once selected, you cannot change it.</p>
            </div>
          )}
        </div>

        {/* ── Navigation buttons ── */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => nav(-1)}
            disabled={current === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Question dots (mobile) */}
          <div className="flex gap-1 sm:hidden">
            {QUESTIONS.map((_, i) => (
              <button key={i} onClick={() => { setCurrent(i); setShowAI(false); }}
                className={cn("w-2 h-2 rounded-full transition-all",
                  i === current ? "bg-blue-600 w-4" :
                  selected[i] !== undefined ? (selected[i] === QUESTIONS[i].correct ? "bg-emerald-400" : "bg-red-400") :
                  "bg-gray-300 dark:bg-gray-600"
                )}
              />
            ))}
          </div>

          {current === QUESTIONS.length - 1 ? (
            <button onClick={() => setSubmitted(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-500/25 text-sm"
            >
              <Send className="w-4 h-4" /> Submit Exam
            </button>
          ) : (
            <button onClick={() => nav(1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/25 text-sm"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Bottom info row ── */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Computer Science · AAU · 2024
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{score} correct</span>
            <span className="flex items-center gap-1"><Flag className="w-3 h-3 text-amber-500" />{marked.size} marked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
