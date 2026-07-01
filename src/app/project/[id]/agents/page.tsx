"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Brain,
  Server,
  Monitor,
  Database,
  Shield,
  Gauge,
  FlaskConical,
  BookOpen,
  HardDrive,
  ClipboardCheck,
  Eye,
  Package,
  Send,
  Loader2,
  CheckCircle2,
  Radio,
  MessageSquare,
  X,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  color: string;
  status: "idle" | "running" | "complete";
  specialty: string;
  lastAction: string;
  conversations: AgentMessage[];
  capabilities: string[];
}

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  type: "analysis" | "finding" | "recommendation" | "question";
}

const agents: Agent[] = [
  {
    id: "architect", name: "Architect Agent", type: "architect", icon: Brain, color: "#6c5ce7", status: "complete", specialty: "System design & architecture patterns",
    lastAction: "Generated high-level architecture diagram",
    capabilities: ["Architecture diagrams", "Module relationships", "Data flow analysis", "Design patterns", "Scalability assessment"],
    conversations: [
      { id: "1", from: "Architect Agent", to: "Security Agent", content: "I've detected JWT tokens stored in cookies. Please verify the security configuration.", timestamp: "2m ago", type: "question" },
      { id: "2", from: "Security Agent", to: "Architect Agent", content: "Confirmed: JWT implementation is missing secret validation. Flagged as critical issue.", timestamp: "1m ago", type: "finding" },
      { id: "3", from: "Architect Agent", to: "Backend Agent", content: "The API layer needs a service abstraction. Currently business logic is in route handlers.", timestamp: "30s ago", type: "recommendation" },
    ],
  },
  {
    id: "backend", name: "Backend Agent", type: "backend", icon: Server, color: "#00cec9", status: "running", specialty: "API design & server logic",
    lastAction: "Analyzing API endpoint patterns",
    capabilities: ["API design review", "Route optimization", "Middleware analysis", "Error handling patterns", "Database query optimization"],
    conversations: [
      { id: "4", from: "Backend Agent", to: "Database Agent", content: "The GET /api/users endpoint might trigger N+1 queries. Can you verify the query patterns?", timestamp: "2m ago", type: "question" },
      { id: "5", from: "Database Agent", to: "Backend Agent", content: "Confirmed: Missing eager loading for user relations. Suggest using Drizzle's 'with' clause.", timestamp: "1m ago", type: "finding" },
    ],
  },
  {
    id: "frontend", name: "Frontend Agent", type: "frontend", icon: Monitor, color: "#fd79a8", status: "complete", specialty: "UI components & rendering",
    lastAction: "Identified 6 components for extraction",
    capabilities: ["Component analysis", "Render optimization", "Bundle analysis", "Accessibility review", "State management patterns"],
    conversations: [
      { id: "6", from: "Frontend Agent", to: "Performance Agent", content: "Dashboard re-renders on every state change. No memoization detected on stat cards.", timestamp: "3m ago", type: "finding" },
      { id: "7", from: "Performance Agent", to: "Frontend Agent", content: "Confirmed: Add React.memo to stat cards. Estimated 15-20ms saved per render cycle.", timestamp: "2m ago", type: "recommendation" },
    ],
  },
  {
    id: "database", name: "Database Agent", type: "database", icon: Database, color: "#fdcb6e", status: "idle", specialty: "Schema design & query optimization",
    lastAction: "Completed schema analysis",
    capabilities: ["Schema review", "Index optimization", "Query analysis", "Migration planning", "Relationship mapping"],
    conversations: [
      { id: "8", from: "Database Agent", to: "Architect Agent", content: "Schema follows clean normalization. Suggest adding GIN index on JSONB tech_stack column.", timestamp: "5m ago", type: "recommendation" },
    ],
  },
  {
    id: "security", name: "Security Agent", type: "security", icon: Shield, color: "#e17055", status: "complete", specialty: "Vulnerability detection & remediation",
    lastAction: "Found 2 critical, 4 medium security issues",
    capabilities: ["Vulnerability scanning", "Secret detection", "Auth flow review", "Dependency audit", "CORS analysis"],
    conversations: [
      { id: "9", from: "Security Agent", to: "DevOps Agent", content: "Missing rate limiting on auth endpoints. Add rate limiter middleware to /api/auth.", timestamp: "1m ago", type: "recommendation" },
    ],
  },
  {
    id: "performance", name: "Performance Agent", type: "performance", icon: Gauge, color: "#00b894", status: "complete" as const, specialty: "Speed optimization & monitoring",
    lastAction: "Bundle size analysis — 40% reduction possible",
    capabilities: ["Bundle analysis", "Render profiling", "API latency", "Memory analysis", "Caching strategies"],
    conversations: [
      { id: "10", from: "Performance Agent", to: "Frontend Agent", content: "Monaco Editor adds 1.2MB. Suggest dynamic import with ssr: false.", timestamp: "4m ago", type: "recommendation" },
    ],
  },
  {
    id: "testing", name: "Testing Agent", type: "testing", icon: FlaskConical, color: "#a29bfe", status: "idle", specialty: "Test generation & coverage",
    lastAction: "Generated 5 test suites",
    capabilities: ["Unit test generation", "Integration tests", "API test generation", "Coverage analysis", "Edge case detection"],
    conversations: [
      { id: "11", from: "Testing Agent", to: "Backend Agent", content: "Auth flow has zero test coverage. Generated auth.test.ts with 6 test cases.", timestamp: "6m ago", type: "finding" },
    ],
  },
  {
    id: "docs", name: "Documentation Agent", type: "docs", icon: BookOpen, color: "#636e72", status: "complete", specialty: "Documentation generation & review",
    lastAction: "Generated 7 documentation files",
    capabilities: ["README generation", "API documentation", "Architecture docs", "Setup guides", "JSDoc suggestions"],
    conversations: [],
  },
  {
    id: "devops", name: "DevOps Agent", type: "devops", icon: HardDrive, color: "#d63031", status: "idle", specialty: "CI/CD & deployment",
    lastAction: "Analyzed deployment readiness",
    capabilities: ["Docker configuration", "CI/CD pipelines", "Environment management", "Deployment planning", "Infrastructure review"],
    conversations: [],
  },
  {
    id: "review", name: "Code Review Agent", type: "review", icon: ClipboardCheck, color: "#0984e3", status: "complete", specialty: "Code quality & best practices",
    lastAction: "Code review score: 73/100",
    capabilities: ["Readability review", "Maintainability", "Best practices", "Design patterns", "Code smells"],
    conversations: [
      { id: "12", from: "Code Review Agent", to: "Architect Agent", content: "Missing service layer causes tight coupling in API handlers. Recommend extraction.", timestamp: "3m ago", type: "recommendation" },
    ],
  },
  {
    id: "accessibility", name: "Accessibility Agent", type: "accessibility", icon: Eye, color: "#00cec9", status: "idle", specialty: "A11y compliance & inclusive design",
    lastAction: "Scanned 34 components for a11y",
    capabilities: ["WCAG compliance", "ARIA audit", "Keyboard navigation", "Color contrast", "Screen reader support"],
    conversations: [],
  },
  {
    id: "dependency", name: "Dependency Agent", type: "dependency", icon: Package, color: "#fdcb6e", status: "idle", specialty: "Package analysis & optimization",
    lastAction: "Analyzed 15 dependencies",
    capabilities: ["Vulnerability audit", "Outdated detection", "Unused packages", "License compliance", "Bundle impact"],
    conversations: [],
  },
];

