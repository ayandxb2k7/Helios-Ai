"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  FolderTree,
  FolderOpen,
  Copy,
  Check,
  Search,
} from "lucide-react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
}

const fileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "app",
        type: "folder",
        children: [
          { name: "page.tsx", type: "file", language: "typescript", content: `import { Sparkles } from "lucide-react";\n\nexport default function Home() {\n  return (\n    <main className="min-h-screen">\n      <Sparkles className="w-6 h-6" />\n      <h1>Welcome to my app</h1>\n    </main>\n  );\n}` },
          { name: "layout.tsx", type: "file", language: "typescript", content: `import type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = {\n  title: "My App",\n};\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}` },
          {
            name: "api",
            type: "folder",
            children: [
              {
                name: "auth",
                type: "folder",
                children: [
                  { name: "route.ts", type: "file", language: "typescript", content: `import { NextRequest, NextResponse } from "next/server";\nimport jwt from "jsonwebtoken";\nimport { db } from "@/db";\nimport { users } from "@/db/schema";\n\nexport async function POST(req: NextRequest) {\n  const { email, password } = await req.json();\n  \n  const user = await db.query.users.findFirst({\n    where: (u, { eq }) => eq(u.email, email),\n  });\n  \n  if (!user) {\n    return NextResponse.json({ error: "Not found" }, { status: 404 });\n  }\n  \n  const token = jwt.sign(\n    { userId: user.id, role: user.role },\n    process.env.JWT_SECRET!,\n    { expiresIn: "7d" }\n  );\n  \n  const res = NextResponse.json({ user });\n  res.cookies.set("auth-token", token, {\n    httpOnly: true,\n    secure: process.env.NODE_ENV === "production",\n  });\n  \n  return res;\n}` },
                ],
              },
              {
                name: "users",
                type: "folder",
                children: [
                  { name: "route.ts", type: "file", language: "typescript", content: `import { NextRequest, NextResponse } from "next/server";\nimport { db } from "@/db";\nimport { users } from "@/db/schema";\n\nexport async function GET() {\n  const allUsers = await db.query.users.findMany();\n  return NextResponse.json(allUsers);\n}\n\nexport async function POST(req: NextRequest) {\n  const body = await req.json();\n  const [user] = await db.insert(users).values(body).returning();\n  return NextResponse.json(user, { status: 201 });\n}` },
                ],
              },
              { name: "health", type: "folder", children: [
                { name: "route.ts", type: "file", language: "typescript", content: `import { NextResponse } from "next/server";\n\nexport async function GET() {\n  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });\n}` },
              ]},
            ],
          },
          { name: "dashboard", type: "folder", children: [
            { name: "page.tsx", type: "file", language: "typescript", content: `"use client";\n\nimport { motion } from "framer-motion";\nimport { BarChart3, Activity } from "lucide-react";\n\nexport default function DashboardPage() {\n  return (\n    <div className="p-8">\n      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>\n      <div className="grid grid-cols-3 gap-4">\n        <motion.div className="glass p-6">\n          <BarChart3 className="w-5 h-5 text-accent-400" />\n          <div className="text-2xl font-bold mt-2">1,234</div>\n          <div className="text-sm text-helios-400">Total Events</div>\n        </motion.div>\n      </div>\n    </div>\n  );\n}` },
          ]},
        ],
      },
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Button.tsx", type: "file", language: "typescript", content: `"use client";\n\nimport { ButtonHTMLAttributes } from "react";\n\ninterface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: "primary" | "secondary" | "ghost";\n}\n\nexport function Button({ variant = "primary", className, children, ...props }: ButtonProps) {\n  const baseStyles = "px-4 py-2 rounded-xl font-medium transition-all";\n  const variants = {\n    primary: "bg-accent-500 hover:bg-accent-400 text-white",\n    secondary: "glass glass-hover",\n    ghost: "hover:bg-helios-700/50",\n  };\n  \n  return (\n    <button className={\`\${baseStyles} \${variants[variant]} \${className}\`} {...props}>\n      {children}\n    </button>\n  );\n}` },
          { name: "Card.tsx", type: "file", language: "typescript", content: `interface CardProps {\n  title: string;\n  children: React.ReactNode;\n}\n\nexport function Card({ title, children }: CardProps) {\n  return (\n    <div className="glass p-6">\n      <h3 className="font-semibold mb-4">{title}</h3>\n      {children}\n    </div>\n  );\n}` },
        ],
      },
      {
        name: "lib",
        type: "folder",
        children: [
          { name: "auth.ts", type: "file", language: "typescript", content: `import jwt from "jsonwebtoken";\nimport { cookies } from "next/headers";\n\nexport async function getCurrentUser() {\n  const token = (await cookies()).get("auth-token")?.value;\n  if (!token) return null;\n  \n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {\n      userId: string;\n      role: string;\n    };\n    return decoded;\n  } catch {\n    return null;\n  }\n}\n\nexport function generateToken(userId: string, role: string) {\n  return jwt.sign(\n    { userId, role },\n    process.env.JWT_SECRET!,\n    { expiresIn: "7d" }\n  );\n}` },
          { name: "utils.ts", type: "file", language: "typescript", content: `export function cn(...classes: (string | boolean | undefined)[]) {\n  return classes.filter(Boolean).join(" ");\n}\n\nexport function formatDate(date: Date) {\n  return new Intl.DateTimeFormat("en-US", {\n    month: "short",\n    day: "numeric",\n    year: "numeric",\n  }).format(date);\n}\n\nexport function debounce<T extends (...args: unknown[]) => void>(\n  fn: T,\n  ms: number\n) {\n  let timeout: NodeJS.Timeout;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn(...args), ms);\n  };\n}` },
        ],
      },
      {
        name: "db",
        type: "folder",
        children: [
          { name: "schema.ts", type: "file", language: "typescript", content: `import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";\n\nexport const users = pgTable("users", {\n  id: uuid("id").defaultRandom().primaryKey(),\n  name: varchar("name", { length: 255 }).notNull(),\n  email: varchar("email", { length: 255 }).notNull().unique(),\n  role: varchar("role", { length: 50 }).default("user"),\n  createdAt: timestamp("created_at").defaultNow().notNull(),\n});\n\nexport const projects = pgTable("projects", {\n  id: uuid("id").defaultRandom().primaryKey(),\n  name: varchar("name", { length: 255 }).notNull(),\n  description: text("description"),\n  ownerId: uuid("owner_id").references(() => users.id),\n  createdAt: timestamp("created_at").defaultNow().notNull(),\n});` },
          { name: "index.ts", type: "file", language: "typescript", content: `import { drizzle } from "drizzle-orm/node-postgres";\nimport { Pool } from "pg";\n\nconst pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n});\n\nexport const db = drizzle(pool);` },
        ],
      },
    ],
  },
  { name: "package.json", type: "file", language: "json", content: `{\n  "name": "my-nextjs-app",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  },\n  "dependencies": {\n    "next": "15.0.0",\n    "react": "19.0.0",\n    "react-dom": "19.0.0",\n    "drizzle-orm": "0.45.0",\n    "jsonwebtoken": "^9.0.0",\n    "pg": "^8.12.0"\n  }\n}` },
  { name: "tsconfig.json", type: "file", language: "json", content: `{\n  "compilerOptions": {\n    "target": "ES2017",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "strict": true,\n    "noEmit": true,\n    "esModuleInterop": true,\n    "module": "esnext",\n    "moduleResolution": "bundler",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "jsx": "preserve",\n    "incremental": true,\n    "paths": {\n      "@/*": ["./src/*"]\n    }\n  },\n  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],\n  "exclude": ["node_modules"]\n}` },
  { name: "next.config.ts", type: "file", language: "typescript", content: `import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {\n  reactStrictMode: true,\n};\n\nexport default nextConfig;` },
  { name: "README.md", type: "file", language: "markdown", content: `# My Next.js App\n\nA modern web application built with Next.js 15.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nOpen [http://localhost:3000](http://localhost:3000)` },
];

