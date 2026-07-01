"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
  FileCode2,
  GitBranch,
  Package,
  Database,
  Route,
  AlertTriangle,
  FolderTree,
  HardDrive,
  Trash2,
  Box,
  ArrowUpRight,
} from "lucide-react";

const projectData: Record<string, {
  name: string;
  description: string;
  tech: string[];
  health: number;
  files: number;
  components: number;
  apis: number;
  models: number;
  deps: number;
  largestFiles: { name: string; size: string }[];
  deadFiles: string[];
  unusedPkgs: string[];
}> = {
  "demo-next": {
    name: "my-nextjs-app",
    description: "A Next.js 15 application with TypeScript, Tailwind CSS, and PostgreSQL.",
    tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Drizzle ORM", "PostgreSQL"],
    health: 87,
    files: 247,
    components: 34,
    apis: 12,
    models: 8,
    deps: 24,
    largestFiles: [
      { name: "src/app/dashboard/page.tsx", size: "14.2 KB" },
      { name: "src/lib/analytics.ts", size: "12.8 KB" },
      { name: "src/components/Chart.tsx", size: "11.5 KB" },
      { name: "src/db/schema.ts", size: "8.3 KB" },
    ],
    deadFiles: ["src/utils/legacy.ts", "src/components/OldModal.tsx"],
    unusedPkgs: ["moment", "lodash"],
  },
  "demo-api": {
    name: "api-server",
    description: "Express.js REST API with PostgreSQL and Redis caching.",
    tech: ["Express.js", "Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
    health: 72,
    files: 128,
    components: 0,
    apis: 24,
    models: 12,
    deps: 18,
    largestFiles: [
      { name: "src/routes/userRoutes.ts", size: "18.1 KB" },
      { name: "src/services/authService.ts", size: "14.5 KB" },
    ],
    deadFiles: ["src/middleware/oldAuth.ts"],
    unusedPkgs: ["body-parser"],
  },
  "demo-ml": {
    name: "ml-pipeline",
    description: "Machine learning pipeline with FastAPI and scikit-learn.",
    tech: ["Python", "FastAPI", "scikit-learn", "Pandas", "Docker"],
    health: 91,
    files: 86,
    components: 0,
    apis: 8,
    models: 4,
    deps: 15,
    largestFiles: [
      { name: "src/models/trainer.py", size: "22.3 KB" },
      { name: "src/data/processor.py", size: "16.7 KB" },
    ],
    deadFiles: [],
    unusedPkgs: [],
  },
};

const folderTree = [
  { name: "src/", children: [
    { name: "app/", children: [
      { name: "page.tsx" },
      { name: "layout.tsx" },
      { name: "dashboard/" },
      { name: "api/" },
    ]},
    { name: "components/", children: [
      { name: "ui/" },
      { name: "charts/" },
      { name: "layout/" },
    ]},
    { name: "lib/", children: [
      { name: "utils.ts" },
      { name: "analytics.ts" },
      { name: "auth.ts" },
    ]},
    { name: "db/", children: [
      { name: "schema.ts" },
      { name: "index.ts" },
    ]},
  ]},
  { name: "public/" },
  { name: "package.json" },
  { name: "tsconfig.json" },
  { name: "next.config.ts" },
  { name: "README.md" },
];

function FolderTreeItem({ item, depth = 0 }: { item: { name: string; children?: Array<{ name: string; children?: Array<{ name: string }> }> }; depth?: number }) {
  const isFolder = item.name.endsWith("/") || item.children;
  return (
    <div>
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-helios-700/30 rounded-lg cursor-pointer text-sm"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <FolderTree className="w-3.5 h-3.5 text-accent-400" />
        ) : (
          <FileCode2 className="w-3.5 h-3.5 text-helios-400" />
        )}
        <span className={isFolder ? "text-helios-200 font-medium" : "text-helios-300"}>
          {item.name}
        </span>
      </div>
      {item.children?.map((child) => (
        <FolderTreeItem key={child.name} item={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = projectData[id] || projectData["demo-next"];

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-helios-400">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: project.health >= 80 ? "#00b894" : project.health >= 60 ? "#fdcb6e" : "#fd79a8" }}>
                {project.health}%
              </div>
              <div className="text-xs text-helios-500">Health Score</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="badge badge-purple">{t}</span>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { icon: FileCode2, label: "Files", value: project.files, color: "text-accent-400" },
          { icon: Box, label: "Components", value: project.components, color: "text-cyan-400" },
          { icon: Route, label: "APIs", value: project.apis, color: "text-emerald-400" },
          { icon: Database, label: "Models", value: project.models, color: "text-amber-400" },
          { icon: Package, label: "Dependencies", value: project.deps, color: "text-rose-400" },
          { icon: AlertTriangle, label: "Issues", value: 3, color: "text-rose-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass p-4 text-center">
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-helios-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Folder Tree */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-accent-400" /> Folder Structure
          </h3>
          <div className="bg-helios-900/60 rounded-xl p-3 max-h-80 overflow-y-auto">
            {folderTree.map((item) => (
              <FolderTreeItem key={item.name} item={item} />
            ))}
          </div>
        </motion.div>

        {/* Largest Files */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" /> Largest Files
          </h3>
          <div className="space-y-3">
            {project.largestFiles.map((file, i) => (
              <div key={file.name} className="flex items-center justify-between p-3 glass-sm rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-helios-500 w-4">{i + 1}</span>
                  <FileCode2 className="w-4 h-4 text-helios-400" />
                  <span className="text-sm font-mono text-helios-200">{file.name}</span>
                </div>
                <span className="text-xs text-helios-400">{file.size}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dead Files */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" /> Dead Files
          </h3>
          {project.deadFiles.length > 0 ? (
            <div className="space-y-2">
              {project.deadFiles.map((file) => (
                <div key={file} className="flex items-center gap-3 p-3 glass-sm rounded-lg">
                  <FileCode2 className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-mono text-helios-300">{file}</span>
                  <span className="badge badge-rose text-[10px] ml-auto">unused</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-helios-500 text-center py-8">No dead files detected 🎉</div>
          )}
        </motion.div>

        {/* Unused Packages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" /> Unused Packages
          </h3>
          {project.unusedPkgs.length > 0 ? (
            <div className="space-y-2">
              {project.unusedPkgs.map((pkg) => (
                <div key={pkg} className="flex items-center gap-3 p-3 glass-sm rounded-lg">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-mono text-helios-300">{pkg}</span>
                  <span className="badge badge-amber text-[10px] ml-auto">unused</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-helios-500 text-center py-8">All packages are in use 🎉</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
