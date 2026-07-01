"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  ArrowUpRight,
  XCircle,
} from "lucide-react";

interface Dependency {
  name: string;
  version: string;
  latestVersion: string;
  license: string;
  size: string;
  used: boolean;
  outdated: boolean;
  vulnerability: "none" | "low" | "medium" | "high" | "critical";
  category: "production" | "development";
  description: string;
}

const dependencies: Dependency[] = [
  { name: "next", version: "15.0.0", latestVersion: "15.2.6", license: "MIT", size: "2.1MB", used: true, outdated: true, vulnerability: "none", category: "production", description: "The React Framework for the Web" },
  { name: "react", version: "19.0.0", latestVersion: "19.2.6", license: "MIT", size: "142KB", used: true, outdated: true, vulnerability: "none", category: "production", description: "A JavaScript library for building user interfaces" },
  { name: "react-dom", version: "19.0.0", latestVersion: "19.2.6", license: "MIT", size: "1.4MB", used: true, outdated: true, vulnerability: "none", category: "production", description: "React package for working with the DOM" },
  { name: "drizzle-orm", version: "0.45.2", latestVersion: "0.45.2", license: "Apache-2.0", size: "320KB", used: true, outdated: false, vulnerability: "none", category: "production", description: "TypeScript ORM for SQL databases" },
  { name: "jsonwebtoken", version: "9.0.0", latestVersion: "9.0.2", license: "MIT", size: "24KB", used: true, outdated: true, vulnerability: "medium", category: "production", description: "JSON Web Token implementation" },
  { name: "pg", version: "8.20.0", latestVersion: "8.20.0", license: "MIT", size: "180KB", used: true, outdated: false, vulnerability: "none", category: "production", description: "PostgreSQL client for Node.js" },
  { name: "framer-motion", version: "11.0.0", latestVersion: "11.18.0", license: "MIT", size: "450KB", used: true, outdated: true, vulnerability: "none", category: "production", description: "Motion library for React" },
  { name: "recharts", version: "2.12.0", latestVersion: "2.15.0", license: "MIT", size: "890KB", used: true, outdated: true, vulnerability: "none", category: "production", description: "Composable charting library built on React components" },
  { name: "moment", version: "2.30.0", latestVersion: "2.30.1", license: "MIT", size: "340KB", used: false, outdated: true, vulnerability: "none", category: "production", description: "Parse, validate, manipulate, and display dates" },
  { name: "lodash", version: "4.17.21", latestVersion: "4.17.21", license: "MIT", size: "1.4MB", used: false, outdated: false, vulnerability: "none", category: "production", description: "Lodash modular utilities" },
  { name: "tailwindcss", version: "4.1.17", latestVersion: "4.1.17", license: "MIT", size: "5.2MB", used: true, outdated: false, vulnerability: "none", category: "development", description: "A utility-first CSS framework" },
  { name: "typescript", version: "5.9.3", latestVersion: "5.9.3", license: "Apache-2.0", size: "12MB", used: true, outdated: false, vulnerability: "none", category: "development", description: "TypeScript is a language for application scale JavaScript development" },
  { name: "drizzle-kit", version: "0.31.10", latestVersion: "0.31.10", license: "Apache-2.0", size: "2.3MB", used: true, outdated: false, vulnerability: "none", category: "development", description: "Drizzle ORM kit for migrations and introspection" },
  { name: "eslint", version: "9.39.4", latestVersion: "9.39.4", license: "MIT", size: "1.1MB", used: true, outdated: false, vulnerability: "none", category: "development", description: "An AST-based pattern checker for JavaScript" },
  { name: "@types/node", version: "22.19.15", latestVersion: "22.19.15", license: "MIT", size: "45KB", used: true, outdated: false, vulnerability: "none", category: "development", description: "TypeScript definitions for Node.js" },
];

const vulnColors: Record<string, string> = { none: "badge-emerald", low: "badge-cyan", medium: "badge-amber", high: "badge-rose", critical: "badge-rose" };

export default function DependenciesPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unused" | "outdated" | "vulnerable">("all");

  const filtered = dependencies.filter((dep) => {
    if (filter === "unused" && dep.used) return false;
    if (filter === "outdated" && !dep.outdated) return false;
    if (filter === "vulnerable" && dep.vulnerability === "none") return false;
    if (search && !dep.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSize = dependencies.filter((d) => d.used).reduce((a, d) => {
    const num = parseFloat(d.size);
    const mult = d.size.includes("MB") ? 1024 : 1;
    return a + num * mult;
  }, 0);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Dependency Analyzer</h1>
        </div>
        <p className="text-helios-400">Analyze packages for vulnerabilities, outdated versions, and unused libraries.</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-5 gap-4 mb-6">
        <div className="glass p-4 text-center">
          <Package className="w-5 h-5 text-accent-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{dependencies.length}</div>
          <div className="text-xs text-helios-400">Total</div>
        </div>
        <div className="glass p-4 text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{dependencies.filter((d) => d.used).length}</div>
          <div className="text-xs text-helios-400">Used</div>
        </div>
        <div className="glass p-4 text-center">
          <XCircle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{dependencies.filter((d) => !d.used).length}</div>
          <div className="text-xs text-helios-400">Unused</div>
        </div>
        <div className="glass p-4 text-center">
          <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{dependencies.filter((d) => d.outdated).length}</div>
          <div className="text-xs text-helios-400">Outdated</div>
        </div>
        <div className="glass p-4 text-center">
          <Shield className="w-5 h-5 text-rose-400 mx-auto mb-1" />
          <div className="text-xl font-bold">{dependencies.filter((d) => d.vulnerability !== "none").length}</div>
          <div className="text-xs text-helios-400">Vulnerable</div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-helios-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search packages..." className="w-full pl-11 pr-4 py-2.5 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50" />
        </div>
        {(["all", "unused", "outdated", "vulnerable"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm transition-all capitalize ${filter === f ? "bg-accent-500/15 text-accent-400 border border-accent-500/20" : "glass glass-hover"}`}>
            {f}
          </button>
        ))}
      </motion.div>

      {/* Dependencies Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-helios-700/50">
                <th className="text-left px-5 py-3 text-helios-500 font-medium">Package</th>
                <th className="text-left px-5 py-3 text-helios-500 font-medium">Version</th>
                <th className="text-left px-5 py-3 text-helios-500 font-medium">Latest</th>
                <th className="text-left px-5 py-3 text-helios-500 font-medium">Size</th>
                <th className="text-left px-5 py-3 text-helios-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-helios-500 font-medium">Security</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dep) => (
                <tr key={dep.name} className="border-b border-helios-700/30 hover:bg-helios-700/10 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-helios-400" />
                      <div>
                        <span className="font-mono font-medium text-helios-200">{dep.name}</span>
                        <div className="text-xs text-helios-500 truncate max-w-48">{dep.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-helios-300">{dep.version}</td>
                  <td className="px-5 py-3 font-mono">
                    {dep.outdated ? (
                      <span className="text-amber-400 flex items-center gap-1">{dep.latestVersion} <ArrowUpRight className="w-3 h-3" /></span>
                    ) : (
                      <span className="text-helios-500">{dep.latestVersion}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-helios-300">{dep.size}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      {!dep.used && <span className="badge badge-rose text-[10px]">unused</span>}
                      {dep.outdated && <span className="badge badge-amber text-[10px]">outdated</span>}
                      {dep.used && !dep.outdated && <span className="badge badge-emerald text-[10px]">current</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge text-[10px] ${vulnColors[dep.vulnerability]}`}>
                      {dep.vulnerability === "none" ? "✓ Safe" : dep.vulnerability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
