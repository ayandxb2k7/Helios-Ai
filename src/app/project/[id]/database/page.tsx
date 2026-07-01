"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Table2,
  Key,
  Link2,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Search,
  Lightbulb,
  Network,
} from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: { table: string; column: string };
  default?: string;
  index?: boolean;
  unique?: boolean;
}

interface Table {
  name: string;
  description: string;
  columns: Column[];
  rowCount?: number;
  indexes: { name: string; columns: string[]; type: string }[];
  querySuggestions: string[];
}

const tables: Table[] = [
  {
    name: "projects",
    description: "Core project data including health scores and metadata",
    rowCount: 3,
    indexes: [
      { name: "idx_projects_status", columns: ["status"], type: "B-Tree" },
      { name: "idx_projects_created", columns: ["created_at"], type: "B-Tree" },
    ],
    querySuggestions: [
      "SELECT * FROM projects WHERE status = 'ready' ORDER BY health_score DESC",
      "SELECT COUNT(*), status FROM projects GROUP BY status",
      "SELECT * FROM projects WHERE created_at > NOW() - INTERVAL '7 days'",
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, default: "gen_random_uuid()" },
      { name: "name", type: "VARCHAR(255)", nullable: false, index: true },
      { name: "description", type: "TEXT", nullable: true },
      { name: "repo_url", type: "VARCHAR(500)", nullable: true },
      { name: "tech_stack", type: "JSONB", nullable: true, default: "[]", index: true },
      { name: "health_score", type: "INTEGER", nullable: true, default: "0" },
      { name: "architecture_score", type: "INTEGER", nullable: true, default: "0" },
      { name: "security_score", type: "INTEGER", nullable: true, default: "0" },
      { name: "status", type: "VARCHAR(50)", nullable: true, default: "'scanning'", index: true },
      { name: "file_count", type: "INTEGER", nullable: true, default: "0" },
      { name: "api_count", type: "INTEGER", nullable: true, default: "0" },
      { name: "issue_count", type: "INTEGER", nullable: true, default: "0" },
      { name: "created_at", type: "TIMESTAMP", nullable: false, default: "now()", index: true },
      { name: "updated_at", type: "TIMESTAMP", nullable: false, default: "now()" },
    ],
  },
  {
    name: "project_files",
    description: "Scanned file contents and metadata for each project",
    rowCount: 247,
    indexes: [
      { name: "idx_files_project", columns: ["project_id"], type: "B-Tree" },
      { name: "idx_files_path", columns: ["project_id", "path"], type: "B-Tree (Composite)" },
    ],
    querySuggestions: [
      "SELECT * FROM project_files WHERE project_id = $1 AND language = 'typescript'",
      "SELECT language, COUNT(*) FROM project_files WHERE project_id = $1 GROUP BY language",
      "SELECT * FROM project_files WHERE size > 10000 ORDER BY size DESC LIMIT 10",
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, default: "gen_random_uuid()" },
      { name: "project_id", type: "UUID", nullable: false, foreignKey: { table: "projects", column: "id" }, index: true },
      { name: "path", type: "TEXT", nullable: false, index: true },
      { name: "content", type: "TEXT", nullable: true },
      { name: "language", type: "VARCHAR(50)", nullable: true, index: true },
      { name: "size", type: "INTEGER", nullable: true, default: "0" },
      { name: "last_modified", type: "TIMESTAMP", nullable: true, default: "now()" },
    ],
  },
  {
    name: "project_issues",
    description: "Detected issues and code smells per project",
    rowCount: 11,
    indexes: [
      { name: "idx_issues_project", columns: ["project_id"], type: "B-Tree" },
      { name: "idx_issues_severity", columns: ["severity"], type: "B-Tree" },
    ],
    querySuggestions: [
      "SELECT * FROM project_issues WHERE project_id = $1 AND severity = 'critical'",
      "SELECT severity, COUNT(*) FROM project_issues WHERE project_id = $1 GROUP BY severity",
      "SELECT type, COUNT(*) FROM project_issues WHERE project_id = $1 GROUP BY type ORDER BY COUNT(*) DESC",
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, default: "gen_random_uuid()" },
      { name: "project_id", type: "UUID", nullable: false, foreignKey: { table: "projects", column: "id" }, index: true },
      { name: "type", type: "VARCHAR(100)", nullable: false },
      { name: "severity", type: "VARCHAR(50)", nullable: false, index: true },
      { name: "file_path", type: "TEXT", nullable: true },
      { name: "description", type: "TEXT", nullable: false },
      { name: "line_number", type: "INTEGER", nullable: true },
      { name: "created_at", type: "TIMESTAMP", nullable: false, default: "now()" },
    ],
  },
  {
    name: "chat_messages",
    description: "AI chat conversation history per project",
    rowCount: 28,
    indexes: [
      { name: "idx_chat_project", columns: ["project_id"], type: "B-Tree" },
    ],
    querySuggestions: [
      "SELECT * FROM chat_messages WHERE project_id = $1 ORDER BY created_at DESC LIMIT 50",
      "SELECT role, COUNT(*) FROM chat_messages WHERE project_id = $1 GROUP BY role",
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, default: "gen_random_uuid()" },
      { name: "project_id", type: "UUID", nullable: false, foreignKey: { table: "projects", column: "id" }, index: true },
      { name: "role", type: "VARCHAR(20)", nullable: false },
      { name: "content", type: "TEXT", nullable: false },
      { name: "created_at", type: "TIMESTAMP", nullable: false, default: "now()" },
    ],
  },
  {
    name: "api_endpoints",
    description: "Discovered API endpoints per project",
    rowCount: 12,
    indexes: [
      { name: "idx_endpoints_project", columns: ["project_id"], type: "B-Tree" },
    ],
    querySuggestions: [
      "SELECT * FROM api_endpoints WHERE project_id = $1 AND method = 'GET'",
      "SELECT method, COUNT(*) FROM api_endpoints WHERE project_id = $1 GROUP BY method",
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false, primaryKey: true, default: "gen_random_uuid()" },
      { name: "project_id", type: "UUID", nullable: false, foreignKey: { table: "projects", column: "id" }, index: true },
      { name: "method", type: "VARCHAR(10)", nullable: false },
      { name: "url", type: "TEXT", nullable: false },
      { name: "controller", type: "VARCHAR(255)", nullable: true },
      { name: "middleware", type: "JSONB", nullable: true, default: "[]" },
      { name: "description", type: "TEXT", nullable: true },
      { name: "file_path", type: "TEXT", nullable: true },
    ],
  },
];

