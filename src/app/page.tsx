"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Globe,
  Zap,
  Shield,
  Brain,
  Code2,
  GitBranch,
  Search,
  FileCode2,
  BarChart3,
  ChevronRight,
  Play,
  Upload,
  FolderOpen,
} from "lucide-react";

/* ---------- Particle Background ---------- */
function ParticleField() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const p = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              p.size > 2.5
                ? "rgba(108, 92, 231, 0.6)"
                : "rgba(0, 206, 201, 0.4)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"
        style={{ animation: "float 8s ease-in-out infinite 2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px]"
        style={{ animation: "float 10s ease-in-out infinite 1s" }}
      />
    </div>
  );
}

/* ---------- Feature Card ---------- */
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glass glass-hover p-6 transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-accent-400" />
      </div>
      <h3 className="text-helios-100 font-semibold mb-2">{title}</h3>
      <p className="text-helios-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ---------- Stats ---------- */
const stats = [
  { label: "Projects Analyzed", value: "12,847" },
  { label: "Issues Found", value: "94,203" },
  { label: "Files Understood", value: "2.4M" },
  { label: "Code Coverage", value: "89%" },
];

/* ---------- Main ---------- */
export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const demoFeatures = [
    { icon: Brain, text: "Understands entire codebase context" },
    { icon: Search, text: "Searches code by function, variable, API" },
    { icon: Shield, text: "Detects security vulnerabilities" },
    { icon: GitBranch, text: "Maps architecture & dependencies" },
    { icon: Code2, text: "Generates documentation & README" },
    { icon: BarChart3, text: "Scores project health & quality" },
  ];

  const cycleDemo = useCallback(() => {
    setActiveDemo((prev) => (prev + 1) % demoFeatures.length);
  }, [demoFeatures.length]);

  useEffect(() => {
    const interval = setInterval(cycleDemo, 3000);
    return () => clearInterval(interval);
  }, [cycleDemo]);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleField />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            HELIOS <span className="text-accent-400">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-helios-300">
          <Link href="/dashboard" className="hover:text-helios-100 transition-colors">
            Dashboard
          </Link>
          <Link href="/import" className="hover:text-helios-100 transition-colors">
            Import
          </Link>
          <a href="#features" className="hover:text-helios-100 transition-colors">
            Features
          </a>
        </div>
        <Link
          href="/import"
          className="px-5 py-2.5 bg-accent-500 hover:bg-accent-400 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 md:pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm mb-8">
            <Zap className="w-3.5 h-3.5" />
            Autonomous Software Engineer
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            Meet{" "}
            <span className="gradient-text">HELIOS</span>
          </h1>
          <p className="text-xl md:text-2xl text-helios-300 mb-4">
            The AI Software Engineer
          </p>
          <p className="text-base md:text-lg text-helios-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload any repository. HELIOS scans every file, understands the architecture, 
            finds issues, and answers any technical question like a Senior Software Engineer.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/import"
              className="group px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-400 hover:from-accent-400 hover:to-accent-300 text-white rounded-2xl font-semibold text-base transition-all duration-300 flex items-center gap-3 glow-accent"
            >
              <Upload className="w-5 h-5" />
              Import Repository
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 glass glass-hover rounded-2xl font-semibold text-base transition-all duration-300 flex items-center gap-3 text-helios-200"
            >
              <FolderOpen className="w-5 h-5" />
              Open Project
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 glass glass-hover rounded-2xl font-medium text-base transition-all duration-300 flex items-center gap-3 text-helios-300"
            >
              <Play className="w-5 h-5" />
              View Demo
            </Link>
          </div>

          {/* Demo Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass p-1 max-w-2xl mx-auto"
          >
            <div className="bg-helios-900/80 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-helios-700/50">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <span className="ml-3 text-xs text-helios-500">helios-ai — terminal</span>
              </div>
              <div className="p-5 text-left font-mono text-sm">
                <div className="text-helios-500 mb-2">$ helios scan ./my-project</div>
                <div className="text-emerald-400 mb-1">✓ Detected: Next.js 15, React 19, TypeScript</div>
                <div className="text-emerald-400 mb-1">✓ Scanned 247 files</div>
                <div className="text-emerald-400 mb-1">✓ Found 12 API endpoints</div>
                <div className="text-amber-400 mb-1">⚠ 3 unused dependencies</div>
                <div className="text-rose-400 mb-1">✗ 2 security issues found</div>
                <div className="text-accent-400 mt-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDemo}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      {(() => {
                        const Icon = demoFeatures[activeDemo].icon;
                        return <Icon className="w-4 h-4" />;
                      })()}
                      {demoFeatures[activeDemo].text}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-helios-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need to <span className="gradient-text">understand code</span>
          </h2>
          <p className="text-helios-400 text-lg max-w-2xl mx-auto">
            HELIOS doesn&apos;t just read files — it understands architecture, finds issues, and answers questions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={Brain}
            title="AI-Powered Understanding"
            description="Deep comprehension of your codebase. Ask any question about the project architecture, logic, or implementation."
            delay={0}
          />
          <FeatureCard
            icon={GitBranch}
            title="Architecture Mapping"
            description="Automatically generates dependency graphs, API flow diagrams, and folder relationship visualizations."
            delay={0.05}
          />
          <FeatureCard
            icon={Shield}
            title="Security Analysis"
            description="Detects hardcoded secrets, JWT issues, missing validations, unsafe APIs, and dependency vulnerabilities."
            delay={0.1}
          />
          <FeatureCard
            icon={Search}
            title="Semantic Code Search"
            description="Search by function, variable, API, component, or keyword. Get clickable results with context."
            delay={0.15}
          />
          <FeatureCard
            icon={FileCode2}
            title="Issue Detection"
            description="Finds unused files, duplicate code, circular imports, missing env vars, and possible bugs."
            delay={0.2}
          />
          <FeatureCard
            icon={Code2}
            title="README Generator"
            description="Generates professional README with features, installation, architecture, and API documentation."
            delay={0.25}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-12 md:p-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to meet your <span className="gradient-text">AI Engineer</span>?
          </h2>
          <p className="text-helios-400 text-lg mb-8 max-w-xl mx-auto">
            Upload any repository and let HELIOS understand your entire project.
          </p>
          <Link
            href="/import"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-500 to-cyan-500 hover:from-accent-400 hover:to-cyan-400 text-white rounded-2xl font-semibold text-lg transition-all duration-300 glow-accent"
          >
            <Globe className="w-5 h-5" />
            Import Repository
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-helios-700/50 py-8 px-6 text-center text-sm text-helios-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent-400" />
          <span className="font-semibold text-helios-300">HELIOS AI</span>
        </div>
        <p>The Autonomous Software Engineer &middot; Built with precision</p>
      </footer>
    </div>
  );
}
