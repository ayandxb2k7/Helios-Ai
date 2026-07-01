"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Key,
  Lock,
  CheckCircle2,
  XCircle,
  FileCode2,
  ExternalLink,
} from "lucide-react";

interface SecurityIssue {
  id: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
  filePath: string;
  lineNumber?: number;
  cwe?: string;
}

const securityIssues: SecurityIssue[] = [
  {
    id: "1",
    category: "Hardcoded Secrets",
    severity: "critical",
    title: "Hardcoded API key in config.ts",
    description: "An API key is hardcoded directly in the source code at line 15. This exposes the key in version control and production builds.",
    recommendation: "Move the API key to an environment variable (process.env.API_KEY) and add it to .gitignore.",
    filePath: "src/config.ts",
    lineNumber: 15,
    cwe: "CWE-798",
  },
  {
    id: "2",
    category: "JWT Issues",
    severity: "high",
    title: "Missing JWT secret validation",
    description: "JWT_SECRET is accessed from process.env without any validation. If the environment variable is missing, the application will crash or use an undefined secret.",
    recommendation: "Add a startup check that validates JWT_SECRET exists and throw a descriptive error if missing.",
    filePath: "src/lib/auth.ts",
    lineNumber: 24,
    cwe: "CWE-1188",
  },
  {
    id: "3",
    category: "Missing Validation",
    severity: "high",
    title: "Missing input validation in POST /api/users",
    description: "The user creation endpoint accepts raw request body without schema validation. Malicious or malformed data could be inserted into the database.",
    recommendation: "Implement request body validation using Zod or a similar schema validation library.",
    filePath: "src/app/api/users/route.ts",
    lineNumber: 8,
    cwe: "CWE-20",
  },
  {
    id: "4",
    category: "CORS Problems",
    severity: "medium",
    title: "Overly permissive CORS configuration",
    description: "The CORS middleware allows all origins (*). In production, this should be restricted to known domains.",
    recommendation: "Set specific allowed origins in the CORS configuration for production environments.",
    filePath: "src/middleware.ts",
    lineNumber: 5,
  },
  {
    id: "5",
    category: "Dependency Vulnerability",
    severity: "medium",
    title: "Outdated jsonwebtoken version",
    description: "The jsonwebtoken package version 9.0.0 has a known vulnerability (CVE-2022-23529) that could allow attackers to bypass signature verification.",
    recommendation: "Update jsonwebtoken to version 9.0.2 or later.",
    filePath: "package.json",
    cwe: "CWE-347",
  },
  {
    id: "6",
    category: "Unsafe APIs",
    severity: "medium",
    title: "Unprotected admin API endpoint",
    description: "The /api/admin endpoint lacks role-based access control. Any authenticated user could access admin functionality.",
    recommendation: "Add role-based middleware to check that the user has an 'admin' role before allowing access.",
    filePath: "src/app/api/admin/route.ts",
  },
];

const categoryStats = [
  { name: "Hardcoded Secrets", count: 1, icon: Key, color: "text-rose-400" },
  { name: "JWT Issues", count: 1, icon: Lock, color: "text-amber-400" },
  { name: "Missing Validation", count: 1, icon: Shield, color: "text-amber-400" },
  { name: "CORS Problems", count: 1, icon: AlertTriangle, color: "text-helios-400" },
  { name: "Dependency Vulns", count: 1, icon: FileCode2, color: "text-helios-400" },
  { name: "Unsafe APIs", count: 1, icon: ExternalLink, color: "text-helios-400" },
];

export default function SecurityPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-rose-400" />
          <h1 className="text-3xl font-bold">Security Analysis</h1>
        </div>
        <p className="text-helios-400">Vulnerabilities and security issues detected in your codebase.</p>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass p-5 text-center">
          <XCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-rose-400">1</div>
          <div className="text-xs text-helios-400">Critical</div>
        </div>
        <div className="glass p-5 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-amber-400">2</div>
          <div className="text-xs text-helios-400">High</div>
        </div>
        <div className="glass p-5 text-center">
          <CheckCircle2 className="w-8 h-8 text-helios-400 mx-auto mb-2" />
          <div className="text-3xl font-bold">3</div>
          <div className="text-xs text-helios-400">Medium/Low</div>
        </div>
      </motion.div>

      {/* Category Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass p-6 mb-8">
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categoryStats.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3 p-3 glass-sm rounded-xl">
              <cat.icon className={`w-5 h-5 ${cat.color}`} />
              <div>
                <div className="text-sm font-medium">{cat.name}</div>
                <div className="text-xs text-helios-400">{cat.count} issue{cat.count !== 1 ? "s" : ""}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Issues */}
      <div className="space-y-4">
        {securityIssues.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="glass p-6"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                issue.severity === "critical" ? "bg-rose-500/15" : issue.severity === "high" ? "bg-amber-500/15" : "bg-helios-500/10"
              }`}>
                {issue.severity === "critical" ? (
                  <XCircle className="w-5 h-5 text-rose-400" />
                ) : issue.severity === "high" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <Shield className="w-5 h-5 text-helios-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-semibold">{issue.title}</h3>
                  <span className={`badge ${issue.severity === "critical" ? "badge-rose" : issue.severity === "high" ? "badge-amber" : "badge-purple"}`}>
                    {issue.severity}
                  </span>
                  {issue.cwe && <span className="badge badge-cyan">{issue.cwe}</span>}
                </div>
                <p className="text-sm text-helios-400 mb-3">{issue.description}</p>

                <div className="glass-sm p-3 rounded-lg mb-3">
                  <div className="text-xs font-semibold text-emerald-400 mb-1">Recommendation</div>
                  <p className="text-sm text-helios-300">{issue.recommendation}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-helios-500">
                  <FileCode2 className="w-3 h-3" />
                  <span className="font-mono">{issue.filePath}</span>
                  {issue.lineNumber && <span>:L{issue.lineNumber}</span>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
