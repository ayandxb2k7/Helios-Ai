"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Shield,
  Heart,
  ClipboardCheck,
  Map,
  Code2,
  Database,
  Copy,
  Check,
  FileJson,
  FileCode,
} from "lucide-react";

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  formats: ExportFormat[];
  category: string;
}

interface ExportFormat {
  type: "pdf" | "json" | "markdown" | "html";
  label: string;
  size: string;
}

const exportOptions: ExportOption[] = [
  {
    id: "architecture",
    title: "Architecture Report",
    description: "Complete architecture analysis including diagrams, data flow, and module relationships",
    icon: Code2,
    formats: [
      { type: "pdf", label: "PDF Document", size: "~2.4MB" },
      { type: "json", label: "JSON Data", size: "~180KB" },
      { type: "markdown", label: "Markdown", size: "~45KB" },
    ],
    category: "Architecture",
  },
  {
    id: "health",
    title: "Project Health Report",
    description: "Health scores, radar analysis, and detailed breakdown across all dimensions",
    icon: Heart,
    formats: [
      { type: "pdf", label: "PDF Document", size: "~1.8MB" },
      { type: "json", label: "JSON Data", size: "~12KB" },
      { type: "markdown", label: "Markdown", size: "~8KB" },
    ],
    category: "Quality",
  },
  {
    id: "security",
    title: "Security Report",
    description: "Vulnerability analysis, CVE references, and remediation recommendations",
    icon: Shield,
    formats: [
      { type: "pdf", label: "PDF Document", size: "~1.2MB" },
      { type: "json", label: "JSON Data", size: "~8KB" },
      { type: "markdown", label: "Markdown", size: "~15KB" },
    ],
    category: "Security",
  },
  {
    id: "review",
    title: "Code Review Report",
    description: "Detailed code review with scores, findings, and improvement suggestions",
    icon: ClipboardCheck,
    formats: [
      { type: "pdf", label: "PDF Document", size: "~2.1MB" },
      { type: "json", label: "JSON Data", size: "~25KB" },
      { type: "markdown", label: "Markdown", size: "~20KB" },
    ],
    category: "Quality",
  },
  {
    id: "roadmap",
    title: "Project Roadmap",
    description: "Prioritized improvement roadmap with effort estimates and timeline",
    icon: Map,
    formats: [
      { type: "pdf", label: "PDF Document", size: "~800KB" },
      { type: "json", label: "JSON Data", size: "~6KB" },
      { type: "markdown", label: "Markdown", size: "~5KB" },
    ],
    category: "Planning",
  },
  {
    id: "readme",
    title: "README",
    description: "Professional README with features, installation, architecture, and API docs",
    icon: FileText,
    formats: [
      { type: "markdown", label: "Markdown", size: "~4KB" },
      { type: "html", label: "HTML", size: "~8KB" },
    ],
    category: "Documentation",
  },
  {
    id: "api",
    title: "API Documentation",
    description: "Complete API reference with endpoints, request/response examples",
    icon: Database,
    formats: [
      { type: "markdown", label: "Markdown", size: "~12KB" },
      { type: "json", label: "OpenAPI JSON", size: "~15KB" },
      { type: "html", label: "HTML", size: "~20KB" },
    ],
    category: "Documentation",
  },
  {
    id: "database",
    title: "Database Schema",
    description: "ER diagram, table definitions, relationships, and query patterns",
    icon: Database,
    formats: [
      { type: "pdf", label: "PDF Document", size: "~600KB" },
      { type: "json", label: "JSON Data", size: "~10KB" },
      { type: "markdown", label: "Markdown", size: "~6KB" },
    ],
    category: "Documentation",
  },
];

const formatIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  json: FileJson,
  markdown: FileCode,
  html: FileCode,
};

const formatColors: Record<string, string> = {
  pdf: "badge-rose",
  json: "badge-amber",
  markdown: "badge-cyan",
  html: "badge-emerald",
};

export default function ExportsPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<Set<string>>(new Set());

  const handleExport = (optionId: string, format: string) => {
    const key = `${optionId}-${format}`;
    setExporting(key);
    setTimeout(() => {
      setExporting(null);
      setExported((prev) => new Set(prev).add(key));
    }, 1500);
  };

  const isExporting = (optionId: string, format: string) => exporting === `${optionId}-${format}`;
  const isExported = (optionId: string, format: string) => exported.has(`${optionId}-${format}`);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Download className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Export Center</h1>
        </div>
        <p className="text-helios-400">Export reports and documentation in multiple formats.</p>
      </motion.div>

      {/* Quick Export All */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Quick Export</h3>
            <p className="text-sm text-helios-400">Export all reports at once</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-accent-500 hover:bg-accent-400 text-white rounded-xl text-sm font-medium transition-all">
              <FileText className="w-4 h-4" /> All as Markdown
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 glass glass-hover rounded-xl text-sm font-medium transition-all">
              <FileJson className="w-4 h-4" /> All as JSON
            </button>
          </div>
        </div>
      </motion.div>

      {/* Export Options */}
      <div className="space-y-4">
        {exportOptions.map((option, i) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.04 }}
            className="glass p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
                <option.icon className="w-5 h-5 text-accent-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{option.title}</h3>
                  <span className="badge badge-purple text-[10px]">{option.category}</span>
                </div>
                <p className="text-sm text-helios-400 mb-4">{option.description}</p>
                <div className="flex flex-wrap gap-3">
                  {option.formats.map((format) => {
                    const FormatIcon = formatIcons[format.type] || FileText;
                    const key = `${option.id}-${format.type}`;
                    const loading = isExporting(option.id, format.type);
                    const done = isExported(option.id, format.type);
                    return (
                      <button
                        key={key}
                        onClick={() => handleExport(option.id, format.type)}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
                          done
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : loading
                            ? "bg-accent-500/10 text-accent-300 border border-accent-500/10"
                            : "glass glass-hover"
                        }`}
                      >
                        {done ? (
                          <Check className="w-4 h-4" />
                        ) : loading ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-accent-500/30 border-t-accent-500 rounded-full" />
                        ) : (
                          <FormatIcon className="w-4 h-4" />
                        )}
                        <span>{format.label}</span>
                        <span className="text-xs text-helios-500">{format.size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
