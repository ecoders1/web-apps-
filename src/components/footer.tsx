import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Exit Exam <span className="text-blue-400">Ethiopia</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering Ethiopian university students to prepare, practice, and succeed in their national exit examinations.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-blue-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/universities", label: "Universities" },
                { href: "/departments", label: "Departments" },
                { href: "/exams", label: "Exams" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              {[
                { href: "/exams", label: "Past Exam Papers" },
                { href: "/mock-exam", label: "Mock Exams" },
                { href: "/ai-assistant", label: "AI Study Assistant" },
                { href: "/results", label: "Exam Results" },
                { href: "/register", label: "Create Account" },
                { href: "/login", label: "Student Login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+251900000000" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  +251 900 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:info@exitexamethiopia.com" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  info@exitexamethiopia.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              © 2026 Exit Exam Ethiopia. All rights reserved.
            </p>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-600/15 border border-blue-500/20 text-xs font-medium text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
