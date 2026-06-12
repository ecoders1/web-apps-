"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Download, Eye, FileText, Calendar, Search, Filter, ChevronDown, Star, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EXAMS = [
  { id: 1,  title: "Computer Science Exit Exam",       university: "Addis Ababa University", department: "Computer Science",      year: 2024, pages: 12, downloads: 3842, premium: false, slug: "cs-aau-2024"    },
  { id: 2,  title: "Civil Engineering Exit Exam",       university: "Jimma University",       department: "Civil Engineering",     year: 2024, pages: 16, downloads: 2915, premium: false, slug: "civil-ju-2024"  },
  { id: 3,  title: "Medicine Exit Exam",                university: "Hawassa University",     department: "Medicine",              year: 2023, pages: 20, downloads: 4201, premium: false, slug: "med-hu-2023"    },
  { id: 4,  title: "Law Exit Exam",                     university: "Mekelle University",     department: "Law",                   year: 2024, pages: 14, downloads: 1738, premium: false, slug: "law-mu-2024"    },
  { id: 5,  title: "Accounting & Finance Exit Exam",    university: "Bahir Dar University",   department: "Accounting & Finance",  year: 2023, pages: 10, downloads: 2100, premium: false, slug: "acct-bdu-2023"  },
  { id: 6,  title: "Electrical Engineering Exit Exam",  university: "Gondar University",      department: "Electrical Engineering",year: 2023, pages: 18, downloads: 1980, premium: false, slug: "ee-uog-2023"    },
  { id: 7,  title: "Pharmacy Exit Exam",                university: "Haramaya University",    department: "Pharmacy",              year: 2024, pages: 15, downloads: 2330, premium: true,  slug: "pharm-haru-2024"},
  { id: 8,  title: "Economics Exit Exam",               university: "Arba Minch University",  department: "Economics",             year: 2022, pages: 11, downloads: 1545, premium: false, slug: "econ-amu-2022"  },
  { id: 9,  title: "Mechanical Engineering Exit Exam",  university: "Jimma University",       department: "Mechanical Engineering",year: 2024, pages: 17, downloads: 1820, premium: false, slug: "me-ju-2024"     },
  { id: 10, title: "Nursing Exit Exam",                 university: "Addis Ababa University", department: "Nursing",               year: 2024, pages: 13, downloads: 2650, premium: true,  slug: "nursing-aau-2024"},
  { id: 11, title: "Architecture Exit Exam",            university: "Bahir Dar University",   department: "Architecture",          year: 2023, pages: 14, downloads: 1210, premium: true,  slug: "arch-bdu-2023"  },
  { id: 12, title: "Mathematics Exit Exam",             university: "Mekelle University",     department: "Mathematics",           year: 2024, pages: 11, downloads: 1425, premium: false, slug: "math-mu-2024"   },
];

const UNIVERSITIES = ["All Universities", "Addis Ababa University", "Jimma University", "Mekelle University", "Hawassa University", "Bahir Dar University"];
const YEARS = ["All Years", "2024", "2023", "2022"];
const DEPTS = ["All Departments", "Computer Science", "Medicine", "Civil Engineering", "Law", "Accounting & Finance", "Electrical Engineering"];

export default function ExamsPage() {
  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState("All Universities");
  const [year, setYear] = useState("All Years");
  const [dept, setDept] = useState("All Departments");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  const filtered = EXAMS.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase());
    const matchUni = university === "All Universities" || e.university === university;
    const matchYear = year === "All Years" || e.year.toString() === year;
    const matchDept = dept === "All Departments" || e.department === dept;
    return matchSearch && matchUni && matchYear && matchDept;
  }).sort((a, b) => sortBy === "newest" ? b.year - a.year : b.downloads - a.downloads);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b4b] via-[#1a3580] to-[#1e3a8a]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-[#0a0f1e] to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs mb-5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            {EXAMS.length} exam papers available
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Past <span className="text-gold-gradient">Exam Papers</span>
          </h1>
          <p className="text-blue-100/70 text-lg max-w-xl mx-auto mb-8">
            Access past exit exam papers from all Ethiopian universities and departments.
          </p>
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by department, university…"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm shadow-xl border border-white/10"
            />
          </div>
        </div>
      </section>

      {/* ── Filters bar ── */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-3 items-center">
          {/* University */}
          <div className="relative">
            <select value={university} onChange={(e) => setUniversity(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          {/* Department */}
          <div className="relative">
            <select value={dept} onChange={(e) => setDept(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {DEPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          {/* Year */}
          <div className="relative">
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {(["newest", "popular"] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  sortBy === s ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
                )}
              >
                {s === "newest" ? "📅 Newest" : "🔥 Popular"}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400">{filtered.length} results</span>
        </div>
      </div>

      {/* ── Exams Grid ── */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-400 text-lg">No exams match your filters</p>
              <button onClick={() => { setSearch(""); setUniversity("All Universities"); setYear("All Years"); setDept("All Departments"); }}
                className="mt-4 text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((exam) => (
                <div key={exam.id} className="premium-card p-5 flex flex-col gap-4 relative group">
                  {/* Premium badge */}
                  {exam.premium && (
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold z-10">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      PREMIUM
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 pr-12">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">{exam.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 truncate">{exam.university}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {exam.department}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />{exam.year}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {exam.pages}pp
                    </span>
                  </div>

                  {/* Downloads */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Download className="w-3.5 h-3.5" />
                    {exam.downloads.toLocaleString()} downloads
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Link href={`/exams/${exam.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </Link>
                    {exam.premium ? (
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold hover:from-amber-500 hover:to-amber-600 transition-all shadow-md shadow-amber-500/20">
                        <Lock className="w-3.5 h-3.5" /> Unlock
                      </button>
                    ) : (
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
