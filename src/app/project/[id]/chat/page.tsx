"use client";

import { useState, useRef, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Code2,
  FileCode2,
  Lightbulb,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Explain the authentication flow",
  "Find possible bottlenecks",
  "Which components should become reusable?",
  "Suggest folder restructuring",
  "Find every API related to users",
  "Explain the database design",
];

const aiResponses: Record<string, string> = {
  "Explain the authentication flow": `Based on my analysis of the project, here's the authentication flow:

1. **Login Page** (\`src/app/login/page.tsx\`): User submits email/password
2. **Auth API** (\`src/app/api/auth/route.ts\`): Validates credentials against PostgreSQL
3. **JWT Generation**: A JWT token is created with \`jsonwebtoken\` containing user ID and role
4. **Cookie Storage**: Token is stored in an httpOnly cookie (\`auth-token\`)
5. **Middleware** (\`src/middleware.ts\`): Verifies JWT on protected routes
6. **Auth Context** (\`src/lib/auth.ts\`): Client-side context provides user state

**Potential issue**: The JWT secret is read from \`process.env.JWT_SECRET\` but there's no fallback validation if it's missing in production.`,
  "How does the API routing work?": `The API routing follows Next.js App Router conventions:

**Route Structure:**
\`\`\`
src/app/api/
├── auth/route.ts        → POST /api/auth
├── users/route.ts       → GET /api/users
├── users/[id]/route.ts  → GET/PUT/DELETE /api/users/:id
├── projects/route.ts    → GET/POST /api/projects
└── health/route.ts      → GET /api/health
\`\`\`

**Pattern**: Each \`route.ts\` exports named functions (GET, POST, PUT, DELETE) following REST conventions.

**Middleware**: All routes except \`/api/auth\` and \`/api/health\` go through the auth middleware that validates the JWT token.

**12 total API endpoints** detected across the codebase.`,
  "Where is JWT implemented?": `JWT is implemented in 3 key locations:

**1. Token Generation** (\`src/lib/auth.ts:24-38\`):
\`\`\`typescript
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);
\`\`\`

**2. Token Verification** (\`src/middleware.ts:8-22\`):
\`\`\`typescript
const token = request.cookies.get('auth-token')?.value;
const decoded = jwt.verify(token, process.env.JWT_SECRET!);
\`\`\`

**3. Client Auth Context** (\`src/lib/auth.ts\`):
Uses the token in cookies for authenticated API calls.

⚠️ **Issue found**: \`JWT_SECRET\` has no validation — if the env var is missing, the app will crash at runtime rather than at startup.`,
  "Explain the folder structure": `The project follows a standard Next.js 15 App Router structure:

\`\`\`
src/
├── app/              → Next.js pages & API routes
│   ├── page.tsx      → Home page
│   ├── layout.tsx    → Root layout
│   ├── dashboard/    → Dashboard page
│   ├── api/          → API route handlers
│   └── import/       → Import project page
├── components/       → Reusable React components
│   ├── ui/           → Base UI components
│   ├── charts/       → Chart components
│   └── layout/       → Layout components
├── lib/              → Utility functions & shared logic
│   ├── auth.ts       → Authentication helpers
│   ├── utils.ts      → General utilities
│   └── analytics.ts  → Analytics tracking
└── db/               → Database layer
    ├── schema.ts     → Drizzle ORM schema
    └── index.ts      → Database connection
\`\`\`

This is a well-organized structure following Next.js best practices.`,
  "Find potential bugs": `I found **5 potential issues** in the codebase:

🔴 **High**: Missing JWT secret validation (\`src/lib/auth.ts:24\`)
- App crashes at runtime if \`JWT_SECRET\` is not set

🟡 **Medium**: Unhandled promise in \`src/app/api/users/route.ts:45\`
- \`getUserById\` can return null but isn't checked

🟡 **Medium**: Race condition in \`src/lib/analytics.ts:78\`
- Multiple concurrent writes to the same analytics key

🟠 **Low**: Missing error boundary around chart components
- Charts crash the entire page on data errors

🟠 **Low**: Type assertion without validation (\`src/db/schema.ts:12\`)
- \`as string[]\` could fail at runtime if data shape changes`,
  "Find possible bottlenecks": `After analyzing the entire project, here are the **key bottlenecks** I've identified:

🔴 **Critical: Unhandled promise rejections** (\`src/lib/analytics.ts:78\`)
The \`trackEvent\` function is called without \`await\` and no \`.catch()\`. If the analytics service fails, this crashes the process.

🟡 **Database: No connection pooling** (\`src/db/index.ts:5\`)
The PostgreSQL Pool is created without max connection limits. Under load, connections could be exhausted.

🟡 **API: N+1 queries** (\`src/app/api/users/route.ts\`)
The user listing endpoint could trigger N+1 queries when loading related data. Use Drizzle's \`with\` clause.

🟡 **Bundle: ~1.2MB Monaco Editor** (\`src/app/project/[id]/files/page.tsx\`)
Monaco loads eagerly, adding 1.2MB to the initial bundle. Use \`next/dynamic\` with \`ssr: false\`.

🟠 **Rendering: No memoization** (\`src/app/dashboard/page.tsx:45\`)
Dashboard stat cards re-render on every parent state change without \`React.memo\`.

💡 **Recommendation**: Priority order — fix promise rejection, add connection pooling, then dynamic imports.`,
  "Which components should become reusable?": `Based on my analysis, these components are candidates for extraction into reusable primitives:

**1. ScoreRing** (currently inline in dashboard)
Used for health scores. Should become a shared component with configurable size, color, and score.
→ Create \`src/components/ui/ScoreRing.tsx\`

**2. StatCard** (repeated 4x in dashboard)
The stat card pattern (icon + value + label) is repeated. Extract with variants.
→ Create \`src/components/ui/StatCard.tsx\`

**3. Badge** (used across all pages)
Currently duplicated as CSS classes. Should be a React component with variant props.
→ Create \`src/components/ui/Badge.tsx\`

**4. GlassCard** (used everywhere)
The glass card pattern is the most reused pattern. Extract with optional hover behavior.
→ Create \`src/components/ui/GlassCard.tsx\`

**5. SearchInput** (used in 5+ pages)
Search bar with icon is repeated identically. Extract with consistent styling.
→ Create \`src/components/ui/SearchInput.tsx\`

**6. CodeBlock** (used in chat and files)
Code display with line numbers and copy button. Should be shared.
→ Create \`src/components/ui/CodeBlock.tsx\`

💡 Estimated reduction: ~200 lines of duplicated code.`,
  "Suggest folder restructuring": `Here's my recommended folder restructuring to improve maintainability:

**Current Issues:**
- All components in flat \`src/components/\` — hard to find related components
- No service layer — business logic mixed in API routes
- Shared types scattered across files

**Proposed Structure:**
\`\`\`
src/
├── app/                    → Next.js routes (keep as-is)
├── components/
│   ├── ui/                 → Shared primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── ScoreRing.tsx
│   │   └── SearchInput.tsx
│   ├── charts/             → Data visualization
│   ├── layout/             → Page structure
│   └── features/           → Feature-specific components
│       ├── dashboard/
│       └── project/
├── lib/
│   ├── auth.ts             → Auth helpers
│   ├── validators.ts       → Shared Zod schemas ✨ NEW
│   ├── types.ts            → Shared TypeScript types ✨ NEW
│   └── utils.ts
├── services/               → Business logic ✨ NEW
│   ├── user.service.ts
│   ├── project.service.ts
│   └── auth.service.ts
└── db/                     → Database layer (keep as-is)
\`\`\`

**Key Changes:**
1. Extract \`validators.ts\` for shared validation (fixes duplicate email regex)
2. Add \`services/\` layer to keep API routes thin
3. Add \`types.ts\` for shared interfaces (breaks circular imports)
4. Group feature components under \`features/\``,
  "Find every API related to users": `Here are **all APIs related to users** in the project:

**Authentication:**
- \`POST /api/auth\` — Login with email/password → JWT token
  - File: \`src/app/api/auth/route.ts\`
  - Auth: None (public endpoint)
  - Returns: User object + httpOnly cookie

**User Management:**
- \`GET /api/users\` — List all users
  - File: \`src/app/api/users/route.ts\`
  - Auth: Required (JWT)
  - Middleware: auth, rateLimiter

- \`POST /api/users\` — Create new user
  - File: \`src/app/api/users/route.ts\`
  - Auth: Required (JWT)
  - Middleware: auth, validate
  - Body: { name, email, password }

- \`GET /api/users/:id\` — Get user by ID
  - File: \`src/app/api/users/[id]/route.ts\`
  - Auth: Required (JWT)

- \`PUT /api/users/:id\` — Update user
  - File: \`src/app/api/users/[id]/route.ts\`
  - Auth: Required (JWT)
  - Middleware: auth, validate

- \`DELETE /api/users/:id\` — Delete user (admin only)
  - File: \`src/app/api/users/[id]/route.ts\`
  - Auth: Required (admin role)
  - Middleware: auth, adminOnly

**Related Services:**
- Auth service: \`src/lib/auth.ts\` (getCurrentUser, generateToken)
- Database schema: \`src/db/schema.ts\` (users table)

⚠️ **Issue**: No pagination on GET /api/users — will be slow with large datasets.`,
  "Explain the database design": `The database uses **Drizzle ORM** with PostgreSQL:

**Tables:**
1. **\`projects\`** - Core project data (name, repo URL, health scores)
2. **\`project_files\`** - Scanned file contents and metadata
3. **\`project_issues\`** - Detected issues (type, severity, file path)
4. **\`chat_messages\`** - AI chat history per project
5. **\`api_endpoints\`** - Discovered API endpoints

**Key relationships:**
- \`project_files.project_id\` → \`projects.id\` (one-to-many)
- \`project_issues.project_id\` → \`projects.id\` (one-to-many)
- \`chat_messages.project_id\` → \`projects.id\` (one-to-many)
- \`api_endpoints.project_id\` → \`projects.id\` (one-to-many)

All foreign keys use \`ON DELETE CASCADE\` for clean project removal.`,
};

