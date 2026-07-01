"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  FileCode2,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface ReviewCategory {
  name: string;
  score: number;
  icon: React.ElementType;
  color: string;
  summary: string;
  findings: ReviewFinding[];
}

interface ReviewFinding {
  severity: "positive" | "suggestion" | "warning";
  title: string;
  description: string;
  filePath: string;
  lineNumber?: number;
  suggestion?: string;
}

const categories: ReviewCategory[] = [
  {
    name: "Readability",
    score: 85,
    icon: FileCode2,
    color: "#6c5ce7",
    summary: "Code is generally well-structured with clear naming conventions. Some functions are too long and could benefit from extraction.",
    findings: [
      { severity: "positive", title: "Consistent naming conventions", description: "Variable and function names follow camelCase convention throughout the codebase.", filePath: "src/" },
      { severity: "positive", title: "TypeScript types well-defined", description: "Interfaces and types are properly defined and used consistently.", filePath: "src/db/schema.ts" },
      { severity: "suggestion", title: "Long function in dashboard page", description: "The DashboardPage component is 140+ lines. Consider extracting sub-components.", filePath: "src/app/dashboard/page.tsx", lineNumber: 15, suggestion: "Extract stat cards, chart sections, and issue list into separate components." },
      { severity: "warning", title: "Magic numbers in chart configuration", description: "Hard-coded values like gap={30}, height={250} should be constants.", filePath: "src/app/dashboard/page.tsx", lineNumber: 48, suggestion: "Create a chart config object with named constants." },
    ],
  },
  {
    name: "Maintainability",
    score: 78,
    icon: ClipboardCheck,
    color: "#00cec9",
    summary: "Good separation of concerns but some modules have grown too large. Missing shared utilities for common patterns.",
    findings: [
      { severity: "positive", title: "Clean App Router structure", description: "Pages and API routes follow Next.js conventions with proper file organization.", filePath: "src/app/" },
      { severity: "suggestion", title: "Extract shared validation logic", description: "Email and password validation is duplicated across auth and user modules.", filePath: "src/lib/auth.ts", lineNumber: 12, suggestion: "Create src/lib/validators.ts with shared Zod schemas." },
      { severity: "warning", title: "Tight coupling in auth module", description: "Auth service directly imports database schema, making it hard to test in isolation.", filePath: "src/lib/auth.ts", lineNumber: 3, suggestion: "Use dependency injection pattern — pass db as a parameter." },
      { severity: "suggestion", title: "Missing error boundary", description: "No React error boundary wrapper for graceful error handling.", filePath: "src/app/layout.tsx", suggestion: "Add error.tsx files at route level for graceful error recovery." },
    ],
  },
  {
    name: "Security",
    score: 72,
    icon: AlertTriangle,
    color: "#fd79a8",
    summary: "Two critical security issues found. JWT implementation needs hardening. CORS configuration too permissive.",
    findings: [
      { severity: "warning", title: "Missing JWT secret validation", description: "JWT_SECRET accessed without null check — crashes or uses undefined secret.", filePath: "src/lib/auth.ts", lineNumber: 24, suggestion: "Add startup validation: if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET required')" },
      { severity: "warning", title: "Hardcoded API key in config", description: "API key stored directly in source code, visible in version control.", filePath: "src/config.ts", lineNumber: 15, suggestion: "Move to environment variable and add to .gitignore." },
      { severity: "suggestion", title: "Permissive CORS policy", description: "CORS allows all origins (*) which is unsafe for production.", filePath: "src/middleware.ts", lineNumber: 5, suggestion: "Set specific allowed origins based on NODE_ENV." },
      { severity: "positive", title: "httpOnly cookie for JWT", description: "JWT token stored in httpOnly cookie, preventing XSS access.", filePath: "src/app/api/auth/route.ts" },
    ],
  },
  {
    name: "Scalability",
    score: 75,
    icon: ArrowUpRight,
    color: "#00b894",
    summary: "Architecture supports horizontal scaling but lacks caching strategy and database connection pooling configuration.",
    findings: [
      { severity: "suggestion", title: "No database connection pooling", description: "Direct Pool creation without max connection limits configured.", filePath: "src/db/index.ts", lineNumber: 5, suggestion: "Configure Pool with max: 20, idleTimeoutMillis: 30000." },
      { severity: "suggestion", title: "Missing caching layer", description: "No Redis or in-memory caching for frequently accessed data.", filePath: "src/", suggestion: "Add Redis caching for session data and frequently queried entities." },
      { severity: "warning", title: "N+1 query potential in user listing", description: "User listing endpoint could trigger N+1 queries when loading related data.", filePath: "src/app/api/users/route.ts", suggestion: "Use Drizzle's relational queries with `with` clause to eager-load relations." },
    ],
  },
  {
    name: "Performance",
    score: 82,
    icon: Sparkles,
    color: "#fdcb6e",
    summary: "Good use of Server Components. Some client components could be better optimized. Bundle size can be reduced.",
    findings: [
      { severity: "positive", title: "Server Components used correctly", description: "Data-fetching pages properly use Server Components.", filePath: "src/app/" },
      { severity: "suggestion", title: "Large bundle from chart library", description: "Recharts adds ~150KB to the client bundle. Consider lighter alternatives.", filePath: "package.json", suggestion: "Evaluate lightweight alternatives like Victory or custom SVG charts." },
      { severity: "suggestion", title: "Missing dynamic imports", description: "Heavy components (charts, Monaco) should use next/dynamic for code splitting.", filePath: "src/app/dashboard/page.tsx", suggestion: "Wrap chart components with dynamic(() => import(...), { ssr: false })" },
      { severity: "warning", title: "Unoptimized re-renders", description: "Dashboard stats re-render on every parent update without memoization.", filePath: "src/app/dashboard/page.tsx", lineNumber: 45, suggestion: "Wrap stat cards with React.memo and use useMemo for computed values." },
    ],
  },
  {
    name: "Architecture",
    score: 88,
    icon: Lightbulb,
    color: "#a29bfe",
    summary: "Clean architecture following Next.js best practices. Minor circular dependency issue in utility modules.",
    findings: [
      { severity: "positive", title: "Proper App Router structure", description: "File-system based routing with clear page/layout separation.", filePath: "src/app/" },
      { severity: "positive", title: "Database layer abstraction", description: "Drizzle ORM provides clean database abstraction with type safety.", filePath: "src/db/" },
      { severity: "warning", title: "Circular import in user module", description: "auth.ts imports from users.ts which imports back from auth.ts.", filePath: "src/lib/auth.ts", suggestion: "Extract shared types to a separate types.ts file." },
      { severity: "suggestion", title: "Missing service layer", description: "Business logic mixed directly in API route handlers.", filePath: "src/app/api/", suggestion: "Create src/services/ layer for business logic, keeping routes thin." },
    ],
  },
  {
    name: "Testing",
    score: 45,
    icon: CheckCircle2,
    color: "#e17055",
    summary: "Critical gap — almost no test coverage. Only 2 unit tests found. No integration or E2E tests.",
    findings: [
      { severity: "warning", title: "Only 2% code coverage", description: "Almost no test coverage. Critical paths like authentication are untested.", filePath: "src/", suggestion: "Priority: Add tests for auth flow, API routes, and database queries." },
      { severity: "warning", title: "No API integration tests", description: "Zero integration tests for the 12 API endpoints.", filePath: "src/app/api/", suggestion: "Use Vitest with MSW for API integration testing." },
      { severity: "suggestion", title: "Missing test configuration", description: "No test runner configured. No vitest.config or jest.config found.", filePath: "src/", suggestion: "Set up Vitest with @testing-library/react for component testing." },
    ],
  },
  {
    name: "Documentation",
    score: 58,
    icon: FileCode2,
    color: "#636e72",
    summary: "README exists but is minimal. No API documentation. Missing inline JSDoc comments for public functions.",
    findings: [
      { severity: "suggestion", title: "README lacks API documentation", description: "README has basic setup instructions but no API endpoint documentation.", filePath: "README.md", suggestion: "Add API section with endpoint table, request/response examples." },
      { severity: "warning", title: "No JSDoc on public functions", description: "Exported utility functions lack documentation comments.", filePath: "src/lib/utils.ts", suggestion: "Add JSDoc comments for all exported functions." },
      { severity: "suggestion", title: "Missing .env.example", description: "No .env.example file to guide developers on required environment variables.", filePath: ".env.example", suggestion: "Create .env.example with all required variables and descriptions." },
    ],
  },
];

