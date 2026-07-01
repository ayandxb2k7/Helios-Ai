"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Route,
  Search,
  FileCode2,
  ArrowUpRight,
  Globe,
  Webhook,
  Radio,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  controller: string;
  middleware: string[];
  description: string;
  filePath: string;
  protocol: "REST" | "GraphQL" | "WebSocket" | "gRPC";
  auth: "none" | "jwt" | "api-key" | "oauth";
  requestExample?: string;
  responseExample?: string;
  validation?: string[];
}

const endpoints: ApiEndpoint[] = [
  { id: "1", method: "POST", url: "/api/auth", controller: "AuthController", middleware: ["rateLimiter"], description: "Authenticate user with email/password and return JWT token", filePath: "src/app/api/auth/route.ts", protocol: "REST", auth: "none", requestExample: '{\n  "email": "user@example.com",\n  "password": "secure-password"\n}', responseExample: '{\n  "user": {\n    "id": "uuid",\n    "name": "John Doe",\n    "email": "user@example.com",\n    "role": "user"\n  }\n}', validation: ["email: required, valid format", "password: required, min 8 chars"] },
  { id: "2", method: "GET", url: "/api/users", controller: "UserController", middleware: ["auth", "rateLimiter"], description: "Get all users with pagination support", filePath: "src/app/api/users/route.ts", protocol: "REST", auth: "jwt", responseExample: '[\n  {\n    "id": "uuid",\n    "name": "John Doe",\n    "email": "john@example.com",\n    "role": "user"\n  }\n]', validation: ["page: optional, integer", "limit: optional, max 100"] },
  { id: "3", method: "POST", url: "/api/users", controller: "UserController", middleware: ["auth", "validate"], description: "Create a new user account", filePath: "src/app/api/users/route.ts", protocol: "REST", auth: "jwt", requestExample: '{\n  "name": "Jane Doe",\n  "email": "jane@example.com",\n  "password": "secure-password"\n}', responseExample: '{\n  "id": "uuid",\n  "name": "Jane Doe",\n  "email": "jane@example.com",\n  "role": "user"\n}', validation: ["name: required, 1-255 chars", "email: required, valid format, unique", "password: required, min 8 chars"] },
  { id: "4", method: "GET", url: "/api/users/:id", controller: "UserController", middleware: ["auth"], description: "Get a specific user by ID", filePath: "src/app/api/users/[id]/route.ts", protocol: "REST", auth: "jwt", validation: ["id: required, valid UUID"] },
  { id: "5", method: "PUT", url: "/api/users/:id", controller: "UserController", middleware: ["auth", "validate"], description: "Update user information", filePath: "src/app/api/users/[id]/route.ts", protocol: "REST", auth: "jwt", validation: ["id: required, valid UUID", "name: optional, 1-255 chars", "email: optional, valid format"] },
  { id: "6", method: "DELETE", url: "/api/users/:id", controller: "UserController", middleware: ["auth", "adminOnly"], description: "Delete a user account (admin only)", filePath: "src/app/api/users/[id]/route.ts", protocol: "REST", auth: "jwt", validation: ["id: required, valid UUID"] },
  { id: "7", method: "GET", url: "/api/projects", controller: "ProjectController", middleware: ["auth"], description: "List all projects for authenticated user", filePath: "src/app/api/projects/route.ts", protocol: "REST", auth: "jwt" },
  { id: "8", method: "POST", url: "/api/projects", controller: "ProjectController", middleware: ["auth", "validate"], description: "Create a new project", filePath: "src/app/api/projects/route.ts", protocol: "REST", auth: "jwt", requestExample: '{\n  "name": "My Project",\n  "description": "A new project",\n  "repoUrl": "https://github.com/owner/repo"\n}', validation: ["name: required, 1-255 chars", "repoUrl: optional, valid URL"] },
  { id: "9", method: "GET", url: "/api/projects/:id", controller: "ProjectController", middleware: ["auth"], description: "Get project details by ID", filePath: "src/app/api/projects/[id]/route.ts", protocol: "REST", auth: "jwt" },
  { id: "10", method: "DELETE", url: "/api/projects/:id", controller: "ProjectController", middleware: ["auth"], description: "Delete a project and all associated data", filePath: "src/app/api/projects/[id]/route.ts", protocol: "REST", auth: "jwt" },
  { id: "11", method: "GET", url: "/api/health", controller: "HealthController", middleware: [], description: "Health check endpoint returning system status", filePath: "src/app/api/health/route.ts", protocol: "REST", auth: "none", responseExample: '{\n  "status": "ok",\n  "timestamp": "2024-01-15T10:30:00Z"\n}' },
  { id: "12", method: "GET", url: "/api/admin/stats", controller: "AdminController", middleware: ["auth", "adminOnly"], description: "Get system-wide admin statistics", filePath: "src/app/api/admin/stats/route.ts", protocol: "REST", auth: "jwt" },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  POST: "bg-accent-500/15 text-accent-400 border-accent-500/20",
  PUT: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  DELETE: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  PATCH: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
};