const erNodes: Node[] = [
  { id: "er-projects", position: { x: 300, y: 50 }, data: { label: "📋 projects\n──────────\nPK: id\nname\nhealth_score\nstatus" }, type: "default" },
  { id: "er-files", position: { x: 50, y: 280 }, data: { label: "📄 project_files\n──────────\nPK: id\nFK: project_id\npath\nlanguage" }, type: "default" },
  { id: "er-issues", position: { x: 350, y: 280 }, data: { label: "⚠️ project_issues\n──────────\nPK: id\nFK: project_id\ntype\nseverity" }, type: "default" },
  { id: "er-chat", position: { x: 650, y: 280 }, data: { label: "💬 chat_messages\n──────────\nPK: id\nFK: project_id\nrole\ncontent" }, type: "default" },
  { id: "er-api", position: { x: 200, y: 500 }, data: { label: "🔌 api_endpoints\n──────────\nPK: id\nFK: project_id\nmethod\nurl" }, type: "default" },
];

const erEdges: Edge[] = [
  { id: "er-e1", source: "er-projects", target: "er-files", label: "1:N", animated: true },
  { id: "er-e2", source: "er-projects", target: "er-issues", label: "1:N", animated: true },
  { id: "er-e3", source: "er-projects", target: "er-chat", label: "1:N", animated: true },
  { id: "er-e4", source: "er-projects", target: "er-api", label: "1:N", animated: true },
];

