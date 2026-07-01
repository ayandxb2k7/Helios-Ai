"use client";

import { use, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Waypoints,
  Search,
  FileCode2,
  FunctionSquare,
  Database,
  Route,
  Box,
  GitBranch,
  Filter,
  X,
  ChevronRight,
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

type GraphFilter = "all" | "functions" | "files" | "apis" | "components" | "tables";

const graphNodes: Node[] = [
  // Files
  { id: "f:auth", position: { x: 200, y: 50 }, data: { label: "📄 auth.ts" }, type: "default" },
  { id: "f:users-route", position: { x: 500, y: 50 }, data: { label: "📄 users/route.ts" }, type: "default" },
  { id: "f:auth-route", position: { x: 50, y: 200 }, data: { label: "📄 api/auth/route.ts" }, type: "default" },
  { id: "f:schema", position: { x: 350, y: 350 }, data: { label: "📄 schema.ts" }, type: "default" },
  { id: "f:middleware", position: { x: 50, y: 350 }, data: { label: "📄 middleware.ts" }, type: "default" },
  { id: "f:dashboard", position: { x: 650, y: 200 }, data: { label: "📄 dashboard/page.tsx" }, type: "default" },
  { id: "f:button", position: { x: 850, y: 350 }, data: { label: "📄 Button.tsx" }, type: "default" },
  { id: "f:card", position: { x: 650, y: 400 }, data: { label: "📄 Card.tsx" }, type: "default" },
  { id: "f:db", position: { x: 350, y: 500 }, data: { label: "📄 db/index.ts" }, type: "default" },
  { id: "f:utils", position: { x: 550, y: 350 }, data: { label: "📄 utils.ts" }, type: "default" },
  // Functions
  { id: "fn:getCurrentUser", position: { x: 100, y: 80 }, data: { label: "⚡ getCurrentUser()" }, type: "default" },
  { id: "fn:generateToken", position: { x: 300, y: 150 }, data: { label: "⚡ generateToken()" }, type: "default" },
  { id: "fn:GET", position: { x: 520, y: 150 }, data: { label: "⚡ GET /api/users" }, type: "default" },
  { id: "fn:POST", position: { x: 700, y: 100 }, data: { label: "⚡ POST /api/users" }, type: "default" },
  // Components
  { id: "c:DashboardPage", position: { x: 700, y: 250 }, data: { label: "🧩 DashboardPage" }, type: "default" },
  { id: "c:Button", position: { x: 900, y: 400 }, data: { label: "🧩 Button" }, type: "default" },
  { id: "c:Card", position: { x: 700, y: 450 }, data: { label: "🧩 Card" }, type: "default" },
  // Database tables
  { id: "t:users", position: { x: 200, y: 500 }, data: { label: "🗄️ users" }, type: "default" },
  { id: "t:projects", position: { x: 450, y: 550 }, data: { label: "🗄️ projects" }, type: "default" },
  // APIs
  { id: "api:auth", position: { x: 50, y: 250 }, data: { label: "🔌 POST /api/auth" }, type: "default" },
  { id: "api:users", position: { x: 500, y: 250 }, data: { label: "🔌 GET /api/users" }, type: "default" },
];

const graphEdges: Edge[] = [
  // File → function
  { id: "e1", source: "f:auth", target: "fn:getCurrentUser", label: "defines" },
  { id: "e2", source: "f:auth", target: "fn:generateToken", label: "defines" },
  { id: "e3", source: "f:users-route", target: "fn:GET", label: "defines" },
  { id: "e4", source: "f:users-route", target: "fn:POST", label: "defines" },
  // File → imports
  { id: "e5", source: "f:auth-route", target: "f:auth", label: "imports", animated: true },
  { id: "e6", source: "f:users-route", target: "f:auth", label: "imports", animated: true },
  { id: "e7", source: "f:users-route", target: "f:schema", label: "imports" },
  { id: "e8", source: "f:middleware", target: "f:auth", label: "imports" },
  { id: "e9", source: "f:dashboard", target: "f:utils", label: "imports" },
  { id: "e10", source: "f:dashboard", target: "c:Card", label: "uses" },
  { id: "e11", source: "c:Card", target: "c:Button", label: "uses" },
  // Function → table
  { id: "e12", source: "fn:GET", target: "t:users", label: "queries", animated: true },
  { id: "e13", source: "fn:getCurrentUser", target: "t:users", label: "queries" },
  // Schema → table
  { id: "e14", source: "f:schema", target: "t:users", label: "defines" },
  { id: "e15", source: "f:schema", target: "t:projects", label: "defines" },
  // DB connection
  { id: "e16", source: "f:db", target: "f:schema", label: "loads" },
  // API → function
  { id: "e17", source: "api:auth", target: "fn:generateToken", label: "calls" },
  { id: "e18", source: "api:users", target: "fn:GET", label: "calls" },
  // Route → API
  { id: "e19", source: "f:auth-route", target: "api:auth", label: "exposes" },
  { id: "e20", source: "f:users-route", target: "api:users", label: "exposes" },
  // Component → file
  { id: "e21", source: "c:DashboardPage", target: "f:dashboard", label: "renders" },
];

const nodeDetails: Record<string, { type: string; description: string; connections: number }> = {
  "f:auth": { type: "File", description: "Authentication utility module", connections: 6 },
  "f:users-route": { type: "File", description: "User API route handlers", connections: 5 },
  "f:auth-route": { type: "File", description: "Authentication API endpoint", connections: 3 },
  "f:schema": { type: "File", description: "Database schema definitions", connections: 4 },
  "fn:getCurrentUser": { type: "Function", description: "Retrieves current user from JWT token", connections: 3 },
  "fn:generateToken": { type: "Function", description: "Generates JWT token for authenticated users", connections: 2 },
  "c:DashboardPage": { type: "Component", description: "Main dashboard page component", connections: 3 },
  "t:users": { type: "Table", description: "User accounts table", connections: 3 },
};

export default function KnowledgeGraphPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<GraphFilter>("all");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const detail = selectedNode ? nodeDetails[selectedNode] : null;

  const filteredNodes = graphNodes.filter((n) => {
    if (search && !String(n.data.label).toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "functions" && !n.id.startsWith("fn:")) return false;
    if (filter === "files" && !n.id.startsWith("f:")) return false;
    if (filter === "apis" && !n.id.startsWith("api:")) return false;
    if (filter === "components" && !n.id.startsWith("c:")) return false;
    if (filter === "tables" && !n.id.startsWith("t:")) return false;
    return true;
  });

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = graphEdges.filter((e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));

  const filters: { id: GraphFilter; label: string; icon: React.ElementType }[] = [
    { id: "all", label: "All", icon: Waypoints },
    { id: "functions", label: "Functions", icon: FunctionSquare },
    { id: "files", label: "Files", icon: FileCode2 },
    { id: "apis", label: "APIs", icon: Route },
    { id: "components", label: "Components", icon: Box },
    { id: "tables", label: "Tables", icon: Database },
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-6 py-3 border-b border-helios-700/50 bg-helios-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Waypoints className="w-5 h-5 text-accent-400" />
          <div>
            <h2 className="font-semibold text-sm">Knowledge Graph</h2>
            <p className="text-[10px] text-helios-500">{graphNodes.length} nodes · {graphEdges.length} edges</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-helios-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search nodes..." className="pl-9 pr-3 py-1.5 bg-helios-800/60 border border-helios-600/50 rounded-lg text-xs text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50 w-48" />
          </div>
          <div className="flex gap-1">
            {filters.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${filter === f.id ? "bg-accent-500/15 text-accent-400 border border-accent-500/20" : "text-helios-400 hover:text-helios-200 hover:bg-helios-700/30"}`}>
                <f.icon className="w-3 h-3" />{f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          fitView
          minZoom={0.2}
          maxZoom={3}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          style={{ background: "#0a0a0f" }}
        >
          <Background variant={BackgroundVariant.Dots} color="rgba(108,92,231,0.12)" gap={25} />
          <Controls showInteractive={false} style={{ background: "rgba(26,26,46,0.8)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px" }} />
          <MiniMap style={{ background: "rgba(26,26,46,0.8)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px" }} nodeColor="rgba(108,92,231,0.4)" />
        </ReactFlow>

        {/* Detail Panel */}
        <AnimatePresence>
          {detail && (
            <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} className="absolute right-4 top-4 w-72 glass p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-purple">{detail.type}</span>
                <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-helios-700/50 rounded-lg"><X className="w-3.5 h-3.5 text-helios-400" /></button>
              </div>
              <p className="text-sm text-helios-300 mb-3">{detail.description}</p>
              <div className="flex items-center gap-2 text-xs text-helios-500">
                <GitBranch className="w-3 h-3" />{detail.connections} connections
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
