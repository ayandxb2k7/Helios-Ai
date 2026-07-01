"use client";

import { use, useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Network,
  GitBranch,
  Database,
  Route,
  Maximize2,
  Layers,
} from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 400, y: 50 },
    data: { label: "🖥️ Next.js App" },
    type: "default",
  },
  {
    id: "2",
    position: { x: 150, y: 180 },
    data: { label: "📄 Pages & Layouts" },
    type: "default",
  },
  {
    id: "3",
    position: { x: 650, y: 180 },
    data: { label: "🧩 Components" },
    type: "default",
  },
  {
    id: "4",
    position: { x: 150, y: 320 },
    data: { label: "🔌 API Routes" },
    type: "default",
  },
  {
    id: "5",
    position: { x: 650, y: 320 },
    data: { label: "📚 Libraries" },
    type: "default",
  },
  {
    id: "6",
    position: { x: 400, y: 420 },
    data: { label: "🗄️ Drizzle ORM" },
    type: "default",
  },
  {
    id: "7",
    position: { x: 400, y: 550 },
    data: { label: "🐘 PostgreSQL" },
    type: "default",
  },
  {
    id: "8",
    position: { x: 100, y: 450 },
    data: { label: "🔐 Auth (JWT)" },
    type: "default",
  },
  {
    id: "9",
    position: { x: 700, y: 450 },
    data: { label: "⚙️ Middleware" },
    type: "default",
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-5", source: "3", target: "5" },
  { id: "e4-6", source: "4", target: "6" },
  { id: "e5-6", source: "5", target: "6" },
  { id: "e6-7", source: "6", target: "7", animated: true },
  { id: "e4-8", source: "4", target: "8" },
  { id: "e8-9", source: "8", target: "9" },
  { id: "e9-2", source: "9", target: "2" },
];

const apiFlowNodes: Node[] = [
  { id: "a1", position: { x: 350, y: 30 }, data: { label: "Client" }, type: "default" },
  { id: "a2", position: { x: 350, y: 150 }, data: { label: "Middleware (Auth)" }, type: "default" },
  { id: "a3", position: { x: 100, y: 280 }, data: { label: "POST /api/auth" }, type: "default" },
  { id: "a4", position: { x: 350, y: 280 }, data: { label: "GET /api/users" }, type: "default" },
  { id: "a5", position: { x: 600, y: 280 }, data: { label: "GET /api/health" }, type: "default" },
  { id: "a6", position: { x: 100, y: 410 }, data: { label: "JWT Service" }, type: "default" },
  { id: "a7", position: { x: 350, y: 410 }, data: { label: "User Service" }, type: "default" },
  { id: "a8", position: { x: 350, y: 530 }, data: { label: "Database" }, type: "default" },
];

const apiFlowEdges: Edge[] = [
  { id: "ea1-2", source: "a1", target: "a2", animated: true },
  { id: "ea2-3", source: "a2", target: "a3" },
  { id: "ea2-4", source: "a2", target: "a4" },
  { id: "ea1-5", source: "a1", target: "a5" },
  { id: "ea3-6", source: "a3", target: "a6" },
  { id: "ea4-7", source: "a4", target: "a7" },
  { id: "ea6-8", source: "a6", target: "a8" },
  { id: "ea7-8", source: "a7", target: "a8" },
];

const erNodes: Node[] = [
  { id: "er1", position: { x: 100, y: 80 }, data: { label: "users\n— id (UUID)\n— name (VARCHAR)\n— email (VARCHAR)\n— role (VARCHAR)" }, type: "default" },
  { id: "er2", position: { x: 500, y: 80 }, data: { label: "projects\n— id (UUID)\n— name (VARCHAR)\n— description (TEXT)\n— owner_id (FK)" }, type: "default" },
  { id: "er3", position: { x: 100, y: 320 }, data: { label: "project_files\n— id (UUID)\n— project_id (FK)\n— path (TEXT)\n— content (TEXT)" }, type: "default" },
  { id: "er4", position: { x: 500, y: 320 }, data: { label: "project_issues\n— id (UUID)\n— project_id (FK)\n— type (VARCHAR)\n— severity (VARCHAR)" }, type: "default" },
];

const erEdges: Edge[] = [
  { id: "eer1-2", source: "er1", target: "er2", label: "1:N" },
  { id: "eer2-3", source: "er2", target: "er3", label: "1:N" },
  { id: "eer2-4", source: "er2", target: "er4", label: "1:N" },
];

type ViewMode = "dependency" | "api" | "er";

export default function ArchitecturePage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [viewMode, setViewMode] = useState<ViewMode>("dependency");

  const getNodes = useCallback((): Node[] => {
    switch (viewMode) {
      case "api": return apiFlowNodes;
      case "er": return erNodes;
      default: return initialNodes;
    }
  }, [viewMode]);

  const getEdges = useCallback((): Edge[] => {
    switch (viewMode) {
      case "api": return apiFlowEdges;
      case "er": return erEdges;
      default: return initialEdges;
    }
  }, [viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(getNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getEdges());

  const switchView = (mode: ViewMode) => {
    setViewMode(mode);
    setNodes(getNodes());
    setEdges(getEdges());
  };

  // We need to handle view mode switch properly
  // Since useNodesState/useEdgesState are hooks, let's use key to re-mount

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-helios-700/50 bg-helios-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Network className="w-5 h-5 text-accent-400" />
          <h2 className="font-semibold">Architecture</h2>
        </div>
        <div className="flex items-center gap-2">
          {[
            { id: "dependency" as ViewMode, icon: GitBranch, label: "Dependencies" },
            { id: "api" as ViewMode, icon: Route, label: "API Flow" },
            { id: "er" as ViewMode, icon: Database, label: "ER Diagram" },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => switchView(view.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                viewMode === view.id
                  ? "bg-accent-500/15 text-accent-400 border border-accent-500/20"
                  : "text-helios-400 hover:text-helios-200 hover:bg-helios-700/30"
              }`}
            >
              <view.icon className="w-4 h-4" /> {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1" key={viewMode}>
        <ReactFlow
          nodes={viewMode === "dependency" ? initialNodes : viewMode === "api" ? apiFlowNodes : erNodes}
          edges={viewMode === "dependency" ? initialEdges : viewMode === "api" ? apiFlowEdges : erEdges}
          fitView
          minZoom={0.3}
          maxZoom={2}
          style={{ background: "#0a0a0f" }}
        >
          <Background variant={BackgroundVariant.Dots} color="rgba(108,92,231,0.15)" gap={30} />
          <Controls
            showInteractive={false}
            style={{
              background: "rgba(26,26,46,0.8)",
              border: "1px solid rgba(108,92,231,0.2)",
              borderRadius: "12px",
            }}
          />
          <MiniMap
            style={{
              background: "rgba(26,26,46,0.8)",
              border: "1px solid rgba(108,92,231,0.2)",
              borderRadius: "12px",
            }}
            nodeColor="rgba(108,92,231,0.4)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
