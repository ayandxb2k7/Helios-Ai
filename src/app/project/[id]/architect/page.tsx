"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ChevronRight,
  X,
  ArrowRight,
  Layers,
  GitBranch,
  Shield,
  Zap,
  Database,
  Monitor,
  Server,
  Globe,
} from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  BackgroundVariant,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type DiagramMode = "high-level" | "data-flow" | "auth-flow" | "request-lifecycle" | "component-hierarchy";

interface NodeDetail {
  title: string;
  description: string;
  details: string[];
  files: string[];
}

const nodeDetails: Record<string, NodeDetail> = {
  "client": { title: "Client Application", description: "Next.js React application running in the browser", details: ["React 19 with Server Components", "Client-side routing via App Router", "Tailwind CSS for styling", "Framer Motion animations"], files: ["src/app/page.tsx", "src/app/layout.tsx", "src/components/"] },
  "nextjs": { title: "Next.js Server", description: "Server-side rendering and API route handling", details: ["App Router with dynamic routes", "Server Components for SSR", "Middleware for authentication", "Static generation where possible"], files: ["src/app/", "src/middleware.ts"] },
  "middleware": { title: "Auth Middleware", description: "JWT verification layer for protected routes", details: ["Validates JWT from httpOnly cookies", "Redirects unauthenticated users", "Passes user context to handlers", "Excludes public routes"], files: ["src/middleware.ts"] },
  "api": { title: "API Layer", description: "RESTful API endpoints following Next.js conventions", details: ["12 API endpoints discovered", "REST conventions (GET, POST, PUT, DELETE)", "Request validation via Zod schemas", "Error handling middleware"], files: ["src/app/api/"] },
  "auth-service": { title: "Authentication Service", description: "JWT-based authentication with cookie storage", details: ["Password hashing with bcrypt", "JWT signed with HS256", "7-day token expiration", "httpOnly cookie storage"], files: ["src/lib/auth.ts"] },
  "orm": { title: "Drizzle ORM", description: "Type-safe database query builder for PostgreSQL", details: ["Schema-first approach", "Type-safe queries", "Migration support", "Relations defined declaratively"], files: ["src/db/schema.ts", "src/db/index.ts"] },
  "postgres": { title: "PostgreSQL", description: "Primary relational database", details: ["5 tables with proper indexing", "Foreign key relationships", "Cascade deletes configured", "JSONB for flexible data"], files: ["src/db/schema.ts"] },
  "components": { title: "React Components", description: "Reusable UI component library", details: ["34 components discovered", "Composition pattern", "Client/Server split", "Shared UI primitives"], files: ["src/components/"] },
  "hooks": { title: "Custom Hooks", description: "Shared stateful logic", details: ["useAuth - authentication state", "useDebounce - input optimization", "useLocalStorage - persistence"], files: ["src/hooks/"] },
};

const highLevelNodes: Node[] = [
  { id: "client", position: { x: 350, y: 30 }, data: { label: "🖥️ Client (React)" }, type: "default" },
  { id: "nextjs", position: { x: 350, y: 160 }, data: { label: "⚡ Next.js Server" }, type: "default" },
  { id: "middleware", position: { x: 100, y: 310 }, data: { label: "🔐 Auth Middleware" }, type: "default" },
  { id: "api", position: { x: 350, y: 310 }, data: { label: "🔌 API Routes" }, type: "default" },
  { id: "auth-service", position: { x: 600, y: 310 }, data: { label: "🔑 Auth Service" }, type: "default" },
  { id: "orm", position: { x: 350, y: 460 }, data: { label: "📦 Drizzle ORM" }, type: "default" },
  { id: "postgres", position: { x: 350, y: 600 }, data: { label: "🐘 PostgreSQL" }, type: "default" },
];

const highLevelEdges: Edge[] = [
  { id: "e1", source: "client", target: "nextjs", animated: true, label: "HTTP" },
  { id: "e2", source: "nextjs", target: "middleware", label: "protects" },
  { id: "e3", source: "nextjs", target: "api", label: "routes" },
  { id: "e4", source: "api", target: "auth-service", label: "validates" },
  { id: "e5", source: "middleware", target: "auth-service", label: "verifies" },
  { id: "e6", source: "api", target: "orm", animated: true, label: "queries" },
  { id: "e7", source: "orm", target: "postgres", animated: true, label: "SQL" },
];

