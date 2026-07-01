"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
  Gauge,
  Zap,
  FileCode2,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PerformanceIssue {
  id: string;
  category: "bundle" | "render" | "api" | "component" | "asset";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  suggestion: string;
  filePath: string;
}

const bundleData = [
  { name: "recharts", size: 890 },
  { name: "framer-motion", size: 450 },
  { name: "react-dom", size: 340 },
  { name: "next", size: 210 },
  { name: "drizzle-orm", size: 320 },
  { name: "monaco-editor", size: 1200 },
  { name: "xyflow", size: 280 },
  { name: "other", size: 150 },
];

const pieData = [
  { name: "JavaScript", value: 65, color: "#6c5ce7" },
  { name: "CSS", value: 15, color: "#00cec9" },
  { name: "HTML", value: 5, color: "#fdcb6e" },
  { name: "Images", value: 10, color: "#fd79a8" },
  { name: "Fonts", value: 5, color: "#00b894" },
];

const issues: PerformanceIssue[] = [
  { id: "1", category: "bundle", severity: "high", title: "Large bundle: Monaco Editor (~1.2MB)", description: "Monaco Editor adds ~1.2MB to the client bundle, significantly impacting initial load time.", impact: "Adds ~800ms to First Contentful Paint on 3G connections", suggestion: "Use next/dynamic with ssr: false to load Monaco only when needed. Consider lighter alternatives like CodeMirror.", filePath: "src/app/project/[id]/files/page.tsx" },
  { id: "2", category: "bundle", severity: "high", title: "Recharts adds ~890KB to client bundle", description: "Recharts is a heavy charting library that loads on the dashboard page.", impact: "Increases dashboard page load by ~400ms", suggestion: "Consider using lightweight chart alternatives or implement custom SVG charts for simple visualizations.", filePath: "package.json" },
  { id: "3", category: "render", severity: "medium", title: "Unoptimized re-renders in dashboard", description: "Dashboard stat cards re-render on every parent state change without memoization.", impact: "Unnecessary 15-20ms per render cycle", suggestion: "Wrap stat cards with React.memo. Use useMemo for computed values. Split state into smaller contexts.", filePath: "src/app/dashboard/page.tsx" },
  { id: "4", category: "api", severity: "medium", title: "Repeated API calls on dashboard mount", description: "Dashboard makes 3 separate API calls on mount that could be combined into a single endpoint.", impact: "3 round trips instead of 1, adding ~200ms latency", suggestion: "Create a /api/dashboard/summary endpoint that returns all dashboard data in a single request.", filePath: "src/app/dashboard/page.tsx" },
  { id: "5", category: "component", severity: "medium", title: "Heavy React Flow component loads eagerly", description: "React Flow (@xyflow/react) loads on the architecture page even when not needed.", impact: "Adds ~280KB to architecture page bundle", suggestion: "Use dynamic import: dynamic(() => import('@xyflow/react'), { ssr: false })", filePath: "src/app/project/[id]/architecture/page.tsx" },
  { id: "6", category: "asset", severity: "low", title: "No image optimization detected", description: "Images are not using Next.js Image component for automatic optimization.", impact: "Missing WebP/AVIF conversion, lazy loading, and responsive sizing", suggestion: "Replace <img> tags with next/image component for automatic optimization.", filePath: "src/" },
  { id: "7", category: "render", severity: "low", title: "Missing Suspense boundaries", description: "No React Suspense boundaries configured for streaming SSR.", impact: "Entire page waits for all data before rendering", suggestion: "Wrap slow-loading sections in <Suspense> for progressive rendering.", filePath: "src/app/" },
  { id: "8", category: "bundle", severity: "medium", title: "No tree-shaking for lodash imports", description: "lodash is imported entirely instead of individual functions.", impact: "Entire lodash library (~1.4MB) included for one function", suggestion: "Replace lodash.debounce with a custom 5-line implementation or use lodash-es for tree-shaking.", filePath: "package.json" },
];

const categoryIcons: Record<string, React.ElementType> = { bundle: Package, render: Zap, api: Activity, component: FileCode2, asset: Gauge };
const severityStyles: Record<string, { color: string; badge: string }> = { high: { color: "text-rose-400", badge: "badge-rose" }, medium: { color: "text-amber-400", badge: "badge-amber" }, low: { color: "text-helios-400", badge: "badge-purple" } };

function Package(props: React.SVGProps<SVGSVGElement>) {
  return <FileCode2 {...props} />;
}

export default function PerformancePage({ params }: { params: Promise<{ id: string }> }) {
  use(params);

  const totalBundleKB = bundleData.reduce((a, b) => a + b.size, 0);
  const highIssues = issues.filter((i) => i.severity === "high").length;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Gauge className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Performance Inspector</h1>
        </div>
        <p className="text-helios-400">Bundle analysis, render performance, and optimization suggestions.</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass p-5 text-center">
          <Package className="w-5 h-5 text-accent-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{(totalBundleKB / 1024).toFixed(1)}MB</div>
          <div className="text-xs text-helios-400">Est. Bundle Size</div>
        </div>
        <div className="glass p-5 text-center">
          <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{highIssues}</div>
          <div className="text-xs text-helios-400">High Priority</div>
        </div>
        <div className="glass p-5 text-center">
          <TrendingUp className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{issues.filter((i) => i.severity === "medium").length}</div>
          <div className="text-xs text-helios-400">Medium Priority</div>
        </div>
        <div className="glass p-5 text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-xl font-bold">~40%</div>
          <div className="text-xs text-helios-400">Can Reduce</div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bundle Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass p-6">
          <h3 className="font-semibold mb-4">Bundle Breakdown (KB)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bundleData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#9090ab", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#9090ab", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: "rgba(26,26,46,0.95)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", fontSize: 12 }} />
              <Bar dataKey="size" fill="#6c5ce7" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Content Type Split */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
          <h3 className="font-semibold mb-4">Content Type Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(26,26,46,0.95)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-helios-300">{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Issues */}
      <h3 className="font-semibold mb-4">Optimization Suggestions</h3>
      <div className="space-y-3">
        {issues.map((issue, i) => {
          const Icon = categoryIcons[issue.category] || Gauge;
          const style = severityStyles[issue.severity];
          return (
            <motion.div key={issue.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.03 }} className="glass p-5">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${issue.severity === "high" ? "bg-rose-500/15" : issue.severity === "medium" ? "bg-amber-500/15" : "bg-helios-500/10"}`}>
                  <Icon className={`w-4 h-4 ${style.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm">{issue.title}</span>
                    <span className={`badge text-[10px] ${style.badge}`}>{issue.severity}</span>
                    <span className="badge badge-cyan text-[10px]">{issue.category}</span>
                  </div>
                  <p className="text-sm text-helios-400 mb-2">{issue.description}</p>
                  <div className="glass-sm p-3 rounded-lg mb-2">
                    <div className="text-xs font-semibold text-amber-400 mb-1">⚡ Impact</div>
                    <p className="text-sm text-helios-300">{issue.impact}</p>
                  </div>
                  <div className="glass-sm p-3 rounded-lg">
                    <div className="text-xs font-semibold text-emerald-400 mb-1">💡 Fix</div>
                    <p className="text-sm text-helios-300">{issue.suggestion}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-helios-500 mt-2">
                    <FileCode2 className="w-3 h-3" />
                    <span className="font-mono">{issue.filePath}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
