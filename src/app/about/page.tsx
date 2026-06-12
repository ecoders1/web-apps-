import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GraduationCap, Target, Eye, Users, BookOpen, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">About Exit Exam Ethiopia</h1>
          <p className="mt-5 text-xl text-blue-100 max-w-2xl mx-auto">
            Our mission is to make quality exam preparation resources accessible to every university student in Ethiopia.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To provide every Ethiopian university student with comprehensive, up-to-date, and accessible exit exam preparation materials, tools, and resources — completely free of charge.",
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: "A future where no Ethiopian student fails their exit exam due to lack of preparation resources. We envision a generation of well-prepared, confident graduates who contribute meaningfully to their nation.",
                color: "text-indigo-600 dark:text-indigo-400",
                bg: "bg-indigo-50 dark:bg-indigo-900/20",
              },
            ].map(({ icon: Icon, title, text, color, bg }) => (
              <div key={title} className="p-8 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${bg}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Accessibility", text: "Free resources for every student regardless of location or financial situation." },
              { icon: BookOpen, title: "Quality", text: "Curated, verified exam materials from all accredited Ethiopian universities." },
              { icon: Award, title: "Excellence", text: "We continuously improve our platform to help students achieve their best results." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Built by Ethiopians, for Ethiopians</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our team consists of passionate educators, software engineers, and former students who understand the challenges of the Ethiopian university exit examination system.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