function getFileIcon(name: string) {
  if (name.endsWith(".tsx") || name.endsWith(".ts")) return <FileCode2 className="w-4 h-4 text-accent-400" />;
  if (name.endsWith(".json")) return <FileCode2 className="w-4 h-4 text-amber-400" />;
  if (name.endsWith(".md")) return <FileCode2 className="w-4 h-4 text-cyan-400" />;
  return <FileCode2 className="w-4 h-4 text-helios-400" />;
}

function TreeItem({
  node,
  depth,
  selectedFile,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  selectedFile: string | null;
  onSelect: (node: FileNode, path: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  const isFolder = node.type === "folder";
  const path = node.name;

  return (
    <div>
      <div
        className={`file-tree-item flex items-center gap-2 py-1.5 pr-3 ${selectedFile === path ? "active" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            setExpanded(!expanded);
          } else {
            onSelect(node, path);
          }
        }}
      >
        {isFolder ? (
          <>
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-helios-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-helios-400" />
            )}
            {expanded ? (
              <FolderOpen className="w-4 h-4 text-accent-400" />
            ) : (
              <FolderTree className="w-4 h-4 text-accent-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className={`text-sm truncate ${isFolder ? "text-helios-200 font-medium" : "text-helios-300"}`}>
          {node.name}
        </span>
      </div>
      {isFolder && expanded && node.children?.map((child) => (
        <TreeItem
          key={child.name}
          node={child}
          depth={depth + 1}
          selectedFile={selectedFile}
          onSelect={(n, p) => onSelect(n, `${path}/${p}`)}
        />
      ))}
    </div>
  );
}

export default function FileExplorerPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSelect = (node: FileNode, path: string) => {
    setSelectedFile(path);
    setSelectedNode(node);
  };

  const copyCode = () => {
    if (selectedNode?.content) {
      navigator.clipboard.writeText(selectedNode.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const breadcrumbs = selectedFile ? selectedFile.split("/") : [];

  return (
    <div className="flex h-screen">
      {/* File Tree */}
      <div className="w-72 border-r border-helios-700/50 bg-helios-900/50 flex flex-col shrink-0">
        <div className="p-3 border-b border-helios-700/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-helios-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-3 py-2 bg-helios-800/60 border border-helios-600/50 rounded-lg text-sm text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {fileTree.map((node) => (
            <TreeItem
              key={node.name}
              node={node}
              depth={0}
              selectedFile={selectedFile}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Code View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-helios-700/50 bg-helios-900/30 text-xs text-helios-400">
          {breadcrumbs.map((part, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              <span className={i === breadcrumbs.length - 1 ? "text-helios-200" : ""}>{part}</span>
            </span>
          ))}
          {selectedNode && (
            <button onClick={copyCode} className="ml-auto p-1 hover:bg-helios-700/50 rounded transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-helios-400" />}
            </button>
          )}
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto">
          {selectedNode?.content ? (
            <pre className="p-4 text-sm font-mono text-helios-200 leading-relaxed whitespace-pre-wrap">
              <code>
                {selectedNode.content.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-10 text-right pr-4 text-helios-600 select-none shrink-0">{i + 1}</span>
                    <span className="flex-1">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-helios-500">
              <div className="text-center">
                <FileCode2 className="w-12 h-12 mx-auto mb-4 text-helios-600" />
                <p className="text-lg">Select a file to preview</p>
                <p className="text-sm mt-1">Click any file in the tree to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
