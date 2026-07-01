"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileCode2,
  FunctionSquare,
  Variable,
  Route,
  Box,
  Filter,
  ArrowUpRight,
  Hash,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "function" | "variable" | "api" | "component" | "file" | "keyword";
  name: string;
  filePath: string;
  lineNumber: number;
  context: string;
  matchStart: number;
  matchEnd: number;
}

const searchResults: SearchResult[] = [
  { id: "1", type: "function", name: "getCurrentUser", filePath: "src/lib/auth.ts", lineNumber: 5, context: "export async function getCurrentUser() {", matchStart: 23, matchEnd: 38 },
  { id: "2", type: "function", name: "generateToken", filePath: "src/lib/auth.ts", lineNumber: 18, context: "export function generateToken(userId: string, role: string) {", matchStart: 16, matchEnd: 29 },
  { id: "3", type: "variable", name: "JWT_SECRET", filePath: "src/lib/auth.ts", lineNumber: 24, context: "process.env.JWT_SECRET!,", matchStart: 12, matchEnd: 22 },
  { id: "4", type: "api", name: "POST /api/auth", filePath: "src/app/api/auth/route.ts", lineNumber: 5, context: "export async function POST(req: NextRequest) {", matchStart: 0, matchEnd: 4 },
  { id: "5", type: "api", name: "GET /api/users", filePath: "src/app/api/users/route.ts", lineNumber: 4, context: "export async function GET() {", matchStart: 0, matchEnd: 3 },
  { id: "6", type: "component", name: "Button", filePath: "src/components/Button.tsx", lineNumber: 8, context: "export function Button({ variant, className, children, ...props }) {", matchStart: 16, matchEnd: 22 },
  { id: "7", type: "component", name: "Card", filePath: "src/components/Card.tsx", lineNumber: 6, context: "export function Card({ title, children }: CardProps) {", matchStart: 16, matchEnd: 20 },
  { id: "8", type: "function", name: "debounce", filePath: "src/lib/utils.ts", lineNumber: 11, context: "export function debounce<T extends (...args: unknown[]) => void>(", matchStart: 16, matchEnd: 24 },
  { id: "9", type: "variable", name: "DATABASE_URL", filePath: "src/db/index.ts", lineNumber: 3, context: "const databaseUrl = process.env.DATABASE_URL;", matchStart: 27, matchEnd: 39 },
  { id: "10", type: "file", name: "schema.ts", filePath: "src/db/schema.ts", lineNumber: 1, context: "import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';", matchStart: 0, matchEnd: 6 },
  { id: "11", type: "keyword", name: "jwt.verify", filePath: "src/middleware.ts", lineNumber: 12, context: "const decoded = jwt.verify(token, process.env.JWT_SECRET!);", matchStart: 16, matchEnd: 26 },
  { id: "12", type: "function", name: "formatDate", filePath: "src/lib/utils.ts", lineNumber: 6, context: "export function formatDate(date: Date) {", matchStart: 16, matchEnd: 26 },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  function: { icon: FunctionSquare, color: "text-accent-400", label: "Function" },
  variable: { icon: Variable, color: "text-cyan-400", label: "Variable" },
  api: { icon: Route, color: "text-emerald-400", label: "API" },
  component: { icon: Box, color: "text-rose-400", label: "Component" },
  file: { icon: FileCode2, color: "text-amber-400", label: "File" },
  keyword: { icon: Hash, color: "text-helios-300", label: "Keyword" },
};

export default function SearchPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searched, setSearched] = useState(false);

  const filtered = searchResults.filter((r) => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (query && !r.name.toLowerCase().includes(query.toLowerCase()) && !r.context.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const handleSearch = () => {
    setSearched(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Code Search</h1>
        </div>
        <p className="text-helios-400">Search by function, variable, API, component, file, or keyword.</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-helios-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search functions, variables, APIs, components..."
              className="w-full pl-11 pr-4 py-3 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20"
            />
          </div>
          <button onClick={handleSearch} className="px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white rounded-xl text-sm font-medium transition-all">
            Search
          </button>
        </div>
      </motion.div>

      {/* Type Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "all", label: "All", count: searchResults.length },
          ...Object.entries(typeConfig).map(([id, config]) => ({
            id,
            label: config.label,
            count: searchResults.filter((r) => r.type === id).length,
          })),
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setTypeFilter(filter.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
              typeFilter === filter.id
                ? "bg-accent-500/15 text-accent-400 border border-accent-500/20"
                : "text-helios-400 hover:text-helios-200 hover:bg-helios-700/30"
            }`}
          >
            {filter.label} <span className="text-helios-500">{filter.count}</span>
          </button>
        ))}
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((result, i) => {
              const config = typeConfig[result.type];
              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass p-5 glass-hover cursor-pointer transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-helios-800 flex items-center justify-center shrink-0">
                      <config.icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-semibold text-sm group-hover:text-accent-400 transition-colors">
                          {result.name}
                        </span>
                        <span className="badge badge-purple text-[10px]">{config.label}</span>
                      </div>
                      <div className="font-mono text-xs text-helios-300 bg-helios-900/60 rounded-lg p-2.5 mb-2 overflow-x-auto">
                        {result.context.substring(0, result.matchStart)}
                        <mark className="bg-accent-500/30 text-accent-300 rounded px-0.5">
                          {result.context.substring(result.matchStart, result.matchEnd)}
                        </mark>
                        {result.context.substring(result.matchEnd)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-helios-500">
                        <FileCode2 className="w-3 h-3" />
                        <span className="font-mono">{result.filePath}</span>
                        <span>:L{result.lineNumber}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-helios-600 group-hover:text-accent-400 transition-colors shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : searched ? (
          <div className="text-center py-16 text-helios-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-helios-600" />
            <p className="text-lg">No results found</p>
            <p className="text-sm mt-1">Try a different search query or filter</p>
          </div>
        ) : (
          <div className="text-center py-16 text-helios-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-helios-600" />
            <p className="text-lg">Search your codebase</p>
            <p className="text-sm mt-1">Enter a function name, variable, API path, or keyword</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
