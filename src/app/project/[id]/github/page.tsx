"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  Copy,
  Check,
  MessageSquare,
  Clock,
  User,
  ArrowUpRight,
  FileCode2,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface PullRequest {
  id: string;
  title: string;
  author: string;
  branch: string;
  base: string;
  status: "open" | "merged" | "closed";
  additions: number;
  deletions: number;
  files: number;
  comments: number;
  time: string;
  reviewStatus: "pending" | "approved" | "changes_requested";
  reviewComments: ReviewComment[];
  commitMessage: string;
}

interface ReviewComment {
  file: string;
  line: number;
  comment: string;
  severity: "info" | "suggestion" | "warning";
}

const pullRequests: PullRequest[] = [
  {
    id: "42", title: "feat: add user authentication with JWT", author: "sarah-dev", branch: "feature/auth", base: "main",
    status: "open", additions: 245, deletions: 12, files: 8, comments: 3, time: "2h ago",
    reviewStatus: "changes_requested",
    reviewComments: [
      { file: "src/lib/auth.ts", line: 24, comment: "JWT_SECRET is accessed without null check. Add startup validation to prevent runtime crashes.", severity: "warning" },
      { file: "src/app/api/auth/route.ts", line: 15, comment: "Consider adding rate limiting to prevent brute force attacks on the login endpoint.", severity: "suggestion" },
      { file: "src/lib/auth.ts", line: 8, comment: "The bcrypt comparison should use a constant-time comparison to prevent timing attacks.", severity: "warning" },
    ],
    commitMessage: "feat(auth): implement JWT authentication with httpOnly cookies\n\n- Add login/register API endpoints\n- Implement JWT token generation and verification\n- Add auth middleware for protected routes\n- Store tokens in httpOnly cookies",
  },
  {
    id: "41", title: "fix: resolve dashboard re-rendering issue", author: "alex-eng", branch: "fix/dashboard-rerender", base: "main",
    status: "open", additions: 18, deletions: 5, files: 3, comments: 1, time: "5h ago",
    reviewStatus: "approved",
    reviewComments: [
      { file: "src/app/dashboard/page.tsx", line: 45, comment: "Good use of React.memo for the stat cards. This will significantly reduce unnecessary re-renders.", severity: "info" },
    ],
    commitMessage: "fix(dashboard): memoize stat card components\n\n- Wrap stat cards with React.memo\n- Use useMemo for computed values\n- Add useCallback for event handlers",
  },
  {
    id: "40", title: "chore: remove unused dependencies", author: "devops-bot", branch: "chore/cleanup-deps", base: "main",
    status: "merged", additions: 2, deletions: 8, files: 1, comments: 0, time: "1d ago",
    reviewStatus: "approved",
    reviewComments: [],
    commitMessage: "chore: remove unused dependencies (moment, lodash)\n\nRemoving unused packages to reduce bundle size and attack surface.",
  },
];

const recentCommits = [
  { hash: "a3f8d2c", message: "feat: add project health scoring", author: "sarah-dev", time: "1h ago", additions: 89, deletions: 12 },
  { hash: "b7e1f4a", message: "fix: resolve JWT expiration handling", author: "alex-eng", time: "3h ago", additions: 15, deletions: 8 },
  { hash: "c9d2e5b", message: "docs: update API documentation", author: "sarah-dev", time: "6h ago", additions: 45, deletions: 3 },
  { hash: "e1f3a7c", message: "refactor: extract validation schemas", author: "alex-eng", time: "1d ago", additions: 34, deletions: 28 },
  { hash: "f2g4b8d", message: "test: add auth flow integration tests", author: "sarah-dev", time: "1d ago", additions: 120, deletions: 0 },
];

const statusStyles = { open: "badge-emerald", merged: "badge-purple", closed: "badge-rose" };
const reviewStyles = { pending: "badge-amber", approved: "badge-emerald", changes_requested: "badge-rose" };

