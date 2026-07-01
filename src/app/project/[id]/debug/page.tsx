"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bug,
  Search,
  FileCode2,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  ArrowRight,
  Zap,
  Code2,
  GitMerge,
  Shield,
  CheckCircle2,
} from "lucide-react";

interface DebugTrace {
  id: string;
  error: string;
  errorType: string;
  source: string;
  stackTrace: StackFrame[];
  rootCause: RootCause;
  fixes: Fix[];
}

interface StackFrame {
  file: string;
  line: number;
  function: string;
  isProblem: boolean;
}

interface RootCause {
  file: string;
  line: number;
  explanation: string;
  confidence: number;
  reasoning: string[];
}

interface Fix {
  id: string;
  title: string;
  description: string;
  approach: string;
  riskLevel: "low" | "medium" | "high";
  codeChange: string;
}

const debugTraces: DebugTrace[] = [
  {
    id: "1",
    error: 'TypeError: Cannot read properties of null (reading \'name\')',
    errorType: "TypeError",
    source: "src/app/api/users/[id]/route.ts:45",
    stackTrace: [
      { file: "src/app/api/users/[id]/route.ts", line: 45, function: "GET", isProblem: false },
      { file: "src/lib/db-queries.ts", line: 22, function: "getUserById", isProblem: false },
      { file: "src/app/api/users/[id]/route.ts", line: 46, function: "GET", isProblem: true },
    ],
    rootCause: { file: "src/app/api/users/[id]/route.ts", line: 45, explanation: "getUserById() returns User | null but the result is accessed without null checking. When a user is not found, the function returns null, and accessing .name on null throws a TypeError.", confidence: 96, reasoning: ["getUserById signature shows return type User | null", "No null check between the query and property access", "Error occurs specifically when user ID doesn't exist in database", "The pattern is consistent with missing null guards in other route handlers"] },
    fixes: [
      { id: "1a", title: "Add null check with 404 response", description: "Check if user is null and return a proper 404 response", approach: "defensive", riskLevel: "low", codeChange: "- const user = await getUserById(id);\n- user.name;\n+ const user = await getUserById(id);\n+ if (!user) {\n+   return NextResponse.json(\n+     { error: 'User not found' },\n+     { status: 404 }\n+   );\n+ }\n+ user.name;" },
      { id: "1b", title: "Use optional chaining with fallback", description: "Use optional chaining and provide a default value or error", approach: "graceful", riskLevel: "low", codeChange: "- const user = await getUserById(id);\n- return Response.json({ name: user.name });\n+ const user = await getUserById(id);\n+ return Response.json({\n+   name: user?.name ?? 'Unknown'\n+ });" },
      { id: "1c", title: "Throw custom NotFoundError", description: "Create a custom error class and let error boundary handle it", approach: "architectural", riskLevel: "medium", codeChange: "+ class NotFoundError extends Error {\n+   constructor(resource: string) {\n+     super(`${resource} not found`);\n+   }\n+ }\n\n- const user = await getUserById(id);\n+ const user = await getUserById(id);\n+ if (!user) throw new NotFoundError('User');" },
    ],
  },
  {
    id: "2",
    error: "UnhandledPromiseRejection: Analytics service unavailable",
    errorType: "UnhandledPromiseRejection",
    source: "src/lib/analytics.ts:78",
    stackTrace: [
      { file: "src/lib/analytics.ts", line: 78, function: "trackEvent", isProblem: true },
      { file: "src/app/dashboard/page.tsx", line: 34, function: "DashboardPage", isProblem: false },
    ],
    rootCause: { file: "src/lib/analytics.ts", line: 78, explanation: "The trackEvent() function is called without await and has no .catch() handler. When the analytics service is unavailable, the promise rejects with no handler, causing an unhandled promise rejection that can crash the Node.js process.", confidence: 92, reasoning: ["trackEvent is an async function called without await", "No .catch() is chained to the promise", "The analytics service can fail independently of the main application", "Node.js crashes on unhandled promise rejections by default"] },
    fixes: [
      { id: "2a", title: "Add .catch() handler", description: "Attach a catch handler to gracefully handle analytics failures", approach: "defensive", riskLevel: "low", codeChange: "- trackEvent(event);\n+ trackEvent(event).catch((err) => {\n+   console.error('Analytics failed:', err);\n+ });" },
      { id: "2b", title: "Await with try/catch", description: "Properly await the call and handle errors with try/catch", approach: "explicit", riskLevel: "low", codeChange: "- trackEvent(event);\n+ try {\n+   await trackEvent(event);\n+ } catch (err) {\n+   console.error('Analytics failed:', err);\n+ }" },
    ],
  },
  {
    id: "3",
    error: "ReferenceError: ProjectService is not defined",
    errorType: "ReferenceError",
    source: "src/app/api/projects/route.ts:12",
    stackTrace: [
      { file: "src/app/api/projects/route.ts", line: 12, function: "POST", isProblem: true },
    ],
    rootCause: { file: "src/app/api/projects/route.ts", line: 12, explanation: "The code references ProjectService.create() but ProjectService is not imported or defined in this file. The service module either doesn't exist or wasn't imported.", confidence: 99, reasoning: ["No import statement for ProjectService found in the file", "No ProjectService export found in src/services/", "The variable is referenced but never declared", "This is a classic missing import error"] },
    fixes: [
      { id: "3a", title: "Create ProjectService module", description: "Create the missing service module with a create method", approach: "architectural", riskLevel: "medium", codeChange: "+ // src/services/project.service.ts\n+ export const ProjectService = {\n+   async create(data: CreateProjectInput) {\n+     const [project] = await db.insert(projects)\n+       .values(data)\n+       .returning();\n+     return project;\n+   }\n+ };" },
      { id: "3b", title: "Replace with direct DB call", description: "Skip the service layer and call the database directly", approach: "simple", riskLevel: "low", codeChange: "- const project = await ProjectService.create(data);\n+ const [project] = await db.insert(projects)\n+   .values(data)\n+   .returning();" },
    ],
  },
];

