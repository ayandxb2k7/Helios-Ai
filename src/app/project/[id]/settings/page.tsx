"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Database,
  Cpu,
  Globe,
  Key,
  Save,
  Check,
} from "lucide-react";

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-helios-400">Configure HELIOS workspace preferences.</p>
      </motion.div>

      <div className="space-y-6">
        {/* AI Configuration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6">
          <div className="flex items-center gap-3 mb-5">
            <Cpu className="w-5 h-5 text-accent-400" />
            <h3 className="font-semibold">AI Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-helios-300 mb-1.5 block">Default AI Model</label>
              <select className="w-full px-3 py-2.5 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 focus:outline-none focus:border-accent-500/50">
                <option>Gemini 2.5 Pro</option>
                <option>Claude 3.5 Sonnet</option>
                <option>GPT-4o</option>
                <option>Ollama (Local)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-helios-300 mb-1.5 block">Analysis Depth</label>
              <select className="w-full px-3 py-2.5 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 focus:outline-none focus:border-accent-500/50">
                <option>Deep (Slower, more thorough)</option>
                <option>Standard (Balanced)</option>
                <option>Quick (Faster, less detailed)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-helios-300">Enable multi-agent collaboration</span>
              <div className="w-10 h-6 bg-accent-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-helios-300">Auto-analyze on project import</span>
              <div className="w-10 h-6 bg-accent-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-rose-400" />
            <h3 className="font-semibold">Security & Privacy</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-helios-300 block">Read-only mode</span>
                <span className="text-xs text-helios-500">Never modify source code automatically</span>
              </div>
              <div className="w-10 h-6 bg-accent-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-helios-300 block">Always propose changes first</span>
                <span className="text-xs text-helios-500">Show diffs before any modification</span>
              </div>
              <div className="w-10 h-6 bg-accent-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-helios-300 block">Cite analyzed files</span>
                <span className="text-xs text-helios-500">Always reference source files in responses</span>
              </div>
              <div className="w-10 h-6 bg-accent-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Keys */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
          <div className="flex items-center gap-3 mb-5">
            <Key className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold">API Keys</h3>
          </div>
          <div className="space-y-4">
            {["OpenAI API Key", "Anthropic API Key", "GitHub Token", "Gemini API Key"].map((key) => (
              <div key={key}>
                <label className="text-sm text-helios-300 mb-1.5 block">{key}</label>
                <input type="password" placeholder={`Enter ${key.toLowerCase()}`} className="w-full px-3 py-2.5 bg-helios-800/60 border border-helios-600/50 rounded-xl text-sm text-helios-200 placeholder-helios-500 focus:outline-none focus:border-accent-500/50" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white rounded-xl font-medium transition-all">
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