type ViewMode = "tables" | "er" | "suggestions";

export default function DatabasePage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [expandedTable, setExpandedTable] = useState<string | null>("projects");
  const [view, setView] = useState<ViewMode>("tables");

  return (
    <div className={view === "er" ? "flex flex-col h-screen" : "p-6 md:p-8 max-w-5xl"}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 ${view === "er" ? "px-6 py-4 border-b border-helios-700/50 bg-helios-900/50" : ""}`}>
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-accent-400" />
          <div>
            <h1 className="text-2xl font-bold">Database Visualizer</h1>
            <p className="text-sm text-helios-400">Tables, ER diagram, indexes, and query suggestions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {([
            { id: "tables" as ViewMode, icon: Table2, label: "Tables" },
            { id: "er" as ViewMode, icon: Network, label: "ER Diagram" },
            { id: "suggestions" as ViewMode, icon: Lightbulb, label: "Queries" },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${view === v.id ? "bg-accent-500/15 text-accent-400 border border-accent-500/20" : "text-helios-400 hover:text-helios-200 hover:bg-helios-700/30"}`}>
              <v.icon className="w-3.5 h-3.5" /> {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "er" ? (
        <div className="flex-1">
          <ReactFlow nodes={erNodes} edges={erEdges} fitView minZoom={0.3} maxZoom={2} style={{ background: "#0a0a0f" }}>
            <Background variant={BackgroundVariant.Dots} color="rgba(108,92,231,0.15)" gap={30} />
            <Controls showInteractive={false} style={{ background: "rgba(26,26,46,0.8)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px" }} />
            <MiniMap style={{ background: "rgba(26,26,46,0.8)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px" }} nodeColor="rgba(108,92,231,0.4)" />
          </ReactFlow>
        </div>
      ) : view === "suggestions" ? (
        <div className="space-y-6">
          {tables.map((table, i) => (
            <motion.div key={table.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass p-6">
              <div className="flex items-center gap-3 mb-4">
                <Table2 className="w-5 h-5 text-accent-400" />
                <h3 className="font-semibold font-mono">{table.name}</h3>
              </div>
              <div className="space-y-3">
                {table.querySuggestions.map((query, qi) => (
                  <div key={qi} className="glass-sm p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">Suggested Query</span>
                    </div>
                    <pre className="text-xs font-mono text-helios-200 whitespace-pre-wrap">{query}</pre>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="glass p-4 text-center"><Table2 className="w-5 h-5 text-accent-400 mx-auto mb-1" /><div className="text-xl font-bold">{tables.length}</div><div className="text-xs text-helios-400">Tables</div></div>
            <div className="glass p-4 text-center"><Key className="w-5 h-5 text-amber-400 mx-auto mb-1" /><div className="text-xl font-bold">{tables.reduce((a, t) => a + t.columns.filter((c) => c.primaryKey).length, 0)}</div><div className="text-xs text-helios-400">Primary Keys</div></div>
            <div className="glass p-4 text-center"><Link2 className="w-5 h-5 text-cyan-400 mx-auto mb-1" /><div className="text-xl font-bold">{tables.reduce((a, t) => a + t.columns.filter((c) => c.foreignKey).length, 0)}</div><div className="text-xs text-helios-400">Foreign Keys</div></div>
            <div className="glass p-4 text-center"><Search className="w-5 h-5 text-emerald-400 mx-auto mb-1" /><div className="text-xl font-bold">{tables.reduce((a, t) => a + t.indexes.length, 0)}</div><div className="text-xs text-helios-400">Indexes</div></div>
          </div>

          {/* Relationships */}
          <div className="glass p-6 mb-6">
            <h3 className="font-semibold mb-4">Relationships</h3>
            <div className="space-y-2">
              {tables.filter((t) => t.columns.some((c) => c.foreignKey)).map((t) =>
                t.columns.filter((c) => c.foreignKey).map((c) => (
                  <div key={`${t.name}-${c.name}`} className="flex items-center gap-3 p-3 glass-sm rounded-lg">
                    <span className="font-mono text-sm text-helios-200">{t.name}</span>
                    <ArrowRight className="w-4 h-4 text-accent-400" />
                    <span className="font-mono text-sm text-cyan-400">{c.foreignKey!.table}</span>
                    <span className="text-xs text-helios-500">({c.name} → {c.foreignKey!.column})</span>
                    <span className="badge badge-cyan text-[10px] ml-auto">1:N · CASCADE</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tables */}
          <div className="space-y-4">
            {tables.map((table, i) => (
              <motion.div key={table.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass overflow-hidden">
                <button onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)} className="w-full flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    {expandedTable === table.name ? <ChevronDown className="w-4 h-4 text-helios-400" /> : <ChevronRight className="w-4 h-4 text-helios-400" />}
                    <Table2 className="w-5 h-5 text-accent-400" />
                    <span className="font-mono font-semibold">{table.name}</span>
                    <span className="text-xs text-helios-500">{table.columns.length} cols</span>
                    {table.rowCount && <span className="badge badge-purple text-[10px]">~{table.rowCount} rows</span>}
                    {table.indexes.length > 0 && <span className="badge badge-cyan text-[10px]">{table.indexes.length} indexes</span>}
                  </div>
                  <span className="text-xs text-helios-500">{table.description}</span>
                </button>
                {expandedTable === table.name && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-helios-700/50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-helios-700/50">
                          <th className="text-left px-5 py-3 text-helios-500 font-medium">Column</th>
                          <th className="text-left px-5 py-3 text-helios-500 font-medium">Type</th>
                          <th className="text-left px-5 py-3 text-helios-500 font-medium">Nullable</th>
                          <th className="text-left px-5 py-3 text-helios-500 font-medium">Keys</th>
                          <th className="text-left px-5 py-3 text-helios-500 font-medium">Default</th>
                        </tr></thead>
                        <tbody>
                          {table.columns.map((col) => (
                            <tr key={col.name} className="border-b border-helios-700/30 hover:bg-helios-700/10">
                              <td className="px-5 py-2.5 font-mono text-helios-200">{col.name}</td>
                              <td className="px-5 py-2.5 font-mono text-accent-400">{col.type}</td>
                              <td className="px-5 py-2.5">{col.nullable ? <span className="text-helios-500">YES</span> : <span className="text-rose-400">NO</span>}</td>
                              <td className="px-5 py-2.5">
                                <div className="flex gap-1 flex-wrap">
                                  {col.primaryKey && <span className="badge badge-amber text-[10px]"><Key className="w-2.5 h-2.5 mr-1" />PK</span>}
                                  {col.foreignKey && <span className="badge badge-cyan text-[10px]"><Link2 className="w-2.5 h-2.5 mr-1" />FK→{col.foreignKey.table}</span>}
                                  {col.index && !col.primaryKey && !col.foreignKey && <span className="badge badge-emerald text-[10px]">IDX</span>}
                                  {col.unique && <span className="badge badge-purple text-[10px]">UNQ</span>}
                                </div>
                              </td>
                              <td className="px-5 py-2.5 font-mono text-xs text-helios-500">{col.default || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Indexes */}
                    {table.indexes.length > 0 && (
                      <div className="px-5 py-4 border-t border-helios-700/50">
                        <h4 className="text-xs uppercase tracking-wider text-helios-500 font-semibold mb-3">Indexes</h4>
                        <div className="flex flex-wrap gap-2">
                          {table.indexes.map((idx) => (
                            <div key={idx.name} className="flex items-center gap-2 px-3 py-2 glass-sm rounded-lg">
                              <Search className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs font-mono text-helios-200">{idx.name}</span>
                              <span className="text-[10px] text-helios-500">({idx.columns.join(", ")})</span>
                              <span className="badge badge-emerald text-[10px]">{idx.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