function getAIResponse(question: string): string {
  if (aiResponses[question]) return aiResponses[question];
  return `Based on my analysis of this project, I can provide the following insight about "${question}":

The codebase is a Next.js 15 application using the App Router pattern with TypeScript, Tailwind CSS, and Drizzle ORM for database interactions.

**Key observations:**
- The project follows modern Next.js conventions with server/client component separation
- API routes are organized under \`src/app/api/\`
- Database schema uses Drizzle ORM with PostgreSQL
- Authentication is handled via JWT tokens

Would you like me to dive deeper into any specific aspect of the project?`;
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-helios-700/50 bg-helios-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-400" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">AI Chat</h2>
            <p className="text-xs text-helios-500">Ask anything about your project</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-accent-500/15 flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-accent-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ask HELIOS anything</h2>
            <p className="text-helios-400 mb-8">I understand your entire project. Try one of these questions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="flex items-center gap-3 p-4 glass glass-hover rounded-xl text-left text-sm transition-all group"
                >
                  <Lightbulb className="w-4 h-4 text-accent-400 shrink-0" />
                  <span className="text-helios-300 group-hover:text-helios-100">{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`chat-message flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-accent-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                  msg.role === "user"
                    ? "bg-accent-500/20 border border-accent-500/20"
                    : "glass-sm"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content.split("```").map((part, i) =>
                    i % 2 === 1 ? (
                      <div key={i} className="relative my-3">
                        <div className="bg-helios-950 rounded-xl p-4 font-mono text-xs text-helios-200 overflow-x-auto">
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => copyMessage(msg.id, part)}
                              className="p-1 hover:bg-helios-700/50 rounded transition-colors"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-helios-500" />
                              )}
                            </button>
                          </div>
                          <pre className="whitespace-pre-wrap">{part}</pre>
                        </div>
                      </div>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => copyMessage(msg.id, msg.content)}
                      className="text-helios-500 hover:text-helios-300 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-accent-400" />
              </div>
              <div className="glass-sm rounded-2xl px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-accent-400 animate-spin" />
                  <span className="text-sm text-helios-400">HELIOS is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-helios-700/50 bg-helios-900/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask about your project..."
              rows={1}
              className="w-full px-4 py-3 bg-helios-800/60 border border-helios-600/50 rounded-xl text-helios-100 placeholder-helios-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20 text-sm resize-none"
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 bg-accent-500 hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
