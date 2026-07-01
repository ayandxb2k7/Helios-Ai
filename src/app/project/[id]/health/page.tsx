"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  Zap,
  FileText,
  GitBranch,
  Activity,
  TestTube,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const categories = [
  { name: "Code Quality", score: 88, icon: Activity, color: "#6c5ce7", details: "Clean code structure with consistent naming conventions. Minor issues with some complex functions." },
  { name: "Security", score: 72, icon: Shield, color: "#fd79a8", details: "2 security issues found: hardcoded API key and missing JWT validation. CORS configuration needs review." },
  { name: "Performance", score: 82, icon: Zap, color: "#00cec9", details: "Good overall performance. Bundle size could be optimized. Some unnecessary re-renders in dashboard components." },
  { name: "Maintainability", score: 91, icon: GitBranch, color: "#00b894", details: "Well-structured codebase with clear separation of concerns. Good use of TypeScript types." },
  { name: "Documentation", score: 65, icon: FileText, color: "#fdcb6e", details: "README exists but lacks API documentation. Missing inline comments for complex logic." },
  { name: "Testing", score: 58, icon: TestTube, color: "#e17055", details: "Only 23% code coverage. Critical paths lack unit tests. No integration tests for API routes." },
  { name: "Architecture", score: 85, icon: GitBranch, color: "#a29bfe", details: "Clean architecture following Next.js conventions. Some circular dependencies in utility modules." },
];

const radarData = categories.map((c) => ({ subject: c.name, A: c.score }));
const barData = categories.map((c) => ({ name: c.name.split(" ")[0], score: c.score, fill: c.color }));

const overallScore = Math.round(categories.reduce((a, c) => a + c.score, 0) / categories.length);

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80) return <span className="badge badge-emerald">{score}/100</span>;
  if (score >= 60) return <span className="badge badge-amber">{score}/100</span>;
  return <span className="badge badge-rose">{score}/100</span>;
}

export default function HealthPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-rose-400" />
          <h1 className="text-3xl font-bold">Project Health</h1>
        </div>
        <p className="text-helios-400">Comprehensive analysis of your project&apos;s health across multiple dimensions.</p>
      </motion.div>

      {/* Overall Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-8 mb-8 text-center">
        <div className="relative inline-block mb-4">
          <svg width={160} height={160}>
            <circle cx={80} cy={80} r={70} fill="none" stroke="rgba(108,92,231,0.1)" strokeWidth={8} />
            <circle
              cx={80} cy={80} r={70} fill="none"
              stroke={overallScore >= 80 ? "#00b894" : overallScore >= 60 ? "#fdcb6e" : "#fd79a8"}
              strokeWidth={8} strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - overallScore / 100)}
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "all 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <div className="text-4xl font-bold" style={{ color: overallScore >= 80 ? "#00b894" : overallScore >= 60 ? "#fdcb6e" : "#fd79a8" }}>
                {overallScore}
              </div>
              <div className="text-xs text-helios-500">Overall</div>
            </div>
          </div>
        </div>
        <p className="text-helios-400 text-sm">Your project is in {overallScore >= 80 ? "great" : overallScore >= 60 ? "good" : "need of improvement"} shape</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass p-6">
          <h3 className="font-semibold mb-4">Health Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(108,92,231,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9090ab", fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="#6c5ce7" fill="#6c5ce7" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
          <h3 className="font-semibold mb-4">Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: "#9090ab", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9090ab", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "rgba(26,26,46,0.95)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", fontSize: 12 }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Details */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="font-semibold mb-4">Detailed Analysis</h3>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="glass p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                    <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <div className="font-medium">{cat.name}</div>
                  </div>
                </div>
                <ScoreBadge score={cat.score} />
              </div>
              <div className="w-full h-2 bg-helios-700 rounded-full mb-3 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                />
              </div>
              <p className="text-sm text-helios-400">{cat.details}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