export default function GitHubPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [selectedPR, setSelectedPR] = useState<string | null>("42");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const pr = pullRequests.find((p) => p.id === selectedPR);

  const copyCommit = (hash: string, message: string) => {
    navigator.clipboard.writeText(`${hash} ${message}`);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">GitHub Integration</h1>
        </div>
        <p className="text-helios-400">PR reviews, commit analysis, and AI-generated commit messages.</p>
      </motion.div>

      {/* PR List */}
      <div className="space-y-3 mb-8">
        {pullRequests.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedPR(p.id)}
            className={`glass p-4 cursor-pointer transition-all ${selectedPR === p.id ? "border-accent-500/40" : "glass-hover"}`}
          >
            <div className="flex items-start gap-3">
              <GitPullRequest className={`w-5 h-5 shrink-0 mt-0.5 ${p.status === "open" ? "text-emerald-400" : p.status === "merged" ? "text-accent-400" : "text-helios-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{p.title}</span>
                  <span className={`badge text-[10px] ${statusStyles[p.status]}`}>{p.status}</span>
                  <span className={`badge text-[10px] ${reviewStyles[p.reviewStatus]}`}>{p.reviewStatus.replace("_", " ")}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-helios-500">
                  <span className="font-mono">#{p.id}</span>
                  <span>{p.branch} → {p.base}</span>
                  <span className="flex items-center gap-1"><Plus className="w-3 h-3 text-emerald-400" />{p.additions}</span>
                  <span className="flex items-center gap-1"><Minus className="w-3 h-3 text-rose-400" />{p.deletions}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{p.comments}</span>
                  <span className="ml-auto">{p.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PR Detail */}
      {pr && (
        <motion.div key={pr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* AI Review */}
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <h3 className="font-semibold text-sm">HELIOS AI Review</h3>
              <span className={`badge text-[10px] ${reviewStyles[pr.reviewStatus]}`}>{pr.reviewStatus.replace("_", " ")}</span>
            </div>
            <div className="space-y-3">
              {pr.reviewComments.map((c, i) => (
                <div key={i} className={`p-3 rounded-lg ${c.severity === "warning" ? "bg-rose-500/5 border border-rose-500/10" : c.severity === "suggestion" ? "bg-amber-500/5 border border-amber-500/10" : "bg-accent-500/5 border border-accent-500/10"}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {c.severity === "warning" ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> : c.severity === "suggestion" ? <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-accent-400" />}
                    <span className="text-xs font-mono text-helios-300">{c.file}:L{c.line}</span>
                  </div>
                  <p className="text-sm text-helios-300">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Commit Message */}
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitCommitHorizontal className="w-4 h-4 text-accent-400" />
                <h3 className="font-semibold text-sm">AI-Generated Commit Message</h3>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(pr.commitMessage); }} className="flex items-center gap-1.5 px-3 py-1 text-xs text-helios-400 hover:text-accent-400 transition-colors">
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <pre className="bg-helios-950 rounded-xl p-4 text-xs font-mono text-helios-200 whitespace-pre-wrap">{pr.commitMessage}</pre>
          </div>
        </motion.div>
      )}

      {/* Recent Commits */}
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><GitCommitHorizontal className="w-4 h-4 text-accent-400" /> Recent Commits</h3>
        <div className="glass overflow-hidden">
          <div className="divide-y divide-helios-700/30">
            {recentCommits.map((c) => (
              <div key={c.hash} className="flex items-center gap-3 px-4 py-3 hover:bg-helios-700/10 transition-colors">
                <code className="text-xs font-mono text-accent-400 w-16 shrink-0">{c.hash}</code>
                <span className="text-sm text-helios-200 flex-1 truncate">{c.message}</span>
                <span className="text-xs text-helios-500 flex items-center gap-2">
                  <Plus className="w-3 h-3 text-emerald-400" />{c.additions}
                  <Minus className="w-3 h-3 text-rose-400" />{c.deletions}
                </span>
                <span className="text-[10px] text-helios-500">{c.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}

function Lightbulb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>
    </svg>
  );
}
