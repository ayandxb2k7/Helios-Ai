"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Bug,
  Search,
  FileCode2,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Info,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type BugSeverity = "critical" | "high" | "medium" | "low";
type BugCategory = "unused-import" | "unused-variable" | "dead-code" | "duplicate-logic" | "large-component" | "circular-dependency" | "memory-leak" | "null-check" | "async-mistake" | "error-handling" | "broken-api";

interface Bug {
  id: string;
  category: BugCategory;
  severity: BugSeverity;
  title: string;
  description: string;
  filePath: string;
  lineNumber?: number;
  codeSnippet?: string;
  fixSuggestion: string;
}

const bugs: Bug[] = [
  { id: "1", category: "null-check", severity: "critical", title: "Missing null check on getUserById result", description: "getUserById() returns User | null but the result is used without checking, which will cause a TypeError at runtime when user is not found.", filePath: "src/app/api/users/route.ts", lineNumber: 45, codeSnippet: "const user = await getUserById(id);\nuser.name; // TypeError: Cannot read property 'name' of null", fixSuggestion: "Add null check: if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });" },
  { id: "2", category: "async-mistake", severity: "critical", title: "Unhandled promise rejection in analytics", description: "The trackEvent function is called without await and has no .catch() handler. If the analytics service is down, this will cause an unhandled promise rejection that crashes the process.", filePath: "src/lib/analytics.ts", lineNumber: 78, codeSnippet: "trackEvent(event); // Missing await or .catch()", fixSuggestion: "Add await or .catch(): await trackEvent(event); or trackEvent(event).catch(console.error);" },
  { id: "3", category: "error-handling", severity: "high", title: "Missing try/catch in database queries", description: "Multiple API route handlers execute database queries without try/catch. Database connection failures will result in unhandled errors.", filePath: "src/app/api/users/route.ts", lineNumber: 8, codeSnippet: "export async function GET() {\n  const users = await db.query.users.findMany();\n  return Response.json(users);\n}", fixSuggestion: "Wrap in try/catch: try { ... } catch (error) { return Response.json({ error: 'Internal error' }, { status: 500 }); }" },
  { id: "4", category: "circular-dependency", severity: "high", title: "Circular import between auth.ts and users.ts", description: "auth.ts imports from users.ts, and users.ts imports back from auth.ts. This creates a circular dependency that can cause undefined imports at runtime.", filePath: "src/lib/auth.ts", lineNumber: 3, codeSnippet: "// auth.ts\nimport { getUser } from './users';\n\n// users.ts\nimport { verifyToken } from './auth';", fixSuggestion: "Extract shared types and utilities to a separate file like src/lib/shared.ts" },
  { id: "5", category: "memory-leak", severity: "high", title: "Event listener not cleaned up in dashboard", description: "A window resize listener is added in useEffect but never removed on unmount, causing a memory leak when navigating away from the dashboard.", filePath: "src/app/dashboard/page.tsx", lineNumber: 22, codeSnippet: "useEffect(() => {\n  window.addEventListener('resize', handleResize);\n  // Missing: return () => window.removeEventListener('resize', handleResize);\n}, []);", fixSuggestion: "Return cleanup function from useEffect: return () => window.removeEventListener('resize', handleResize);" },
  { id: "6", category: "unused-import", severity: "medium", title: "Unused import: moment in dashboard", description: "The 'moment' library is imported but never used in the dashboard component.", filePath: "src/app/dashboard/page.tsx", lineNumber: 5, codeSnippet: "import moment from 'moment'; // Never used", fixSuggestion: "Remove the unused import: delete the line" },
  { id: "7", category: "unused-variable", severity: "medium", title: "Unused variable: processedData", description: "Variable 'processedData' is declared and assigned but never referenced anywhere in the function.", filePath: "src/lib/analytics.ts", lineNumber: 34, codeSnippet: "const processedData = transformData(rawData);\n// processedData is never used after this", fixSuggestion: "Either use the variable or remove it to reduce confusion." },
  { id: "8", category: "duplicate-logic", severity: "medium", title: "Duplicate email validation logic", description: "Email validation regex is defined independently in both auth.ts and users/route.ts. Changes to one must be manually synced to the other.", filePath: "src/lib/auth.ts", lineNumber: 12, codeSnippet: "// auth.ts\nconst emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n\n// users/route.ts\nconst EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;", fixSuggestion: "Create src/lib/validators.ts with a shared emailValidator export." },
  { id: "9", category: "large-component", severity: "medium", title: "Dashboard component exceeds 140 lines", description: "The DashboardPage component is 142 lines with multiple responsibilities. Components over 100 lines are harder to test, maintain, and reuse.", filePath: "src/app/dashboard/page.tsx", lineNumber: 1, fixSuggestion: "Extract sub-components: StatsGrid, ActivityChart, RunningAgents, RecentIssues." },
  { id: "10", category: "dead-code", severity: "low", title: "Dead code: legacy.ts utility file", description: "src/utils/legacy.ts contains 3 functions that are not imported anywhere in the codebase.", filePath: "src/utils/legacy.ts", fixSuggestion: "Delete the file if no longer needed, or add deprecation notice." },
  { id: "11", category: "broken-api", severity: "high", title: "API endpoint references non-existent service", description: "POST /api/projects calls ProjectService.create() but ProjectService is not exported from the services module.", filePath: "src/app/api/projects/route.ts", lineNumber: 12, codeSnippet: "const project = await ProjectService.create(data); // ProjectService is undefined", fixSuggestion: "Either create the ProjectService module or import the correct service." },
  { id: "12", category: "async-mistake", severity: "medium", title: "Promise.all without error isolation", description: "Multiple parallel API calls use Promise.all, which fails fast if any single call rejects. Individual failures crash the entire operation.", filePath: "src/app/dashboard/page.tsx", lineNumber: 30, codeSnippet: "const [users, projects, stats] = await Promise.all([\n  fetchUsers(),\n  fetchProjects(),\n  fetchStats()\n]);", fixSuggestion: "Use Promise.allSettled() and handle individual failures gracefully." },
];

