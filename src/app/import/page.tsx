"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Globe,
  Upload,
  FolderOpen,
  FileArchive,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode2,
  Database,
  Package,
  Link2,
} from "lucide-react";

type ImportMethod = "github" | "gitlab" | "bitbucket" | "zip" | "folder";

const detectedTech = [
  { name: "Next.js", icon: Globe, confidence: 98 },
  { name: "React", icon: FileCode2, confidence: 95 },
  { name: "TypeScript", icon: FileCode2, confidence: 92 },
  { name: "Tailwind CSS", icon: Package, confidence: 88 },
  { name: "PostgreSQL", icon: Database, confidence: 85 },
  { name: "Node.js", icon: Package, confidence: 80 },
  { name: "Docker", icon: Package, confidence: 75 },
  { name: "Python", icon: FileCode2, confidence: 60 },
];

export default function ImportPage() {
  const router = useRouter();
  const [method, setMethod] = useState<ImportMethod>("github");
  const [repoUrl, setRepoUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleScan = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 4000);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file.name);
      setMethod("zip");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      setMethod("zip");
    }
  }, []);

  return (
    <div className="min-h-screen dot-grid">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-helios-950/80 backdrop-blur-xl border-b border-helios-700/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">HELIOS <span className="text-accent-400">AI</span></span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-helios-400 hover:text-helios-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Import Project</h1>
          <p className="text-helios-400 mb-8">Upload a repository for HELIOS to analyze and understand.</p>
        </motion.div>

        {!scanComplete ? (
          <>
            {/* Method Selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-8">
              {[
              { id: "github" as ImportMethod, icon: Link2, label: "GitHub", desc: "Repo URL" },
              { id: "gitlab" as ImportMethod, icon: Link2, label: "GitLab", desc: "Repo URL" },
              { id: "bitbucket" as ImportMethod, icon: Link2, label: "Bitbucket", desc: "Repo URL" },
              { id: "zip" as ImportMethod, icon: FileArchive, label: "ZIP Upload", desc: "Upload .zip" },
              { id: "folder" as ImportMethod, icon: FolderOpen, label: "Local Folder", desc: "Select dir" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-5 rounded-2xl text-left transition-all duration-200 ${
                    method === m.id
                      ? "glass border-accent-500/40 bg-accent-500/10"
                      : "glass glass-hover"
                  }`}
                >
                  <m.icon className={`w-6 h-6 mb-3 ${method === m.id ? "text-accent-400" : "text-helios-400"}`} />
                  <div className={`font-medium text-sm mb-1 ${method === m.id ? "text-helios-100" : "text-helios-300"}`}>
                    {m.label}
                  </div>
                  <div className="text-xs text-helios-500">{m.desc}</div>
                </button>
              ))}
            </motion.div>

            {/* Import Input */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 mb-6">
              <AnimatePresence mode="wait">
                {method === "github" && (
                  <motion.div key="github" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <label className="block text-sm font-medium text-helios-300 mb-2">GitHub Repository URL</label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/owner/repo"
                        className="flex-1 px-4 py-3 bg-helios-800/60 border border-helios-600/50 rounded-xl text-helios-100 placeholder-helios-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20 text-sm"
                      />
                      <button
                        onClick={handleScan}
                        disabled={!repoUrl || isScanning}
                        className="px-6 py-3 bg-accent-500 hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2"
                      >
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Scan
                      </button>
                    </div>
                  </motion.div>
                )}

                {method === "zip" && (
                  <motion.div key="zip" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                        dragOver ? "border-accent-500 bg-accent-500/5" : "border-helios-600/50 hover:border-helios-500/50"
                      }`}
                    >
                      {uploadedFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileArchive className="w-8 h-8 text-accent-400" />
                          <div>
                            <div className="font-medium">{uploadedFile}</div>
                            <div className="text-xs text-helios-400 mt-1">File ready for upload</div>
                          </div>
                          <button onClick={() => setUploadedFile(null)} className="p-1 hover:bg-helios-700 rounded-lg">
                            <X className="w-4 h-4 text-helios-400" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-helios-500 mx-auto mb-4" />
                          <div className="font-medium mb-1">Drag & drop your ZIP file</div>
                          <div className="text-sm text-helios-500 mb-4">or click to browse</div>
                          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500/15 text-accent-400 rounded-xl text-sm cursor-pointer hover:bg-accent-500/25 transition-all">
                            <Upload className="w-4 h-4" /> Browse Files
                            <input type="file" accept=".zip" onChange={handleFileSelect} className="hidden" />
                          </label>
                        </>
                      )}
                    </div>
                    {uploadedFile && (
                      <button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="mt-4 w-full py-3 bg-accent-500 hover:bg-accent-400 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                      >
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Analyze Project
                      </button>
                    )}
                  </motion.div>
                )}

                {method === "folder" && (
                  <motion.div key="folder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="border-2 border-dashed border-helios-600/50 rounded-2xl p-12 text-center">
                      <FolderOpen className="w-10 h-10 text-helios-500 mx-auto mb-4" />
                      <div className="font-medium mb-1">Select Local Folder</div>
                      <div className="text-sm text-helios-500 mb-4">Choose a project directory to analyze</div>
                      <button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-400 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all"
                      >
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-4 h-4" />}
                        Select Folder
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Scanning Animation */}
            <AnimatePresence>
              {isScanning && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-accent-500/30 border-t-accent-500 rounded-full mx-auto mb-6"
                  />
                  <h3 className="text-lg font-semibold mb-2">HELIOS is scanning your project...</h3>
                  <div className="space-y-2 text-sm text-helios-400">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                      ✓ Analyzing folder structure
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                      ✓ Detecting tech stack & dependencies
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                      ✓ Mapping routes, APIs & components
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                      ⏳ Building project graph...
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Scan Complete */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="glass p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <h2 className="text-xl font-bold">Project Scanned Successfully</h2>
                  <p className="text-sm text-helios-400">HELIOS has analyzed your project and is ready.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Files", value: "247" },
                  { label: "Components", value: "34" },
                  { label: "APIs", value: "12" },
                  { label: "Models", value: "8" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-helios-800/60 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-xs text-helios-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent-400" /> Detected Technologies
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {detectedTech.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 glass-sm rounded-xl"
                  >
                    <tech.icon className="w-5 h-5 text-accent-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{tech.name}</div>
                      <div className="w-full h-1 bg-helios-700 rounded-full mt-1.5 overflow-hidden">
                        <motion.div
                          className="h-full bg-accent-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${tech.confidence}%` }}
                          transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-helios-400">{tech.confidence}%</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/project/demo-next")}
                  className="flex-1 py-3 bg-gradient-to-r from-accent-500 to-cyan-500 hover:from-accent-400 hover:to-cyan-400 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Open Project
                </button>
                <button
                  onClick={() => { setScanComplete(false); setUploadedFile(null); setRepoUrl(""); }}
                  className="px-6 py-3 glass glass-hover rounded-xl font-medium text-sm transition-all"
                >
                  Scan Another
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
