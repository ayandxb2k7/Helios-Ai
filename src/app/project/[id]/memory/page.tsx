"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Pin,
  Brain,
  Shield,
  Code2,
  GitBranch,
  Activity,
  FileText,
  Clock,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

interface MemoryEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  timestamp: string;
  pinned: boolean;
  icon: React.ElementType;
}

const memoryEntries: MemoryEntry[] = [
  { id: "1", category: "Analysis", title: "Initial project scan completed", content: "Detected Next.js 15, React 19, TypeScript, Tailwind CSS, Drizzle ORM, PostgreSQL. 247 files scanned, 34 components, 12 API endpoints, 8 database models.", timestamp: "2 hours ago", pinned: true, icon: Brain },
  { id: "2", category: "Security", title: "Security audit #1 — Critical issues found", content: "2 critical security issues: hardcoded API key in config.ts, missing JWT secret validation. 3 medium issues: permissive CORS, outdated jsonwebtoken, unprotected admin endpoint.", timestamp: "2 hours ago", pinned: true, icon: Shield },
  { id: "3", category: "Architecture", title: "Architecture analysis complete", content: "Clean App Router structure with proper separation of concerns. Circular dependency detected between auth.ts and users.ts. Missing service layer for business logic.", timestamp: "2 hours ago", pinned: false, icon: GitBranch },
  { id: "4", category: "Code Review", title: "Code review — Score: 73/100", content: "Readability: 85, Maintainability: 78, Security: 72, Scalability: 75, Performance: 82, Architecture: 88, Testing: 45, Documentation: 58. Key areas for improvement: Testing and Documentation.", timestamp: "1 hour ago", pinned: false, icon: Code2 },
  { id: "5", category: "Performance", title: "Performance scan — Bundle analysis", content: "Total estimated bundle: 3.8MB. Largest packages: Monaco Editor (1.2MB), Recharts (890KB), Framer Motion (450KB). ~40% reduction possible with dynamic imports.", timestamp: "1 hour ago", pinned: false, icon: Activity },
  { id: "6", category: "Testing", title: "Test coverage baseline", content: "Current coverage: ~2%. Only 2 unit tests found. Generated 5 test suites targeting 80%+ coverage: auth.test.ts, users-api.test.ts, Button.test.tsx, auth-integration.test.ts, utils.test.ts.", timestamp: "45 min ago", pinned: false, icon: Code2 },
  { id: "7", category: "Documentation", title: "Documentation generated", content: "7 documentation files generated: README, API Docs, Architecture Docs, Folder Documentation, Database Documentation, Setup Guide, Deployment Guide.", timestamp: "30 min ago", pinned: false, icon: FileText },
  { id: "8", category: "Roadmap", title: "Project roadmap created", content: "23 improvement items across 6 categories: Critical Fixes (3), Security (4), Performance (4), Testing (5), Architecture (3), Deployment (4). Estimated timeline: 2-3 weeks.", timestamp: "20 min ago", pinned: true, icon: Star },
  { id: "9", category: "Bug Detection", title: "Bug scan — 12 issues found", content: "2 critical (missing null check, unhandled promise), 3 high (missing error handling, circular deps, memory leak), 5 medium, 2 low. All issues include fix suggestions.", timestamp: "15 min ago", pinned: false, icon: Code2 },
  { id: "10", category: "Dependencies", title: "Dependency audit complete", content: "15 dependencies analyzed. 2 unused (moment, lodash). 5 outdated. 1 vulnerability (jsonwebtoken). Estimated bundle savings from removal: ~1.7MB.", timestamp: "10 min ago", pinned: false, icon: GitBranch },
];

const categoryColors: Record<string, string> = {
  Analysis: "badge-purple",
  Security: "badge-rose",
  Architecture: "badge-cyan",
  "Code Review": "badge-amber",
  Performance: "badge-emerald",
  Testing: "badge-amber",
  Documentation: "badge-cyan",
  Roadmap: "badge-purple",
  "Bug Detection": "badge-rose",
  Dependencies: "badge-cyan",
};

export default function MemoryPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pinned">("all");
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const filtered = memoryEntries.filter((e) => {
    if (filter === "pinned" && !e.pinned) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pinnedCount = memoryEntries.filter((e) => e.pinned).length;

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <History className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Project Memory</h1>
        </div>
        <p className="text-helios-400">History of AI analyses, reports, and developer notes for this project.</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 text-center">
          <History className="w-5 h-5 text-accent-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{memoryEntries.length}</div>
          <div className="text-xs text-helios-400">Total Entries</div>
        </div>
        <div className="glass p-4 text-center">
          <Pin className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{pinnedCount}</div>
          <div className="text-xs text-helios-400">Pinned</div>
        </div>
        <div className="glass p-4 text-center">
          <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <div className="text-xl font-bold">Today</div>
          <div className="text-xs text-helios-400">Last Activity</div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-helios-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search memory..." className="w-full pl-11 pr-4 py-2.5 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50" />
        </div>
        <button onClick={() => setFilter(filter === "pinned" ? "all" : "pinned")} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${filter === "pinned" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "glass glass-hover"}`}>
          <Pin className="w-4 h-4" /> Pinned
        </button>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.03 }}
            className={`glass p-5 cursor-pointer transition-all ${selectedEntry === entry.id ? "border-accent-500/40" : "glass-hover"}`}
            onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
          >
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
                <entry.icon className="w-4 h-4 text-accent-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-sm">{entry.title}</span>
                  <span className={`badge text-[10px] ${categoryColors[entry.category] || "badge-purple"}`}>{entry.category}</span>
                  {entry.pinned && <Pin className="w-3 h-3 text-amber-400" />}
                </div>
                <p className={`text-sm text-helios-400 ${selectedEntry === entry.id ? "" : "line-clamp-2"}`}>
                  {entry.content}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-helios-500">
                  <Clock className="w-3 h-3" /> {entry.timestamp}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
