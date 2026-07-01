"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Trash2,
  Copy,
  Search,
  FileCode2,
  Package,
  GitMerge,
  Shield,
  FileText,
  Filter,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low";
type IssueType = "unused-file" | "unused-package" | "duplicate-code" | "missing-env" | "large-file" | "circular-import" | "possible-bug" | "missing-readme";

interface Issue {
  id: string;
  type: IssueType;
  severity: Severity;
  title: string;
  description: string;
  filePath?: string;
  lineNumber?: number;
}

const issues: Issue[] = [
  { id: "1", type: "possible-bug", severity: "critical", title: "Missing JWT secret validation", description: "process.env.JWT_SECRET is used without checking if it exists. App will crash at runtime if the env var is missing.", filePath: "src/lib/auth.ts", lineNumber: 24 },
  { id: "2", type: "possible-bug", severity: "high", title: "Unhandled null return from getUserById", description: "getUserById() can return null but the result is used without null checking, which could cause a TypeError.", filePath: "src/app/api/users/route.ts", lineNumber: 45 },
  { id: "3", type: "unused-package", severity: "low", title: "Unused dependency: moment", description: "The 'moment' package is listed in dependencies but never imported anywhere in the codebase.", filePath: "package.json" },
  { id: "4", type: "unused-package", severity: "low", title: "Unused dependency: lodash", description: "The 'lodash' package is listed in dependencies but only _.debounce is used, which could be replaced with a small custom implementation.", filePath: "package.json" },
  { id: "5", type: "unused-file", severity: "medium", title: "Dead file: src/utils/legacy.ts", description: "This file is not imported anywhere in the codebase and appears to be leftover from a refactor.", filePath: "src/utils/legacy.ts" },
  { id: "6", type: "unused-file", severity: "medium", title: "Dead file: src/components/OldModal.tsx", description: "This component is not used in any page or other component.", filePath: "src/components/OldModal.tsx" },
  { id: "7", type: "circular-import", severity: "high", title: "Circular dependency in user module", description: "src/lib/auth.ts imports from src/lib/users.ts, which imports back from src/lib/auth.ts. This can cause runtime issues.", filePath: "src/lib/auth.ts" },
  { id: "8", type: "duplicate-code", severity: "medium", title: "Duplicate validation logic", description: "Email validation logic is duplicated in auth.ts and users/route.ts. Should be extracted to a shared utility.", filePath: "src/lib/auth.ts", lineNumber: 12 },
  { id: "9", type: "missing-env", severity: "high", title: "Missing .env.example file", description: "No .env.example file found. Developers won't know which environment variables are required.", filePath: ".env.example" },
  { id: "10", type: "large-file", severity: "low", title: "Large file: src/app/dashboard/page.tsx", description: "This file is 14.2KB and contains multiple concerns. Consider splitting into smaller components.", filePath: "src/app/dashboard/page.tsx" },
  { id: "11", type: "missing-readme", severity: "medium", title: "README missing API documentation", description: "The README exists but lacks documentation for the 12 API endpoints found in the project.", filePath: "README.md" },
];

const typeIcons: Record<IssueType, React.ElementType> = {
  "unused-file": Trash2,
  "unused-package": Package,
  "duplicate-code": Copy,
  "missing-env": FileText,
  "large-file": FileCode2,
  "circular-import": GitMerge,
  "possible-bug": AlertTriangle,
  "missing-readme": FileText,
};

const severityConfig: Record<Severity, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  critical: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/15", label: "Critical" },
  high: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/15", label: "High" },
  medium: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", label: "Medium" },
  low: { icon: Info, color: "text-helios-400", bg: "bg-helios-500/10", label: "Low" },
};

export default function IssuesPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = issues.filter((issue) => {
    if (filter !== "all" && issue.severity !== filter) return false;
    if (search && !issue.title.toLowerCase().includes(search.toLowerCase()) && !issue.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <h1 className="text-3xl font-bold">Issue Detector</h1>
        </div>
        <p className="text-helios-400">Automatically detected issues and code smells.</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-6">
        {(["critical", "high", "medium", "low"] as Severity[]).map((sev) => {
          const config = severityConfig[sev];
          return (
            <button
              key={sev}
              onClick={() => setFilter(filter === sev ? "all" : sev)}
              className={`glass p-4 text-center transition-all ${filter === sev ? "border-accent-500/40" : ""}`}
            >
              <config.icon className={`w-5 h-5 ${config.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold">{counts[sev]}</div>
              <div className="text-xs text-helios-400">{config.label}</div>
            </button>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-helios-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues..."
            className="w-full pl-11 pr-4 py-3 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50"
          />
        </div>
      </motion.div>

      {/* Issues List */}
      <div className="space-y-3">
        {filtered.map((issue, i) => {
          const TypeIcon = typeIcons[issue.type];
          const sevConfig = severityConfig[issue.severity];
          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              className="glass p-5"
            >
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl ${sevConfig.bg} flex items-center justify-center shrink-0`}>
                  <TypeIcon className={`w-4 h-4 ${sevConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-sm">{issue.title}</h4>
                    <span className={`badge ${issue.severity === "critical" ? "badge-rose" : issue.severity === "high" ? "badge-amber" : issue.severity === "medium" ? "badge-amber" : "badge-purple"}`}>
                      {sevConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-helios-400 mb-2">{issue.description}</p>
                  {issue.filePath && (
                    <div className="flex items-center gap-2 text-xs text-helios-500">
                      <FileCode2 className="w-3 h-3" />
                      <span className="font-mono">{issue.filePath}</span>
                      {issue.lineNumber && <span>:L{issue.lineNumber}</span>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
