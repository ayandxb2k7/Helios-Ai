"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
  Map,
  Rocket,
  Shield,
  Gauge,
  TestTube,
  Code2,
  Server,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  effort: "small" | "medium" | "large";
  impact: "high" | "medium" | "low";
  category: string;
  status: "todo" | "in-progress" | "done";
}

const roadmapSections = [
  {
    title: "Critical Fixes",
    icon: AlertCircle,
    color: "#fd79a8",
    items: [
      { id: "1", title: "Add JWT secret validation at startup", description: "App crashes at runtime if JWT_SECRET env var is missing. Add startup check that throws descriptive error.", priority: "critical" as const, effort: "small" as const, impact: "high" as const, category: "Security", status: "todo" as const },
      { id: "2", title: "Fix null check in getUserById", description: "getUserById returns null but result is used without checking, causing TypeError.", priority: "critical" as const, effort: "small" as const, impact: "high" as const, category: "Bug Fix", status: "todo" as const },
      { id: "3", title: "Add error handling to API routes", description: "Database queries in API handlers lack try/catch. Connection failures cause unhandled errors.", priority: "critical" as const, effort: "medium" as const, impact: "high" as const, category: "Reliability", status: "todo" as const },
    ],
  },
  {
    title: "Security Improvements",
    icon: Shield,
    color: "#6c5ce7",
    items: [
      { id: "4", title: "Move hardcoded API keys to env vars", description: "API key in config.ts is hardcoded and visible in version control.", priority: "high" as const, effort: "small" as const, impact: "high" as const, category: "Security", status: "todo" as const },
      { id: "5", title: "Restrict CORS configuration", description: "CORS allows all origins (*). Set specific allowed domains for production.", priority: "high" as const, effort: "small" as const, impact: "medium" as const, category: "Security", status: "todo" as const },
      { id: "6", title: "Add rate limiting to auth endpoints", description: "No rate limiting on login/auth routes, vulnerable to brute force attacks.", priority: "high" as const, effort: "medium" as const, impact: "high" as const, category: "Security", status: "todo" as const },
      { id: "7", title: "Update jsonwebtoken to 9.0.2+", description: "Current version has known CVE-2022-23529 vulnerability.", priority: "high" as const, effort: "small" as const, impact: "medium" as const, category: "Security", status: "todo" as const },
    ],
  },
  {
    title: "Performance Improvements",
    icon: Gauge,
    color: "#00cec9",
    items: [
      { id: "8", title: "Add dynamic imports for heavy components", description: "Charts and Monaco editor add ~200KB. Use next/dynamic for code splitting.", priority: "medium" as const, effort: "small" as const, impact: "high" as const, category: "Performance", status: "todo" as const },
      { id: "9", title: "Add Redis caching layer", description: "No caching for frequently accessed data. Add Redis for session data and queries.", priority: "medium" as const, effort: "large" as const, impact: "high" as const, category: "Performance", status: "todo" as const },
      { id: "10", title: "Configure database connection pooling", description: "No max connection limits configured on the Pool. Could exhaust connections under load.", priority: "medium" as const, effort: "small" as const, impact: "medium" as const, category: "Performance", status: "todo" as const },
      { id: "11", title: "Memoize dashboard stat cards", description: "Stat cards re-render on every parent update without memoization.", priority: "low" as const, effort: "small" as const, impact: "low" as const, category: "Performance", status: "todo" as const },
    ],
  },
  {
    title: "Testing Roadmap",
    icon: TestTube,
    color: "#e17055",
    items: [
      { id: "12", title: "Set up Vitest test framework", description: "No test runner configured. Install Vitest with @testing-library/react.", priority: "high" as const, effort: "medium" as const, impact: "high" as const, category: "Testing", status: "todo" as const },
      { id: "13", title: "Add auth flow integration tests", description: "Authentication is critical path with zero test coverage. Add login/logout/jwt tests.", priority: "high" as const, effort: "medium" as const, impact: "high" as const, category: "Testing", status: "todo" as const },
      { id: "14", title: "Add API route unit tests", description: "12 API endpoints with no test coverage. Add request/response validation tests.", priority: "high" as const, effort: "large" as const, impact: "high" as const, category: "Testing", status: "todo" as const },
      { id: "15", title: "Add React component tests", description: "34 components with no test coverage. Start with shared UI primitives.", priority: "medium" as const, effort: "large" as const, impact: "medium" as const, category: "Testing", status: "todo" as const },
      { id: "16", title: "Target 80% code coverage", description: "Current coverage is ~2%. Set CI threshold at 80% for new files.", priority: "medium" as const, effort: "large" as const, impact: "high" as const, category: "Testing", status: "todo" as const },
    ],
  },
  {
    title: "Architecture Improvements",
    icon: Code2,
    color: "#a29bfe",
    items: [
      { id: "17", title: "Break circular dependency in auth/users", description: "auth.ts ↔ users.ts circular import. Extract shared types to separate file.", priority: "high" as const, effort: "small" as const, impact: "medium" as const, category: "Architecture", status: "todo" as const },
      { id: "18", title: "Add service layer for business logic", description: "Business logic mixed in API handlers. Create src/services/ layer.", priority: "medium" as const, effort: "large" as const, impact: "high" as const, category: "Architecture", status: "todo" as const },
      { id: "19", title: "Extract shared validation schemas", description: "Email/password validation duplicated. Create Zod schemas in src/lib/validators.ts.", priority: "medium" as const, effort: "small" as const, impact: "medium" as const, category: "Architecture", status: "todo" as const },
    ],
  },
  {
    title: "Deployment Readiness",
    icon: Server,
    color: "#fdcb6e",
    items: [
      { id: "20", title: "Create .env.example file", description: "No .env.example to guide developers on required environment variables.", priority: "high" as const, effort: "small" as const, impact: "medium" as const, category: "DevOps", status: "todo" as const },
      { id: "21", title: "Add Docker configuration", description: "No Dockerfile or docker-compose.yml. Containerize for consistent deployments.", priority: "medium" as const, effort: "medium" as const, impact: "high" as const, category: "DevOps", status: "todo" as const },
      { id: "22", title: "Set up CI/CD pipeline", description: "No automated build/test/deploy pipeline. Add GitHub Actions workflow.", priority: "medium" as const, effort: "medium" as const, impact: "high" as const, category: "DevOps", status: "todo" as const },
      { id: "23", title: "Remove unused dependencies", description: "moment and lodash are unused. Remove to reduce bundle size and attack surface.", priority: "low" as const, effort: "small" as const, impact: "low" as const, category: "Cleanup", status: "todo" as const },
    ],
  },
];