const radarData = categories.map((c) => ({ subject: c.name, A: c.score }));
const overallScore = Math.round(categories.reduce((a, c) => a + c.score, 0) / categories.length);

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "positive") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (severity === "warning") return <AlertTriangle className="w-4 h-4 text-rose-400" />;
  return <Lightbulb className="w-4 h-4 text-amber-400" />;
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [expanded, setExpanded] = useState<string | null>("Readability");

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardCheck className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">AI Code Review</h1>
        </div>
        <p className="text-helios-400">Comprehensive code review with scores and actionable improvement suggestions.</p>
      </motion.div>

      {/* Overall */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="glass p-6 text-center">
          <div className="relative inline-block mb-4">
            <svg width={140} height={140}>
              <circle cx={70} cy={70} r={60} fill="none" stroke="rgba(108,92,231,0.1)" strokeWidth={8} />
              <circle cx={70} cy={70} r={60} fill="none" stroke={overallScore >= 80 ? "#00b894" : overallScore >= 60 ? "#fdcb6e" : "#fd79a8"} strokeWidth={8} strokeLinecap="round" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - overallScore / 100)} style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "all 1s ease" }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-3xl font-bold" style={{ color: overallScore >= 80 ? "#00b894" : overallScore >= 60 ? "#fdcb6e" : "#fd79a8" }}>{overallScore}</div>
                <div className="text-[10px] text-helios-500">Overall</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-helios-400">Code review score across {categories.length} dimensions</p>
        </div>
        <div className="glass p-6">
          <h3 className="font-semibold mb-4">Review Radar</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(108,92,231,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9090ab", fontSize: 10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="#6c5ce7" fill="#6c5ce7" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Reviews */}
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.04 }}
            className="glass overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === cat.name ? null : cat.name)}
              className="w-full flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-4">
                {expanded === cat.name ? <ChevronDown className="w-4 h-4 text-helios-400" /> : <ChevronRight className="w-4 h-4 text-helios-400" />}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                  <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{cat.name}</div>
                  <div className="text-xs text-helios-400 mt-0.5">{cat.findings.length} findings</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-helios-700 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: cat.color }} initial={{ width: 0 }} animate={{ width: `${cat.score}%` }} transition={{ duration: 1 }} />
                </div>
                <span className="text-lg font-bold w-10 text-right" style={{ color: cat.score >= 80 ? "#00b894" : cat.score >= 60 ? "#fdcb6e" : "#fd79a8" }}>{cat.score}</span>
              </div>
            </button>

            {expanded === cat.name && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-helios-700/50 px-5 pb-5">
                <p className="text-sm text-helios-400 my-4">{cat.summary}</p>
                <div className="space-y-3">
                  {cat.findings.map((finding, fi) => (
                    <div key={fi} className="flex items-start gap-3 p-4 glass-sm rounded-xl">
                      <SeverityIcon severity={finding.severity} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{finding.title}</span>
                          <span className={`badge text-[10px] ${finding.severity === "positive" ? "badge-emerald" : finding.severity === "warning" ? "badge-rose" : "badge-amber"}`}>
                            {finding.severity}
                          </span>
                        </div>
                        <p className="text-sm text-helios-400 mb-2">{finding.description}</p>
                        <div className="flex items-center gap-2 text-xs text-helios-500">
                          <FileCode2 className="w-3 h-3" />
                          <span className="font-mono">{finding.filePath}</span>
                          {finding.lineNumber && <span>:L{finding.lineNumber}</span>}
                        </div>
                        {finding.suggestion && (
                          <div className="mt-2 p-3 bg-accent-500/5 border border-accent-500/10 rounded-lg">
                            <div className="text-xs font-semibold text-accent-400 mb-1">💡 Suggestion</div>
                            <p className="text-sm text-helios-300">{finding.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