const categoryLabels: Record<BugCategory, string> = {
  "unused-import": "Unused Import",
  "unused-variable": "Unused Variable",
  "dead-code": "Dead Code",
  "duplicate-logic": "Duplicate Logic",
  "large-component": "Large Component",
  "circular-dependency": "Circular Dependency",
  "memory-leak": "Memory Leak",
  "null-check": "Missing Null Check",
  "async-mistake": "Async Mistake",
  "error-handling": "Missing Error Handling",
  "broken-api": "Broken API Reference",
};

const severityConfig: Record<BugSeverity, { icon: React.ElementType; color: string; label: string }> = {
  critical: { icon: XCircle, color: "text-rose-400", label: "Critical" },
  high: { icon: AlertCircle, color: "text-amber-400", label: "High" },
  medium: { icon: AlertTriangle, color: "text-amber-400", label: "Medium" },
  low: { icon: Info, color: "text-helios-400", label: "Low" },
};

export default function BugsPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<BugSeverity | "all">("all");
  const [expandedBug, setExpandedBug] = useState<string | null>(null);

  const filtered = bugs.filter((bug) => {
    if (severityFilter !== "all" && bug.severity !== severityFilter) return false;
    if (search && !bug.title.toLowerCase().includes(search.toLowerCase()) && !bug.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = { critical: bugs.filter((b) => b.severity === "critical").length, high: bugs.filter((b) => b.severity === "high").length, medium: bugs.filter((b) => b.severity === "medium").length, low: bugs.filter((b) => b.severity === "low").length };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bug className="w-6 h-6 text-rose-400" />
          <h1 className="text-3xl font-bold">Bug Detector</h1>
        </div>
        <p className="text-helios-400">Deep analysis for bugs, code smells, and potential runtime errors.</p>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-6">
        {(Object.entries(counts) as [BugSeverity, number][]).map(([sev, count]) => {
          const config = severityConfig[sev];
          return (
            <button key={sev} onClick={() => setSeverityFilter(severityFilter === sev ? "all" : sev)} className={`glass p-4 text-center transition-all ${severityFilter === sev ? "border-accent-500/40" : ""}`}>
              <config.icon className={`w-5 h-5 ${config.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-helios-400">{config.label}</div>
            </button>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-helios-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bugs..." className="w-full pl-11 pr-4 py-3 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50" />
        </div>
      </motion.div>

      {/* Bug List */}
      <div className="space-y-3">
        {filtered.map((bug, i) => {
          const config = severityConfig[bug.severity];
          const isExpanded = expandedBug === bug.id;
          return (
            <motion.div key={bug.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.03 }} className="glass overflow-hidden">
              <button onClick={() => setExpandedBug(isExpanded ? null : bug.id)} className="w-full flex items-start gap-4 p-5 text-left">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bug.severity === "critical" ? "bg-rose-500/15" : bug.severity === "high" ? "bg-amber-500/15" : "bg-helios-500/10"}`}>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-helios-400" /> : <ChevronRight className="w-4 h-4 text-helios-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm">{bug.title}</span>
                    <span className={`badge text-[10px] ${bug.severity === "critical" ? "badge-rose" : bug.severity === "high" ? "badge-amber" : bug.severity === "medium" ? "badge-amber" : "badge-purple"}`}>{config.label}</span>
                    <span className="badge badge-cyan text-[10px]">{categoryLabels[bug.category]}</span>
                  </div>
                  <p className="text-sm text-helios-400">{bug.description}</p>
                  <div className="flex items-center gap-2 text-xs text-helios-500 mt-2">
                    <FileCode2 className="w-3 h-3" /><span className="font-mono">{bug.filePath}</span>{bug.lineNumber && <span>:L{bug.lineNumber}</span>}
                  </div>
                </div>
              </button>
              {isExpanded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-helios-700/50 px-5 pb-5 ml-12">
                  {bug.codeSnippet && (
                    <div className="mb-4">
                      <div className="text-xs text-helios-500 mb-2 font-semibold">Current Code</div>
                      <pre className="bg-helios-950 rounded-xl p-4 text-sm font-mono text-helios-300 overflow-x-auto whitespace-pre-wrap border border-rose-500/10">{bug.codeSnippet}</pre>
                    </div>
                  )}
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <div className="text-xs font-semibold text-emerald-400 mb-2">🛠 Fix Suggestion</div>
                    <p className="text-sm text-helios-300">{bug.fixSuggestion}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
