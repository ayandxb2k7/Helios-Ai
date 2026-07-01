"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, FolderOpen, Plus, Activity, Shield, FileCode2,
  BarChart3, AlertTriangle, CheckCircle2, Brain, Search,
  GitBranch, Zap, ChevronRight, Cpu, Radio, Globe,
  Code2, Database, Waypoints,
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
} from "recharts";

const projects = [
  { id: "demo-next", name: "my-nextjs-app", tech: ["Next.js", "React", "TypeScript"], health: 87, issues: 3, status: "ready", lang: "TypeScript" },
  { id: "demo-api", name: "api-server", tech: ["Express", "Node.js", "PostgreSQL"], health: 72, issues: 8, status: "ready", lang: "TypeScript" },
  { id: "demo-ml", name: "ml-pipeline", tech: ["Python", "FastAPI", "scikit-learn"], health: 91, issues: 1, status: "scanning", lang: "Python" },
];

const radarData = [
  { subject: "Security", A: 85 }, { subject: "Performance", A: 78 },
  { subject: "Maintain", A: 92 }, { subject: "Docs", A: 65 },
  { subject: "Testing", A: 70 }, { subject: "Arch", A: 88 },
];

const activityData = [
  { day: "Mon", scans: 4, issues: 12 }, { day: "Tue", scans: 6, issues: 8 },
  { day: "Wed", scans: 3, issues: 15 }, { day: "Thu", scans: 8, issues: 6 },
  { day: "Fri", scans: 5, issues: 10 }, { day: "Sat", scans: 2, issues: 3 },
  { day: "Sun", scans: 1, issues: 2 },
];

const runningAgents = [
  { name: "Backend Agent", project: "api-server", progress: 78, icon: Code2, color: "#00cec9" },
  { name: "Security Agent", project: "my-nextjs-app", progress: 92, icon: Shield, color: "#e17055" },
  { name: "Frontend Agent", project: "my-nextjs-app", progress: 45, icon: Globe, color: "#fd79a8" },
];

const languageSupport = [
  { name: "React", icon: Code2 }, { name: "Next.js", icon: Globe },
  { name: "Python", icon: Code2 }, { name: "Go", icon: Code2 },
  { name: "Rust", icon: Code2 }, { name: "Java", icon: Code2 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="glass-sm p-2 text-[10px]">
      <div className="text-helios-300 mb-0.5">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-helios-200">{p.dataKey}: {p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen dot-grid">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-helios-950/80 backdrop-blur-xl border-b border-helios-700/50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-bold">HELIOS <span className="text-accent-400 text-xs">X</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-xs text-helios-300">
          <Link href="/dashboard" className="text-accent-400">Dashboard</Link>
          <Link href="/import" className="hover:text-helios-100">Import</Link>
          <a href="#features" className="hover:text-helios-100">Features</a>
        </div>
        <Link href="/import" className="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-white rounded-xl text-xs font-medium transition-all flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Project
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-helios-400 text-sm">Your AI engineering workspace — agents, projects, and insights.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Projects", value: projects.length, icon: FolderOpen, color: "text-accent-400", bg: "bg-accent-500/15" },
            { label: "Avg Health", value: `${Math.round(projects.reduce((a, p) => a + p.health, 0) / projects.length)}%`, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/15" },
            { label: "Issues", value: 12, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/15" },
            { label: "Active Agents", value: runningAgents.length, icon: Cpu, color: "text-cyan-400", bg: "bg-cyan-500/15" },
            { label: "Languages", value: "20+", icon: Code2, color: "text-rose-400", bg: "bg-rose-500/15" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] text-helios-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          <div className="glass p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-accent-400" /> Health</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(108,92,231,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#9090ab", fontSize: 9 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar dataKey="A" stroke="#6c5ce7" fill="#6c5ce7" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass p-5 lg:col-span-2">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /> Activity</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={activityData}>
                <defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} /><stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="day" tick={{ fill: "#9090ab", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9090ab", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="scans" stroke="#6c5ce7" fill="url(#aGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="issues" stroke="#00cec9" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          {/* Projects */}
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2"><FolderOpen className="w-4 h-4 text-accent-400" /> Projects</h3>
              <Link href="/import" className="text-[10px] text-accent-400 hover:text-accent-300 flex items-center gap-1"><Plus className="w-3 h-3" />Add</Link>
            </div>
            <div className="space-y-2">
              {projects.map((p) => (
                <Link key={p.id} href={`/project/${p.id}`} className="flex items-center justify-between p-3 glass-sm glass-hover rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold" style={{ color: p.health >= 80 ? "#00b894" : p.health >= 60 ? "#fdcb6e" : "#fd79a8" }}>{p.health}</div>
                    <div>
                      <div className="text-sm font-medium group-hover:text-accent-400 transition-colors">{p.name}</div>
                      <div className="flex gap-1.5 mt-0.5">{p.tech.slice(0, 3).map((t) => <span key={t} className="badge badge-purple text-[9px]">{t}</span>)}</div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-helios-500">{p.issues} issues · {p.status === "scanning" ? "⏳" : "✓"}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Agents */}
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> Active Agents</h3>
              <Link href="/project/demo-next/agents" className="text-[10px] text-accent-400 hover:text-accent-300 flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-3">
              {runningAgents.map((a) => (
                <div key={a.name} className="p-3 glass-sm rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <a.icon className="w-3.5 h-3.5" style={{ color: a.color }} />
                      <span className="text-xs font-medium">{a.name}</span>
                      <span className="text-[10px] text-helios-500">{a.project}</span>
                    </div>
                    <span className="text-[10px] text-accent-400 font-mono">{a.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-helios-700 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-accent-500 to-cyan-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${a.progress}%` }} transition={{ duration: 1.5 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Waypoints, label: "Knowledge Graph", desc: "Explore connections", href: "/project/demo-next/knowledge", color: "text-accent-400" },
            { icon: Cpu, label: "AI Agents", desc: "12 specialized agents", href: "/project/demo-next/agents", color: "text-cyan-400" },
            { icon: Shield, label: "Security", desc: "Check vulnerabilities", href: "/project/demo-next/security", color: "text-rose-400" },
            { icon: Activity, label: "Observability", desc: "Live logs & metrics", href: "/project/demo-next/observability", color: "text-emerald-400" },
          ].map((a) => (
            <Link key={a.label} href={a.href} className="glass glass-hover p-4 transition-all group">
              <a.icon className={`w-5 h-5 ${a.color} mb-2`} />
              <div className="font-medium text-sm group-hover:text-accent-400 transition-colors">{a.label}</div>
              <div className="text-[10px] text-helios-500 flex items-center gap-1">{a.desc} <ChevronRight className="w-2.5 h-2.5" /></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
