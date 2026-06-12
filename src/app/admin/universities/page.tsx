"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Search, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";

interface University {
  id: string;
  name: string;
  short_name: string;
  location: string;
  website: string;
  created_at: string;
}

export default function AdminUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("universities")
      .select("*")
      .order("created_at", { ascending: false });
    setUniversities(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this university? This cannot be undone.")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("universities").delete().eq("id", id);
    await fetchData();
    setDeleting(null);
  };

  const filtered = universities.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Universities</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{universities.length} total</p>
        </div>
        <Link href="/admin/universities/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add University
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search universities…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No universities found.</p>
            <Link href="/admin/universities/new" className="text-blue-500 text-sm mt-2 inline-block hover:underline">Add one</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Short</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Location</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Website</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((uni) => (
                  <tr key={uni.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{uni.name}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{uni.short_name || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />{uni.location || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                      {uni.website ? <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">{uni.website}</a> : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/universities/${uni.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-600 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(uni.id)} disabled={deleting === uni.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-40">
                          {deleting === uni.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
