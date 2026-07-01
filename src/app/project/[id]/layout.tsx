"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  FolderTree,
  Network,
  Heart,
  AlertTriangle,
  Shield,
  FileText,
  Route,
  Database,
  Search,
  ChevronLeft,
  Settings,
  Brain,
  ClipboardCheck,
  Bug,
  Map,
  FlaskConical,
  BookOpen,
  Package,
  Gauge,
  History,
  Download,
  Cpu,
  Radio,
  GitBranch,
  Mic,
  Waypoints,
  Activity,
} from "lucide-react";

const navSections = [
  {
    label: "Workspace",
    items: [
      { href: "", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/chat", icon: MessageSquare, label: "AI Chat" },
      { href: "/files", icon: FolderTree, label: "Repository" },
      { href: "/search", icon: Search, label: "Code Search" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/agents", icon: Cpu, label: "AI Agents" },
      { href: "/architect", icon: Brain, label: "AI Architect" },
      { href: "/knowledge", icon: Waypoints, label: "Knowledge Graph" },
      { href: "/debug", icon: Bug, label: "Smart Debug" },
    ],
  },
  {
    label: "Analysis",
    items: [
      { href: "/architecture", icon: Network, label: "Architecture" },
      { href: "/review", icon: ClipboardCheck, label: "Code Review" },
      { href: "/bugs", icon: AlertTriangle, label: "Issues" },
      { href: "/health", icon: Heart, label: "Health" },
    ],
  },
  {
    label: "Quality",
    items: [
      { href: "/security", icon: Shield, label: "Security" },
      { href: "/performance", icon: Gauge, label: "Performance" },
      { href: "/tests", icon: FlaskConical, label: "Testing" },
      { href: "/dependencies", icon: Package, label: "Dependencies" },
    ],
  },
  {
    label: "Generate",
    items: [
      { href: "/docs", icon: BookOpen, label: "Documentation" },
      { href: "/readme", icon: FileText, label: "README" },
      { href: "/roadmap", icon: Map, label: "Roadmap" },
    ],
  },
  {
    label: "Inspect",
    items: [
      { href: "/api-explorer", icon: Route, label: "API Explorer" },
      { href: "/database", icon: Database, label: "Database" },
      { href: "/github", icon: GitBranch, label: "GitHub" },
      { href: "/observability", icon: Activity, label: "Observability" },
    ],
  },
  {
    label: "Project",
    items: [
      { href: "/voice", icon: Mic, label: "Voice" },
      { href: "/memory", icon: History, label: "Memory" },
      { href: "/exports", icon: Download, label: "Exports" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const projectId = pathname.split("/")[2];

  const projectNames: Record<string, string> = {
    "demo-next": "my-nextjs-app",
    "demo-api": "api-server",
    "demo-ml": "ml-pipeline",
  };

  return (
    <div className="min-h-screen flex dot-grid">
      <aside
        className={`sticky top-0 h-screen bg-helios-900/80 backdrop-blur-xl border-r border-helios-700/50 flex flex-col transition-all duration-300 overflow-hidden ${
          collapsed ? "w-14" : "w-52"
        }`}
      >
        <div className="flex items-center justify-between px-2.5 py-2.5 border-b border-helios-700/50 min-h-[48px]">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold tracking-wide">HELIOS <span className="text-accent-400 text-[10px]">X</span></span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-helios-700/50 rounded-md transition-colors">
            <ChevronLeft className={`w-3.5 h-3.5 text-helios-400 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {!collapsed && (
          <div className="px-2.5 py-2 border-b border-helios-700/50">
            <div className="text-[9px] uppercase tracking-widest text-helios-600 mb-0.5">Project</div>
            <div className="text-xs font-medium text-helios-200 truncate">{projectNames[projectId] || projectId}</div>
          </div>
        )}

        <nav className="flex-1 py-1.5 px-1.5 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label} className="mb-1.5">
              {!collapsed && (
                <div className="px-2 py-1 text-[9px] uppercase tracking-widest text-helios-600 font-semibold">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => {
                const fullPath = `/project/${projectId}${item.href}`;
                const isActive = pathname === fullPath || (item.href === "" && pathname === `/project/${projectId}`);
                return (
                  <Link
                    key={item.href}
                    href={fullPath}
                    className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-helios-400 hover:text-helios-200 hover:bg-helios-700/30 transition-all text-xs ${
                      isActive ? "!bg-accent-500/15 !text-accent-400 border border-accent-500/20" : ""
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