const riskColors = { low: "badge-emerald", medium: "badge-amber", high: "badge-rose" };

export default function DebugPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [selectedTrace, setSelectedTrace] = useState<string | null>("1");
  const [expandedFix, setExpandedFix] = useState<string | null>(null);

  const trace = debugTraces.find((t) => t.id === selectedTrace);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bug className="w-6 h-6 text-rose-400" />
          <h1 className="text-3xl font-bold">Smart Debugging</h1>
        </div>
        <p className="text-helios-400">Trace errors to root causes with AI-powered analysis and multiple fix suggestions.</p>
      </motion.div>

      {/* Error List */}
      <div className="space-y-3 mb-8">
        {debugTraces.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => { setSelectedTrace(t.id); setExpandedFix(null); }}
            className={`glass p-4 cursor-pointer transition-all ${selectedTrace === t.id ? "border-accent-500/40" : "glass-hover"}`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-rose-300 mb-1">{t.error}</div>
                <div className="flex items-center gap-2 text-xs text-helios-500">
                  <span className="badge badge-rose">{t.errorType}</span>
                  <FileCode2 className="w-3 h-3" />
                  <span className="font-mono">{t.source}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trace Detail */}
      <AnimatePresence mode="wait">
        {trace && (
          <motion.div key={trace.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Stack Trace */}
            <div className="glass p-5 mb-6">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Code2 className="w-4 h-4 text-accent-400" /> Stack Trace</h3>
              <div className="space-y-1">
                {trace.stackTrace.map((frame, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg text-xs ${frame.isProblem ? "bg-rose-500/10 border border-rose-500/20" : "glass-sm"}`}>
                    <span className="text-helios-500 w-5 text-right">{i + 1}</span>
                    <ChevronRight className="w-3 h-3 text-helios-500" />
                    <span className="font-mono text-helios-200">{frame.function}</span>
                    <span className="text-helios-500">at</span>
                    <span className="font-mono text-accent-400">{frame.file}</span>
                    <span className="text-helios-500">:L{frame.line}</span>
                    {frame.isProblem && <span className="badge badge-rose text-[9px] ml-auto">problem</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Root Cause */}
            <div className="glass p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Root Cause</h3>
                <span className="text-xs text-emerald-400 font-mono">{trace.rootCause.confidence}% confidence</span>
              </div>
              <p className="text-sm text-helios-300 mb-4">{trace.rootCause.explanation}</p>
              <div className="space-y-2 mb-4">
                <div className="text-[10px] uppercase tracking-widest text-helios-500 font-semibold">Reasoning Chain</div>
                {trace.rootCause.reasoning.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-5 h-5 rounded-md bg-accent-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-accent-400 font-mono text-[10px]">{i + 1}</span>
                    </div>
                    <span className="text-helios-300">{r}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-helios-500">
                <FileCode2 className="w-3 h-3" />
                <span className="font-mono">{trace.rootCause.file}:L{trace.rootCause.line}</span>
              </div>
            </div>

            {/* Fixes */}
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Suggested Fixes</h3>
            <div className="space-y-3">
              {trace.fixes.map((fix) => (
                <div key={fix.id} className="glass overflow-hidden">
                  <button onClick={() => setExpandedFix(expandedFix === fix.id ? null : fix.id)} className="w-full flex items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-3">
                      {expandedFix === fix.id ? <ChevronDown className="w-4 h-4 text-helios-400" /> : <ChevronRight className="w-4 h-4 text-helios-400" />}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{fix.title}</span>
                          <span className={`badge text-[10px] ${riskColors[fix.riskLevel]}`}>risk: {fix.riskLevel}</span>
                          <span className="badge badge-cyan text-[10px]">{fix.approach}</span>
                        </div>
                        <p className="text-xs text-helios-400 mt-0.5">{fix.description}</p>
                      </div>
                    </div>
                  </button>
                  {expandedFix === fix.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-helios-700/50 px-4 pb-4">
                      <div className="text-[10px] uppercase tracking-widest text-helios-500 font-semibold mt-3 mb-2">Proposed Change</div>
                      <pre className="bg-helios-950 rounded-xl p-4 text-xs font-mono text-helios-200 overflow-x-auto whitespace-pre-wrap">{fix.codeChange}</pre>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
