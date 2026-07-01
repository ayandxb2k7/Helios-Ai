"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Brain,
  Volume2,
  Sparkles,
  MessageSquare,
  StopCircle,
} from "lucide-react";

interface VoiceMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  action?: string;
}

const suggestedCommands = [
  "Explain the authentication flow",
  "Find performance bottlenecks",
  "Generate unit tests for auth",
  "Review the latest pull request",
  "What's the project health score?",
  "Find all security vulnerabilities",
];

const voiceResponses: Record<string, string> = {
  "Explain the authentication flow": "The authentication flow uses JWT tokens stored in httpOnly cookies. When a user submits credentials to POST /api/auth, the server validates against PostgreSQL, generates a JWT with jsonwebtoken, and sets it as an httpOnly cookie. The middleware in middleware.ts verifies the token on protected routes. I found a critical issue: JWT_SECRET is accessed without null validation, which could crash the app at runtime.",
  "Find performance bottlenecks": "I found 4 performance bottlenecks: First, Monaco Editor adds 1.2MB to the client bundle — use dynamic imports. Second, dashboard stat cards re-render without memoization. Third, the GET /api/users endpoint could trigger N+1 queries. Fourth, Recharts adds 890KB — consider lighter alternatives. Estimated 40% bundle reduction is possible.",
  "Generate unit tests for auth": "I've generated a comprehensive test suite for the auth module using Vitest. It includes 6 test cases covering: valid JWT generation, token expiration, null token handling, expired token rejection, and decoded user extraction. The estimated coverage is 85%. You can view the full test code in the Testing module.",
  "Review the latest pull request": "I reviewed PR #42: 'feat: add user authentication with JWT'. I found 3 issues: JWT_SECRET is accessed without null check on line 24, the login endpoint lacks rate limiting, and bcrypt comparison should use constant-time comparison to prevent timing attacks. I'm requesting changes before merge.",
  "What's the project health score?": "The overall project health score is 73 out of 100. Breaking it down: Architecture scores highest at 88, followed by Readability at 85 and Performance at 82. The weakest areas are Testing at 45 and Documentation at 58. I recommend prioritizing test coverage and adding JSDoc comments.",
  "Find all security vulnerabilities": "I found 6 security issues: 2 critical — a hardcoded API key in config.ts and missing JWT secret validation. 2 high — permissive CORS allowing all origins, and an outdated jsonwebtoken version with a known CVE. 2 medium — missing input validation on POST /api/users, and an unprotected admin endpoint. Full details are in the Security module.",
};

export default function VoicePage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => setPulsePhase((p) => (p + 1) % 360), 50);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  const simulateVoiceInput = (text: string) => {
    const userMsg: VoiceMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsListening(false);
    setProcessing(true);

    setTimeout(() => {
      const response = voiceResponses[text] || `Based on my analysis of the project, I can provide insights about "${text}". The codebase is well-structured with clear separation of concerns. Let me know if you'd like me to dive deeper into any specific aspect.`;
      const aiMsg: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        action: text.includes("test") ? "Tests generated" : text.includes("review") ? "Review complete" : text.includes("security") ? "Scan complete" : undefined,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-helios-700/50 bg-helios-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-accent-400" />
          <div>
            <h2 className="font-semibold text-sm">Voice Mode</h2>
            <p className="text-[10px] text-helios-500">Talk to HELIOS about your project</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-500/20 to-cyan-500/20 flex items-center justify-center">
                <Brain className="w-10 h-10 text-accent-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Voice Interface</h2>
            <p className="text-helios-400 mb-8">Ask HELIOS anything about your project using voice commands.</p>
            <div className="grid grid-cols-2 gap-3">
              {suggestedCommands.map((cmd) => (
                <button key={cmd} onClick={() => simulateVoiceInput(cmd)} className="p-3 glass glass-hover rounded-xl text-left text-xs text-helios-300 transition-all group">
                  <MessageSquare className="w-3 h-3 text-accent-400 mb-1.5" />
                  <span className="group-hover:text-helios-100">{cmd}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-accent-400" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-accent-500/20 border border-accent-500/20" : "glass-sm"}`}>
                  <p className="text-sm text-helios-200 leading-relaxed">{msg.content}</p>
                  {msg.action && <span className="badge badge-emerald text-[10px] mt-2 inline-block">{msg.action}</span>}
                </div>
              </motion.div>
            ))}
            {processing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-accent-400" />
                </div>
                <div className="glass-sm rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-2 bg-accent-400 rounded-full" />
                    <span className="text-sm text-helios-400">Processing...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Voice Control */}
      <div className="border-t border-helios-700/50 bg-helios-900/80 backdrop-blur-xl px-6 py-5">
        <div className="max-w-lg mx-auto flex flex-col items-center">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all mb-3 ${
              isListening
                ? "bg-accent-500 shadow-lg shadow-accent-500/30"
                : "bg-helios-700/50 hover:bg-helios-700 border border-helios-600/50"
            }`}
          >
            {isListening ? (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent-400"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <StopCircle className="w-6 h-6 text-white" />
              </>
            ) : (
              <Mic className="w-6 h-6 text-helios-300" />
            )}
          </button>
          <span className="text-xs text-helios-500">
            {isListening ? "Listening... tap to stop" : "Tap to speak or use suggestions above"}
          </span>
        </div>
      </div>
    </div>
  );
}