const dataFlowNodes: Node[] = [
  { id: "df1", position: { x: 300, y: 30 }, data: { label: "User Input" }, type: "default" },
  { id: "df2", position: { x: 300, y: 140 }, data: { label: "Form Validation" }, type: "default" },
  { id: "df3", position: { x: 300, y: 250 }, data: { label: "API Request" }, type: "default" },
  { id: "df4", position: { x: 100, y: 370 }, data: { label: "Auth Check" }, type: "default" },
  { id: "df5", position: { x: 500, y: 370 }, data: { label: "Input Validation" }, type: "default" },
  { id: "df6", position: { x: 300, y: 490 }, data: { label: "Business Logic" }, type: "default" },
  { id: "df7", position: { x: 300, y: 600 }, data: { label: "Database Query" }, type: "default" },
  { id: "df8", position: { x: 300, y: 710 }, data: { label: "Response" }, type: "default" },
];

const dataFlowEdges: Edge[] = [
  { id: "de1", source: "df1", target: "df2", animated: true },
  { id: "de2", source: "df2", target: "df3" },
  { id: "de3", source: "df3", target: "df4", label: "token" },
  { id: "de4", source: "df3", target: "df5", label: "body" },
  { id: "de5", source: "df4", target: "df6" },
  { id: "de6", source: "df5", target: "df6" },
  { id: "de7", source: "df6", target: "df7", animated: true },
  { id: "de8", source: "df7", target: "df8" },
];

const authFlowNodes: Node[] = [
  { id: "af1", position: { x: 300, y: 30 }, data: { label: "Login Page" }, type: "default" },
  { id: "af2", position: { x: 300, y: 140 }, data: { label: "POST /api/auth" }, type: "default" },
  { id: "af3", position: { x: 100, y: 260 }, data: { label: "Validate Credentials" }, type: "default" },
  { id: "af4", position: { x: 500, y: 260 }, data: { label: "Return Error" }, type: "default" },
  { id: "af5", position: { x: 100, y: 380 }, data: { label: "Generate JWT" }, type: "default" },
  { id: "af6", position: { x: 100, y: 500 }, data: { label: "Set Cookie (httpOnly)" }, type: "default" },
  { id: "af7", position: { x: 300, y: 610 }, data: { label: "Middleware Verification" }, type: "default" },
  { id: "af8", position: { x: 300, y: 720 }, data: { label: "Protected Route Access" }, type: "default" },
];

const authFlowEdges: Edge[] = [
  { id: "ae1", source: "af1", target: "af2", animated: true },
  { id: "ae2", source: "af2", target: "af3", label: "valid" },
  { id: "ae3", source: "af2", target: "af4", label: "invalid" },
  { id: "ae4", source: "af3", target: "af5" },
  { id: "ae5", source: "af5", target: "af6" },
  { id: "ae6", source: "af6", target: "af7" },
  { id: "ae7", source: "af7", target: "af8", animated: true },
];

const requestNodes: Node[] = [
  { id: "rl1", position: { x: 300, y: 30 }, data: { label: "Incoming Request" }, type: "default" },
  { id: "rl2", position: { x: 300, y: 130 }, data: { label: "Next.js Router" }, type: "default" },
  { id: "rl3", position: { x: 100, y: 240 }, data: { label: "Middleware Chain" }, type: "default" },
  { id: "rl4", position: { x: 500, y: 240 }, data: { label: "Static Asset" }, type: "default" },
  { id: "rl5", position: { x: 100, y: 360 }, data: { label: "Route Handler" }, type: "default" },
  { id: "rl6", position: { x: 100, y: 470 }, data: { label: "Service Layer" }, type: "default" },
  { id: "rl7", position: { x: 100, y: 580 }, data: { label: "Database" }, type: "default" },
  { id: "rl8", position: { x: 300, y: 690 }, data: { label: "JSON Response" }, type: "default" },
];

const requestEdges: Edge[] = [
  { id: "re1", source: "rl1", target: "rl2", animated: true },
  { id: "re2", source: "rl2", target: "rl3", label: "dynamic" },
  { id: "re3", source: "rl2", target: "rl4", label: "static" },
  { id: "re4", source: "rl3", target: "rl5" },
  { id: "re5", source: "rl5", target: "rl6" },
  { id: "re6", source: "rl6", target: "rl7", animated: true },
  { id: "re7", source: "rl7", target: "rl8" },
];

const componentNodes: Node[] = [
  { id: "ch1", position: { x: 350, y: 30 }, data: { label: "RootLayout" }, type: "default" },
  { id: "ch2", position: { x: 150, y: 150 }, data: { label: "HomePage" }, type: "default" },
  { id: "ch3", position: { x: 550, y: 150 }, data: { label: "DashboardPage" }, type: "default" },
  { id: "ch4", position: { x: 150, y: 280 }, data: { label: "FeatureCard" }, type: "default" },
  { id: "ch5", position: { x: 450, y: 280 }, data: { label: "ScoreRing" }, type: "default" },
  { id: "ch6", position: { x: 650, y: 280 }, data: { label: "Chart" }, type: "default" },
  { id: "ch7", position: { x: 350, y: 280 }, data: { label: "Button" }, type: "default" },
  { id: "ch8", position: { x: 550, y: 400 }, data: { label: "Card" }, type: "default" },
];

