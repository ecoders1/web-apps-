import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MapPin, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

const universities = [
  { name: "Addis Ababa University", location: "Addis Ababa", departments: 42, exams: 210, slug: "aau" },
  { name: "Jimma University", location: "Jimma", departments: 28, exams: 140, slug: "ju" },
  { name: "Mekelle University", location: "Mekelle", departments: 25, exams: 125, slug: "mu" },
  { name: "Hawassa University", location: "Hawassa", departments: 30, exams: 150, slug: "hu" },
  { name: "Bahir Dar University", location: "Bahir Dar", departments: 27, exams: 135, slug: "bdu" },
  { name: "Gondar University", location: "Gondar", departments: 22, exams: 110, slug: "uog" },
  { name: "Haramaya University", location: "Haramaya", departments: 20, exams: 100, slug: "haromaya" },
  { name: "Arba Minch University", location: "Arba Minch", departments: 18, exams: 90, slug: "amu" },
  { name: "Dire Dawa University", location: "Dire Dawa", departments: 15, exams: 75, slug: "ddu" },
  { name: "Wolkite University", location: "Wolkite", departments: 14, exams: 70, slug: "wku" },
  { name: "Debre Markos University", location: "Debre Markos", departments: 16, exams: 80, slug: "dmu" },
  { name: "Woldia University", location: "Woldia", departments: 13, exams: 65, slug: "wdu" },
];

export default function UniversitiesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <section className="pt-28 pb-14 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Universities</h1>
          <p className="mt-4 text-blue-100 text-lg max-w-xl mx-auto">
            Browse exit exam materials from all accredited Ethiopian universities.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{universities.length}</span> universities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni) => (
              <Link
                key={uni.slug}
                href={`/universities/${uni.slug}`}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {uni.name.charAt(0)}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">{uni.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  {uni.location}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{uni.departments}</div>
                    <div className="text-xs text-gray-400">Departments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{uni.exams}</div>
                    <div className="text-xs text-gray-400">Exams</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