const statusStyles = { idle: "text-helios-400", running: "text-cyan-400", complete: "text-emerald-400" };
const statusBadge = { idle: "badge-purple", running: "badge-cyan", complete: "badge-emerald" };
const msgTypeBadge = { analysis: "badge-purple", finding: "badge-rose", recommendation: "badge-emerald", question: "badge-amber" };

export default function AgentsPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [selectedAgent, setSelectedAgent] = useState<string | null>("architect");
  const [chatInput, setChatInput] = useState("");
  const [agentChat, setAgentChat] = useState<Record<string, string[]>>({});

  const activeAgent = agents.find((a) => a.id === selectedAgent);
  const runningCount = agents.filter((a) => a.status === "running").length;
  const completeCount = agents.filter((a) => a.status === "complete").length;

  const sendToAgent = () => {
    if (!chatInput.trim() || !selectedAgent) return;
    setAgentChat((prev) => ({
      ...prev,
      [selectedAgent]: [...(prev[selectedAgent] || []), chatInput],
    }));
    setChatInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-helios-700/50 bg-helios-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-accent-400" />
          <div>
            <h2 className="font-semibold text-sm">Multi AI Agents</h2>
            <p className="text-[10px] text-helios-500">{agents.length} specialized agents collaborating</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><Radio className="w-3 h-3 text-cyan-400 animate-pulse" />{runningCount} running</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" />{completeCount} complete</span>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Agent Grid */}
        <div className="w-72 border-r border-helios-700/50 overflow-y-auto p-3 space-y-1.5 shrink-0">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                selectedAgent === agent.id ? "bg-accent-500/10 border border-accent-500/20" : "hover:bg-helios-700/20"
              }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${agent.color}15` }}>
                <agent.icon className="w-4 h-4" style={{ color: agent.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium truncate">{agent.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${agent.status === "running" ? "bg-cyan-400 animate-pulse" : agent.status === "complete" ? "bg-emerald-400" : "bg-helios-500"}`} />
                </div>
                <div className="text-[10px] text-helios-500 truncate">{agent.specialty}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Agent Detail */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeAgent && (
            <>
              {/* Agent Header */}
              <div className="px-6 py-4 border-b border-helios-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${activeAgent.color}15` }}>
                    <activeAgent.icon className="w-5 h-5" style={{ color: activeAgent.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{activeAgent.name}</h3>
                    <p className="text-xs text-helios-400">{activeAgent.specialty}</p>
                  </div>
                  <span className={`badge text-[10px] ${statusBadge[activeAgent.status]}`}>{activeAgent.status}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeAgent.capabilities.map((cap) => (
                    <span key={cap} className="px-2 py-0.5 text-[10px] rounded-md bg-helios-800/60 text-helios-400 border border-helios-700/30">{cap}</span>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex min-h-0">
                {/* Conversation Log */}
                <div className="flex-1 flex flex-col">
                  <div className="px-6 py-2 border-b border-helios-700/20">
                    <span className="text-[10px] uppercase tracking-widest text-helios-500 font-semibold">Agent Communications</span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {activeAgent.conversations.map((msg) => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-sm p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-medium text-accent-400">{msg.from}</span>
                          <span className="text-helios-600">→</span>
                          <span className="text-xs font-medium text-cyan-400">{msg.to}</span>
                          <span className={`badge text-[9px] ml-auto ${msgTypeBadge[msg.type]}`}>{msg.type}</span>
                        </div>
                        <p className="text-sm text-helios-300">{msg.content}</p>
                        <span className="text-[10px] text-helios-600 mt-1 block">{msg.timestamp}</span>
                      </motion.div>
                    ))}

                    {/* User messages to agent */}
                    {(agentChat[activeAgent.id] || []).map((msg, i) => (
                      <div key={i} className="flex justify-end">
                        <div className="bg-accent-500/15 border border-accent-500/20 rounded-xl px-4 py-2.5 max-w-sm">
                          <p className="text-sm text-helios-200">{msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="px-4 py-3 border-t border-helios-700/30">
                    <div className="flex gap-2">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendToAgent()}
                        placeholder={`Message ${activeAgent.name}...`}
                        className="flex-1 px-3 py-2 bg-helios-800/60 border border-helios-600/50 rounded-lg text-xs text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50"
                      />
                      <button onClick={sendToAgent} className="px-3 py-2 bg-accent-500 hover:bg-accent-400 text-white rounded-lg transition-all">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Side Panel - Agent Activity */}
                <div className="w-64 border-l border-helios-700/30 overflow-y-auto p-4 shrink-0">
                  <div className="text-[10px] uppercase tracking-widest text-helios-500 font-semibold mb-3">Last Action</div>
                  <p className="text-xs text-helios-300 mb-4">{activeAgent.lastAction}</p>

                  <div className="text-[10px] uppercase tracking-widest text-helios-500 font-semibold mb-3">Agent Network</div>
                  <div className="space-y-2">
                    {agents.filter((a) => a.id !== activeAgent.id).slice(0, 6).map((a) => (
                      <div key={a.id} className="flex items-center gap-2 p-2 glass-sm rounded-lg">
                        <a.icon className="w-3.5 h-3.5" style={{ color: a.color }} />
                        <span className="text-[11px] text-helios-300 flex-1 truncate">{a.name}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.status === "running" ? "bg-cyan-400" : a.status === "complete" ? "bg-emerald-400" : "bg-helios-600"}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
