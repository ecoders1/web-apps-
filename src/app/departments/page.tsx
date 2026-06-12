"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight, Search, Star, SlidersHorizontal, ChevronDown, BookOpen, Filter, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const UNIVERSITIES = [
  "All Universities", "Addis Ababa University", "Jimma University",
  "Mekelle University", "Hawassa University", "Bahir Dar University",
  "University of Gondar", "Haramaya University", "Arba Minch University",
];
const YEARS = ["All Years", "2024", "2023", "2022", "2021", "2020"];

const DEPARTMENTS = [
  { name: "Computer Science",       icon: "💻", slug: "cs",       exams: 45, category: "Technology",  color: "from-blue-500 to-blue-700",       ring: "ring-blue-200 dark:ring-blue-800",   bg: "bg-blue-50 dark:bg-blue-900/20",     badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", hot: true  },
  { name: "Software Engineering",   icon: "🖥️", slug: "se",       exams: 38, category: "Technology",  color: "from-indigo-500 to-indigo-700",   ring: "ring-indigo-200 dark:ring-indigo-800", bg: "bg-indigo-50 dark:bg-indigo-900/20", badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" },
  { name: "Information Technology", icon: "🌐", slug: "it",       exams: 32, category: "Technology",  color: "from-cyan-500 to-cyan-700",       ring: "ring-cyan-200 dark:ring-cyan-800",   bg: "bg-cyan-50 dark:bg-cyan-900/20",     badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300" },
  { name: "Nursing",                icon: "🩺", slug: "nursing",  exams: 42, category: "Health",      color: "from-rose-500 to-rose-700",       ring: "ring-rose-200 dark:ring-rose-800",   bg: "bg-rose-50 dark:bg-rose-900/20",     badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300", hot: true },
  { name: "Midwifery",              icon: "👶", slug: "midwifery",exams: 30, category: "Health",      color: "from-pink-500 to-pink-700",       ring: "ring-pink-200 dark:ring-pink-800",   bg: "bg-pink-50 dark:bg-pink-900/20",     badge: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300" },
  { name: "Public Health",          icon: "🏥", slug: "ph",       exams: 36, category: "Health",      color: "from-teal-500 to-teal-700",       ring: "ring-teal-200 dark:ring-teal-800",   bg: "bg-teal-50 dark:bg-teal-900/20",     badge: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300" },
  { name: "Medicine",               icon: "⚕️", slug: "medicine", exams: 50, category: "Health",      color: "from-emerald-500 to-emerald-700", ring: "ring-emerald-200 dark:ring-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-900/20", badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300", hot: true },
  { name: "Pharmacy",               icon: "💊", slug: "pharmacy", exams: 28, category: "Health",      color: "from-green-500 to-green-700",     ring: "ring-green-200 dark:ring-green-800", bg: "bg-green-50 dark:bg-green-900/20",   badge: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  { name: "Economics",              icon: "📊", slug: "econ",     exams: 25, category: "Business",    color: "from-amber-500 to-amber-700",     ring: "ring-amber-200 dark:ring-amber-800", bg: "bg-amber-50 dark:bg-amber-900/20",   badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
  { name: "Accounting & Finance",   icon: "💰", slug: "acct",     exams: 27, category: "Business",    color: "from-yellow-500 to-yellow-700",   ring: "ring-yellow-200 dark:ring-yellow-800", bg: "bg-yellow-50 dark:bg-yellow-900/20", badge: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" },
  { name: "Management",             icon: "📋", slug: "mgmt",     exams: 24, category: "Business",    color: "from-orange-500 to-orange-700",   ring: "ring-orange-200 dark:ring-orange-800", bg: "bg-orange-50 dark:bg-orange-900/20", badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
  { name: "Civil Engineering",      icon: "🏗️", slug: "civil",    exams: 38, category: "Engineering", color: "from-stone-500 to-stone-700",     ring: "ring-stone-200 dark:ring-stone-800", bg: "bg-stone-50 dark:bg-stone-900/20",   badge: "bg-stone-100 dark:bg-stone-900/40 text-stone-700 dark:text-stone-300" },
  { name: "Electrical Engineering", icon: "⚡", slug: "elec",     exams: 35, category: "Engineering", color: "from-violet-500 to-violet-700",   ring: "ring-violet-200 dark:ring-violet-800", bg: "bg-violet-50 dark:bg-violet-900/20", badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300" },
  { name: "Mechanical Engineering", icon: "⚙️", slug: "mech",     exams: 32, category: "Engineering", color: "from-slate-500 to-slate-700",     ring: "ring-slate-200 dark:ring-slate-800", bg: "bg-slate-50 dark:bg-slate-900/20",   badge: "bg-slate-100 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300" },
  { name: "Architecture",           icon: "🏛️", slug: "arch",     exams: 18, category: "Engineering", color: "from-purple-500 to-purple-700",   ring: "ring-purple-200 dark:ring-purple-800", bg: "bg-purple-50 dark:bg-purple-900/20", badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  { name: "Law",                    icon: "⚖️", slug: "law",      exams: 30, category: "Social",      color: "from-red-500 to-red-700",         ring: "ring-red-200 dark:ring-red-800",     bg: "bg-red-50 dark:bg-red-900/20",       badge: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
  { name: "Agriculture",            icon: "🌾", slug: "agri",     exams: 22, category: "Agriculture", color: "from-lime-500 to-lime-700",       ring: "ring-lime-200 dark:ring-lime-800",   bg: "bg-lime-50 dark:bg-lime-900/20",     badge: "bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300" },
  { name: "Veterinary Medicine",    icon: "🐾", slug: "vet",      exams: 20, category: "Agriculture", color: "from-fuchsia-500 to-fuchsia-700", ring: "ring-fuchsia-200 dark:ring-fuchsia-800", bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20", badge: "bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300" },
  { name: "Biology",                icon: "🔬", slug: "bio",      exams: 24, category: "Science",     color: "from-emerald-400 to-emerald-600", ring: "ring-emerald-200 dark:ring-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-900/20", badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  { name: "Chemistry",              icon: "⚗️", slug: "chem",     exams: 22, category: "Science",     color: "from-blue-400 to-blue-600",       ring: "ring-blue-200 dark:ring-blue-800",   bg: "bg-blue-50 dark:bg-blue-900/20",     badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  { name: "Mathematics",            icon: "📐", slug: "math",     exams: 28, category: "Science",     color: "from-indigo-400 to-indigo-600",   ring: "ring-indigo-200 dark:ring-indigo-800", bg: "bg-indigo-50 dark:bg-indigo-900/20", badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" },
  { name: "Physics",                icon: "🔭", slug: "phys",     exams: 25, category: "Science",     color: "from-sky-500 to-sky-700",         ring: "ring-sky-200 dark:ring-sky-800",     bg: "bg-sky-50 dark:bg-sky-900/20",       badge: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300" },
  { name: "English Language",       icon: "📝", slug: "eng",      exams: 20, category: "Arts",        color: "from-gray-500 to-gray-700",       ring: "ring-gray-200 dark:ring-gray-700",   bg: "bg-gray-50 dark:bg-gray-800/60",     badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
  { name: "Psychology",             icon: "🧠", slug: "psych",    exams: 18, category: "Social",      color: "from-pink-400 to-pink-600",       ring: "ring-pink-200 dark:ring-pink-800",   bg: "bg-pink-50 dark:bg-pink-900/20",     badge: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300" },
  { name: "Sociology",              icon: "👥", slug: "socio",    exams: 16, category: "Social",      color: "from-teal-400 to-teal-600",       ring: "ring-teal-200 dark:ring-teal-800",   bg: "bg-teal-50 dark:bg-teal-900/20",     badge: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300" },
  { name: "Geography",              icon: "🗺️", slug: "geo",      exams: 15, category: "Arts",        color: "from-green-400 to-green-600",     ring: "ring-green-200 dark:ring-green-800", bg: "bg-green-50 dark:bg-green-900/20",   badge: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  { name: "History",                icon: "📜", slug: "hist",     exams: 14, category: "Arts",        color: "from-amber-400 to-amber-600",     ring: "ring-amber-200 dark:ring-amber-800", bg: "bg-amber-50 dark:bg-amber-900/20",   badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
];

const CATEGORIES = [
  { id: "All",         label: "All",          icon: "🎓" },
  { id: "Technology",  label: "Technology",   icon: "💻" },
  { id: "Health",      label: "Health",       icon: "🏥" },
  { id: "Engineering", label: "Engineering",  icon: "⚙️" },
  { id: "Business",    label: "Business",     icon: "📊" },
  { id: "Science",     label: "Science",      icon: "🔬" },
  { id: "Social",      label: "Social",       icon: "👥" },
  { id: "Agriculture", label: "Agriculture",  icon: "🌾" },
  { id: "Arts",        label: "Arts",         icon: "📝" },
];

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [university, setUniversity] = useState("All Universities");
  const [year, setYear] = useState("All Years");
  const [favs, setFavs] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleFav = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFavs((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  const filtered = DEPARTMENTS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "All" || d.category === category;
    const matchFav    = !showFavsOnly || favs.includes(d.slug);
    return matchSearch && matchCat && matchFav;
  });

  const clearFilters = () => {
    setSearch(""); setCategory("All"); setShowFavsOnly(false);
    setUniversity("All Universities"); setYear("All Years");
  };
  const hasFilters = search || category !== "All" || showFavsOnly || university !== "All Universities" || year !== "All Years";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e]">
      <Navbar />

      {/* ── Premium Hero Section ── */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* BG Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#070d1c] via-[#0d1b4b] to-[#0a1540]" />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(245,158,11,0.2) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 30%, rgba(59,130,246,0.2) 0%, transparent 55%)",
        }} />
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 dark:from-[#0a0f1e] to-transparent" />

        {/* Orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "7s", animationDelay: "2s" }} />

        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/15 text-white/70 text-xs font-semibold backdrop-blur-sm shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {DEPARTMENTS.length} departments · 45+ universities · 500+ exam papers
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Find Your
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-gold-gradient">
              Department
            </h1>
          </div>

          <p className="text-blue-100/60 text-lg max-w-xl mx-auto leading-relaxed">
            Browse exit exam papers organized by field of study, university, and academic year.
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search any department…"
                className="w-full pl-12 pr-16 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm shadow-2xl shadow-black/20 border border-white/20 dark:border-gray-700 transition-all"
              />
              <button onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
                  showFilters
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                )}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Filter Bar ── */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Category pills */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                  category === cat.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                <span>{cat.icon}</span>
                {cat.label}
                {cat.id !== "All" && (
                  <span className={cn("ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                    category === cat.id ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}>
                    {DEPARTMENTS.filter(d => d.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0" />
            <button onClick={() => setShowFavsOnly(!showFavsOnly)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all",
                showFavsOnly
                  ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-amber-400"
              )}
            >
              <Star className={cn("w-3.5 h-3.5", showFavsOnly ? "fill-white text-white" : "")} />
              Saved {favs.length > 0 && `(${favs.length})`}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="py-3 flex flex-wrap items-center gap-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <Filter className="w-3.5 h-3.5" /> Filters:
              </div>
              <div className="relative">
                <select value={university} onChange={(e) => setUniversity(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                >
                  {UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={year} onChange={(e) => setYear(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                >
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Results & Grid ── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> of {DEPARTMENTS.length} departments
              </p>
              {category !== "All" && (
                <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                  {category}
                </span>
              )}
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button onClick={() => setViewMode("grid")}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "grid" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
                )}
              >
                Grid
              </button>
              <button onClick={() => setViewMode("list")}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "list" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
                )}
              >
                List
              </button>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No departments found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Try adjusting your filters or search term.</p>
              <button onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((dept) => (
                <Link key={dept.slug} href={`/departments/${dept.slug}`}
                  className="group relative flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:shadow-blue-500/8 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 hover-lift"
                >
                  {/* Hot badge */}
                  {dept.hot && (
                    <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[9px] font-black shadow-sm">
                      🔥 HOT
                    </div>
                  )}

                  {/* Fav button */}
                  <button onClick={(e) => toggleFav(dept.slug, e)}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle favourite"
                  >
                    <Star className={cn("w-4 h-4 transition-all",
                      favs.includes(dept.slug)
                        ? "fill-amber-400 text-amber-400 scale-110"
                        : "text-gray-300 dark:text-gray-600 group-hover:text-gray-400"
                    )} />
                  </button>

                  {/* Icon */}
                  <div className={cn(
                    "relative w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-md shrink-0 ring-4",
                    dept.color, dept.ring
                  )}>
                    {dept.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {dept.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", dept.badge)}>{dept.category}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <BookOpen className="w-3 h-3" />
                        {dept.exams} exams
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 absolute right-4 top-1/2 -translate-y-1/2" />
                </Link>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filtered.map((dept, i) => (
                <Link key={dept.slug} href={`/departments/${dept.slug}`}
                  className="group flex items-center gap-4 px-5 py-4 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/60 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <span className="text-gray-400 dark:text-gray-600 text-xs font-bold w-6 text-right shrink-0">{i + 1}</span>
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shadow-sm shrink-0", dept.color)}>
                    {dept.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{dept.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{dept.category}</p>
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", dept.badge)}>{dept.exams} exams</span>
                  <button onClick={(e) => toggleFav(dept.slug, e)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Star className={cn("w-4 h-4", favs.includes(dept.slug) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600")} />
                  </button>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
