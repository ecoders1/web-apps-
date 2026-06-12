import Link from "next/link";
import { GraduationCap, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
      <div className="w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
        <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-8xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/exams"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Search className="w-4 h-4" />
          Browse Exams
        </Link>
      </div>
    </div>
  );
}
