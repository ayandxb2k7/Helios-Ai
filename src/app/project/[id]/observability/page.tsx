"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Info,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Clock,
  TrendingUp,
  BarChart3,
  Cpu,
  HardDrive,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface LogEntry {
  id: string;
  level: "info" | "warn" | "error" | "debug";
  source: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

const metricsData = [
  { time: "00:00", errors: 2, warnings: 5, requests: 120, cpu: 34, memory: 52 },
  { time: "04:00", errors: 0, warnings: 2, requests: 45, cpu: 22, memory: 48 },
  { time: "08:00", errors: 1, warnings: 8, requests: 340, cpu: 56, memory: 61 },
  { time: "12:00", errors: 5, warnings: 12, requests: 520, cpu: 78, memory: 72 },
  { time: "16:00", errors: 3, warnings: 7, requests: 410, cpu: 65, memory: 68 },
  { time: "20:00", errors: 1, warnings: 4, requests: 280, cpu: 42, memory: 55 },
  { time: "Now", errors: 2, warnings: 6, requests: 390, cpu: 58, memory: 63 },
];

const errorTrend = [
  { day: "Mon", errors: 3, warnings: 8 },
  { day: "Tue", errors: 1, warnings: 5 },
  { day: "Wed", errors: 5, warnings: 12 },
  { day: "Thu", errors: 2, warnings: 6 },
  { day: "Fri", errors: 4, warnings: 9 },
  { day: "Sat", errors: 0, warnings: 2 },
  { day: "Sun", errors: 1, warnings: 3 },
];

const logs: LogEntry[] = [
  { id: "1", level: "error", source: "api/auth", message: "Authentication failed: JWT verification error — token expired", timestamp: "2s ago", metadata: { userId: "usr_2k3j4", ip: "192.168.1.42" } },
  { id: "2", level: "warn", source: "api/users", message: "Slow query detected: GET /api/users took 2.3s (threshold: 500ms)", timestamp: "15s ago", metadata: { query: "SELECT * FROM users WHERE...", duration: "2300ms" } },
  { id: "3", level: "error", source: "middleware", message: "Unhandled error in auth middleware: Cannot read property 'id' of null", timestamp: "32s ago", metadata: { stack: "at verify (middleware.ts:12)" } },
  { id: "4", level: "warn", source: "api/projects", message: "Rate limit approaching: 45/50 requests in current window", timestamp: "1m ago" },
  { id: "5", level: "info", source: "scanner", message: "Project scan completed: 247 files analyzed, 34 components detected", timestamp: "2m ago" },
  { id: "6", level: "info", source: "system", message: "Database connection pool: 8/20 active connections", timestamp: "3m ago" },
  { id: "7", level: "debug", source: "api/health", message: "Health check passed: response time 12ms", timestamp: "4m ago" },
  { id: "8", level: "error", source: "analytics", message: "Analytics service unavailable: ECONNREFUSED 127.0.0.1:6379", timestamp: "5m ago", metadata: { service: "redis", port: "6379" } },
  { id: "9", level: "warn", source: "api/users", message: "Missing pagination parameters: returning default limit of 100", timestamp: "6m ago" },
  { id: "10", level: "info", source: "system", message: "Memory usage: 63% (504MB / 800MB)", timestamp: "7m ago" },
  { id: "11", level: "debug", source: "compiler", message: "Hot module replacement: 3 files updated", timestamp: "8m ago" },
  { id: "12", level: "warn", source: "security", message: "Potential XSS attempt detected in user input: <script> tag found", timestamp: "10m ago", metadata: { endpoint: "POST /api/users", field: "name" } },
  { id: "13", level: "info", source: "system", message: "Background job completed: stale session cleanup (removed 23 sessions)", timestamp: "12m ago" },
  { id: "14", level: "error", source: "api/auth", message: "JWT_SECRET environment variable not set — using fallback (INSECURE)", timestamp: "15m ago" },
];

const levelConfig = {
  error: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10", badge: "badge-rose" },
  warn: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", badge: "badge-amber" },
  info: { icon: Info, color: "text-accent-400", bg: "bg-accent-500/10", badge: "badge-purple" },
  debug: { icon: Activity, color: "text-helios-400", bg: "bg-helios-500/10", badge: "badge-cyan" },
};

export default function ObservabilityPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = logs.filter((l) => {
    if (levelFilter !== "all" && l.level !== levelFilter) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase()) && !l.source.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = { error: logs.filter((l) => l.level === "error").length, warn: logs.filter((l) => l.level === "warn").length, info: logs.filter((l) => l.level === "info").length, debug: logs.filter((l) => l.level === "debug").length };

  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Observability</h1>
        </div>
        <p className="text-helios-400">Live logs, errors, warnings, and repository metrics.</p>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: "Errors", value: counts.error, icon: XCircle, color: "text-rose-400", trend: "+2 today" },
          { label: "Warnings", value: counts.warn, icon: AlertCircle, color: "text-amber-400", trend: "+4 today" },
          { label: "CPU", value: "58%", icon: Cpu, color: "text-cyan-400", trend: "normal" },
          { label: "Memory", value: "63%", icon: HardDrive, color: "text-accent-400", trend: "504MB" },
          { label: "Req/min", value: "390", icon: TrendingUp, color: "text-emerald-400", trend: "+12%" },
        ].map((m) => (
          <div key={m.label} className="glass p-3 text-center">
            <m.icon className={`w-4 h-4 ${m.color} mx-auto mb-1`} />
            <div className="text-lg font-bold">{m.value}</div>
            <div className="text-[10px] text-helios-400">{m.label}</div>
            <div className="text-[10px] text-helios-500 mt-0.5">{m.trend}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Request Volume */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass p-5">
          <h3 className="font-semibold text-sm mb-3">Request Volume</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={metricsData}>
              <defs><linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} /><stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="time" tick={{ fill: "#9090ab", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9090ab", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(26,26,46,0.95)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", fontSize: 11 }} />
              <Area type="monotone" dataKey="requests" stroke="#6c5ce7" fill="url(#reqGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Error Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-5">
          <h3 className="font-semibold text-sm mb-3">Error Trend</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={errorTrend}>
              <XAxis dataKey="day" tick={{ fill: "#9090ab", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9090ab", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(26,26,46,0.95)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", fontSize: 11 }} />
              <Bar dataKey="errors" fill="#fd79a8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="warnings" fill="#fdcb6e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Log Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-helios-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter logs..." className="w-full pl-9 pr-3 py-2 bg-helios-800/60 border border-helios-600/50 rounded-lg text-xs text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50" />
        </div>
        {(["all", "error", "warn", "info", "debug"] as const).map((level) => (
          <button key={level} onClick={() => setLevelFilter(level)} className={`px-3 py-2 rounded-lg text-xs transition-all capitalize ${levelFilter === level ? "bg-accent-500/15 text-accent-400 border border-accent-500/20" : "glass glass-hover text-helios-400"}`}>
            {level} {level !== "all" && <span className="text-helios-500">({counts[level] || 0})</span>}
          </button>
        ))}
      </motion.div>

      {/* Logs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass overflow-hidden">
        <div className="divide-y divide-helios-700/30">
          {filtered.map((log) => {
            const config = levelConfig[log.level];
            return (
              <div key={log.id} className="flex items-start gap-3 px-4 py-3 hover:bg-helios-700/10 transition-colors">
                <config.icon className={`w-4 h-4 ${config.color} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`badge text-[9px] ${config.badge}`}>{log.level}</span>
                    <span className="text-[10px] font-mono text-accent-400">{log.source}</span>
                    <span className="text-[10px] text-helios-600 ml-auto">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-helios-300">{log.message}</p>
                  {log.metadata && (
                    <div className="flex gap-3 mt-1">
                      {Object.entries(log.metadata).map(([k, v]) => (
                        <span key={k} className="text-[10px] text-helios-500 font-mono">{k}: {v}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