const componentEdges: Edge[] = [
  { id: "ce1", source: "ch1", target: "ch2" },
  { id: "ce2", source: "ch1", target: "ch3" },
  { id: "ce3", source: "ch2", target: "ch4" },
  { id: "ce4", source: "ch3", target: "ch5" },
  { id: "ce5", source: "ch3", target: "ch6" },
  { id: "ce6", source: "ch4", target: "ch7" },
  { id: "ce7", source: "ch3", target: "ch8" },
  { id: "ce8", source: "ch8", target: "ch7" },
];

const diagrams: Record<DiagramMode, { nodes: Node[]; edges: Edge[]; label: string; icon: React.ElementType }> = {
  "high-level": { nodes: highLevelNodes, edges: highLevelEdges, label: "High-Level Architecture", icon: Layers },
  "data-flow": { nodes: dataFlowNodes, edges: dataFlowEdges, label: "Data Flow", icon: GitBranch },
  "auth-flow": { nodes: authFlowNodes, edges: authFlowEdges, label: "Authentication Flow", icon: Shield },
  "request-lifecycle": { nodes: requestNodes, edges: requestEdges, label: "Request Lifecycle", icon: Zap },
  "component-hierarchy": { nodes: componentNodes, edges: componentEdges, label: "Component Hierarchy", icon: Monitor },
};

export default function ArchitectPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [mode, setMode] = useState<DiagramMode>("high-level");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const currentDiagram = diagrams[mode];
  const detail = selectedNode ? nodeDetails[selectedNode] : null;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-helios-700/50 bg-helios-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-accent-400" />
          <div>
            <h2 className="font-semibold text-sm">AI Architect</h2>
            <p className="text-xs text-helios-500">Interactive architecture analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(diagrams).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setMode(key as DiagramMode); setSelectedNode(null); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                mode === key
                  ? "bg-accent-500/15 text-accent-400 border border-accent-500/20"
                  : "text-helios-400 hover:text-helios-200 hover:bg-helios-700/30"
              }`}
            >
              <val.icon className="w-3.5 h-3.5" /> {val.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Diagram */}
        <div className="flex-1" key={mode}>
          <ReactFlow
            nodes={currentDiagram.nodes}
            edges={currentDiagram.edges}
            fitView
            minZoom={0.3}
            maxZoom={2}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
            style={{ background: "#0a0a0f" }}
          >
            <Background variant={BackgroundVariant.Dots} color="rgba(108,92,231,0.15)" gap={30} />
            <Controls showInteractive={false} style={{ background: "rgba(26,26,46,0.8)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px" }} />
            <MiniMap style={{ background: "rgba(26,26,46,0.8)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "12px" }} nodeColor="rgba(108,92,231,0.4)" />
          </ReactFlow>
        </div>

        {/* Node Detail Panel */}
        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-0 top-0 bottom-0 w-96 bg-helios-900/95 backdrop-blur-xl border-l border-helios-700/50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">{detail.title}</h3>
                <button onClick={() => setSelectedNode(null)} className="p-1.5 hover:bg-helios-700/50 rounded-lg">
                  <X className="w-4 h-4 text-helios-400" />
                </button>
              </div>

              <p className="text-sm text-helios-400 mb-6">{detail.description}</p>

              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-helios-500 font-semibold mb-3">Key Characteristics</h4>
                <div className="space-y-2">
                  {detail.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 glass-sm rounded-lg">
                      <div className="w-5 h-5 rounded-md bg-accent-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <ChevronRight className="w-3 h-3 text-accent-400" />
                      </div>
                      <span className="text-sm text-helios-300">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-helios-500 font-semibold mb-3">Related Files</h4>
                <div className="space-y-2">
                  {detail.files.map((f) => (
                    <div key={f} className="flex items-center gap-2 p-2.5 glass-sm rounded-lg">
                      <Globe className="w-3.5 h-3.5 text-accent-400" />
                      <span className="text-sm font-mono text-helios-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 glass-sm rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-accent-400" />
                  <span className="text-xs font-semibold text-accent-400">AI Insight</span>
                </div>
                <p className="text-sm text-helios-300">
                  This module follows the {detail.title.includes("Auth") ? "stateless authentication pattern using JWT, which scales well but requires careful secret management" : detail.title.includes("ORM") ? "schema-first ORM pattern which provides type safety but consider adding migration versioning" : "standard Next.js convention with clear separation of concerns"}. 
                  {detail.title.includes("Client") && " Consider implementing error boundaries for better resilience."}
                  {detail.title.includes("Middleware") && " Add rate limiting to prevent brute force attacks on auth endpoints."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