const authIcons: Record<string, React.ElementType> = { none: Globe, jwt: Shield, "api-key": Key, oauth: Shield };
const authLabels: Record<string, string> = { none: "No Auth", jwt: "JWT Bearer", "api-key": "API Key", oauth: "OAuth 2.0" };
const protocolIcons: Record<string, React.ElementType> = { REST: Route, GraphQL: Webhook, WebSocket: Radio, gRPC: Webhook };

function Key(props: React.SVGProps<SVGSVGElement>) { return <Shield {...props} />; }

export default function ApiExplorerPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);

  const filtered = endpoints.filter((ep) => {
    if (methodFilter !== "all" && ep.method !== methodFilter) return false;
    if (search && !ep.url.toLowerCase().includes(search.toLowerCase()) && !ep.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const methodCounts = { GET: endpoints.filter((e) => e.method === "GET").length, POST: endpoints.filter((e) => e.method === "POST").length, PUT: endpoints.filter((e) => e.method === "PUT").length, DELETE: endpoints.filter((e) => e.method === "DELETE").length };
  const protocols = [...new Set(endpoints.map((e) => e.protocol))];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Route className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">API Inspector</h1>
        </div>
        <p className="text-helios-400">Auto-discovered API endpoints with request/response details.</p>
      </motion.div>

      {/* Protocol Detection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-3 mb-6">
        {protocols.map((p) => {
          const Icon = protocolIcons[p] || Route;
          return (
            <div key={p} className="flex items-center gap-2 px-4 py-2 glass-sm rounded-xl">
              <Icon className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium">{p}</span>
              <span className="text-xs text-helios-500">({endpoints.filter((e) => e.protocol === p).length})</span>
            </div>
          );
        })}
      </motion.div>

      {/* Method Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 mb-6">
        {Object.entries(methodCounts).map(([method, count]) => (
          <button key={method} onClick={() => setMethodFilter(methodFilter === method ? "all" : method)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono transition-all ${methodFilter === method ? methodColors[method] + " border" : "glass glass-hover"}`}>
            <span className={methodFilter !== method ? methodColors[method].split(" ")[1] : ""}>{method}</span>
            <span className="text-helios-500">{count}</span>
          </button>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-helios-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search endpoints..." className="w-full pl-11 pr-4 py-3 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50" />
        </div>
      </motion.div>

      {/* Endpoints */}
      <div className="space-y-3">
        {filtered.map((ep, i) => (
          <motion.div key={ep.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.03 }} className="glass p-5 cursor-pointer glass-hover" onClick={() => setSelectedEndpoint(selectedEndpoint?.id === ep.id ? null : ep)}>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border ${methodColors[ep.method]}`}>{ep.method}</span>
              <span className="font-mono text-sm text-helios-200 flex-1">{ep.url}</span>
              <span className={`badge text-[10px] ${ep.auth === "none" ? "badge-emerald" : ep.auth === "jwt" ? "badge-amber" : "badge-rose"}`}>{authLabels[ep.auth]}</span>
              <ArrowUpRight className="w-4 h-4 text-helios-500" />
            </div>
            <p className="text-sm text-helios-400 mt-2 ml-[88px]">{ep.description}</p>

            {selectedEndpoint?.id === ep.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-helios-700/50 ml-[88px] space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><div className="text-helios-500 mb-1">Controller</div><div className="text-helios-200 font-mono">{ep.controller}</div></div>
                  <div><div className="text-helios-500 mb-1">Authentication</div><div className="flex items-center gap-2"><Shield className="w-3 h-3 text-amber-400" /><span className="text-helios-200">{authLabels[ep.auth]}</span></div></div>
                  <div><div className="text-helios-500 mb-1">File Path</div><div className="text-helios-200 font-mono flex items-center gap-2"><FileCode2 className="w-3 h-3" /> {ep.filePath}</div></div>
                  <div><div className="text-helios-500 mb-1">Protocol</div><div className="text-helios-200 flex items-center gap-2"><Globe className="w-3 h-3 text-accent-400" />{ep.protocol}</div></div>
                </div>

                <div><div className="text-helios-500 mb-2">Middleware</div><div className="flex gap-2 flex-wrap">{ep.middleware.length > 0 ? ep.middleware.map((m) => <span key={m} className="badge badge-cyan">{m}</span>) : <span className="text-helios-500 text-xs">None</span>}</div></div>

                {ep.validation && ep.validation.length > 0 && (
                  <div><div className="text-helios-500 mb-2">Validation Rules</div><div className="space-y-1">{ep.validation.map((v, vi) => <div key={vi} className="flex items-center gap-2 text-xs"><CheckCircle2 className="w-3 h-3 text-emerald-400" /><span className="text-helios-300">{v}</span></div>)}</div></div>
                )}

                {ep.requestExample && (
                  <div><div className="text-helios-500 mb-2">Request Example</div><pre className="bg-helios-950 rounded-xl p-4 text-xs font-mono text-helios-200 overflow-x-auto whitespace-pre-wrap">{ep.requestExample}</pre></div>
                )}

                {ep.responseExample && (
                  <div><div className="text-helios-500 mb-2">Response Example</div><pre className="bg-helios-950 rounded-xl p-4 text-xs font-mono text-helios-200 overflow-x-auto whitespace-pre-wrap">{ep.responseExample}</pre></div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