const priorityColors: Record<string, string> = { critical: "badge-rose", high: "badge-amber", medium: "badge-purple", low: "badge-cyan" };
const effortLabels: Record<string, string> = { small: "1-2h", medium: "1-2d", large: "3-5d" };

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);

  const totalItems = roadmapSections.reduce((a, s) => a + s.items.length, 0);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Map className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Project Roadmap</h1>
        </div>
        <p className="text-helios-400">AI-generated improvement roadmap with prioritized action items.</p>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass p-5 text-center">
          <Rocket className="w-6 h-6 text-accent-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">{totalItems}</div>
          <div className="text-xs text-helios-400">Total Items</div>
        </div>
        <div className="glass p-5 text-center">
          <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">{roadmapSections.reduce((a, s) => a + s.items.filter(i => i.priority === "critical" || i.priority === "high").length, 0)}</div>
          <div className="text-xs text-helios-400">High Priority</div>
        </div>
        <div className="glass p-5 text-center">
          <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">~2-3w</div>
          <div className="text-xs text-helios-400">Est. Timeline</div>
        </div>
      </motion.div>

      {/* Roadmap Sections */}
      <div className="space-y-6">
        {roadmapSections.map((section, si) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + si * 0.05 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${section.color}20` }}>
                <section.icon className="w-4 h-4" style={{ color: section.color }} />
              </div>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <span className="text-xs text-helios-500">{section.items.length} items</span>
            </div>
            <div className="space-y-3 ml-11">
              {section.items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + si * 0.05 + i * 0.03 }} className="glass p-4 glass-hover transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-md border-2 border-helios-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-accent-500/50 transition-colors">
                      {(item.status as string) === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm">{item.title}</span>
                        <span className={`badge text-[10px] ${priorityColors[item.priority]}`}>{item.priority}</span>
                        <span className="badge badge-cyan text-[10px]">{effortLabels[item.effort]}</span>
                      </div>
                      <p className="text-sm text-helios-400">{item.description}</p>
                    </div>
                    <span className="text-xs text-helios-500 shrink-0">{item.category}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
