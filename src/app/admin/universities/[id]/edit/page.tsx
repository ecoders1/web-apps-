"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

export default function EditUniversity() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ name: "", short_name: "", location: "", website: "", logo_url: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase.from("universities").select("*").eq("id", id).single();
      if (data) setForm({ name: data.name ?? "", short_name: data.short_name ?? "", location: data.location ?? "", website: data.website ?? "", logo_url: data.logo_url ?? "" });
      setFetching(false);
    }
    fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("universities").update(form).eq("id", id);
    if (error) { setError(error.message); setLoading(false); }
    else router.push("/admin/universities");
  };

  if (fetching) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/universities" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit University</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update university details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5">
        {error && <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">{error}</div>}

        {[
          { key: "name", label: "University Name *", placeholder: "Addis Ababa University", required: true },
          { key: "short_name", label: "Short Name", placeholder: "AAU" },
          { key: "location", label: "Location", placeholder: "Addis Ababa" },
          { key: "website", label: "Website", placeholder: "https://www.aau.edu.et" },
          { key: "logo_url", label: "Logo URL", placeholder: "https://..." },
        ].map(({ key, label, placeholder, required }) => (
          <div key={key} className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <input
              type={key === "website" || key === "logo_url" ? "url" : "text"}
              required={required}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Saving…" : "Save Changes"}
          </button>
          <Link href="/admin/universities" className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
