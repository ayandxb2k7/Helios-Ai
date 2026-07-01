"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  FileCode2,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface TestSuite {
  id: string;
  name: string;
  type: "unit" | "integration" | "api" | "component";
  framework: string;
  targetFile: string;
  code: string;
  coverageEstimate: number;
}

const testSuites: TestSuite[] = [
  {
    id: "1",
    name: "auth.test.ts",
    type: "unit",
    framework: "Vitest",
    targetFile: "src/lib/auth.ts",
    coverageEstimate: 85,
    code: `import { describe, it, expect, vi } from "vitest";
import { generateToken, getCurrentUser } from "./auth";
import jwt from "jsonwebtoken";

describe("Auth Module", () => {
  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const token = generateToken("user-123", "admin");
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      expect(decoded).toMatchObject({
        userId: "user-123",
        role: "admin",
      });
    });

    it("should set 7-day expiration", () => {
      const token = generateToken("user-123", "user");
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded.exp - decoded.iat).toBe(7 * 24 * 60 * 60);
    });
  });

  describe("getCurrentUser", () => {
    it("should return null when no token exists", async () => {
      vi.spyOn(cookies(), "get").mockReturnValue(undefined);
      const user = await getCurrentUser();
      expect(user).toBeNull();
    });

    it("should return decoded user from valid token", async () => {
      const token = generateToken("user-123", "admin");
      vi.spyOn(cookies(), "get").mockReturnValue({ value: token });
      const user = await getCurrentUser();
      expect(user).toMatchObject({ userId: "user-123", role: "admin" });
    });

    it("should return null for expired token", async () => {
      const token = jwt.sign(
        { userId: "user-123" },
        process.env.JWT_SECRET!,
        { expiresIn: "-1d" }
      );
      vi.spyOn(cookies(), "get").mockReturnValue({ value: token });
      const user = await getCurrentUser();
      expect(user).toBeNull();
    });
  });
});`,
  },
  {
    id: "2",
    name: "users-api.test.ts",
    type: "api",
    framework: "Vitest",
    targetFile: "src/app/api/users/route.ts",
    coverageEstimate: 78,
    code: `import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "./route";
import { db } from "@/db";

vi.mock("@/db");

describe("Users API", () => {
  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { id: "1", name: "John", email: "john@test.com" },
      ];
      vi.spyOn(db.query.users, "findMany").mockResolvedValue(mockUsers);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUsers);
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const newUser = { name: "Jane", email: "jane@test.com" };
      const created = { id: "2", ...newUser };
      vi.spyOn(db, "insert").mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([created]),
        }),
      } as any);

      const request = new Request("http://localhost/api/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe("Jane");
    });

    it("should reject invalid email", async () => {
      const invalidUser = { name: "Jane", email: "not-an-email" };
      const request = new Request("http://localhost/api/users", {
        method: "POST",
        body: JSON.stringify(invalidUser),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(400);
    });
  });
});`,
  },
  {
    id: "3",
    name: "Button.test.tsx",
    type: "component",
    framework: "Vitest + Testing Library",
    targetFile: "src/components/Button.tsx",
    coverageEstimate: 90,
    code: `import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button Component", () => {
  it("should render with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should apply primary variant styles", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText("Primary");
    expect(button.className).toContain("bg-accent-500");
  });

  it("should handle click events", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });
});`,
  },
  {
    id: "4",
    name: "auth-api.integration.test.ts",
    type: "integration",
    framework: "Vitest",
    targetFile: "src/app/api/auth/route.ts",
    coverageEstimate: 72,
    code: `import { describe, it, expect, vi } from "vitest";
import { POST } from "./route";

describe("Auth API Integration", () => {
  it("should login with valid credentials", async () => {
    const request = new Request("http://localhost/api/auth", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "valid-password",
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).toBeDefined();
    // Verify cookie is set
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("auth-token");
  });

  it("should reject invalid credentials", async () => {
    const request = new Request("http://localhost/api/auth", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrong-password",
      }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(401);
  });
});`,
  },
  {
    id: "5",
    name: "utils.test.ts",
    type: "unit",
    framework: "Vitest",
    targetFile: "src/lib/utils.ts",
    coverageEstimate: 95,
    code: `import { describe, it, expect, vi } from "vitest";
import { cn, formatDate, debounce } from "./utils";

describe("Utils", () => {
  describe("cn", () => {
    it("should join class names", () => {
      expect(cn("a", "b", "c")).toBe("a b c");
    });

    it("should filter falsy values", () => {
      expect(cn("a", false, undefined, "b")).toBe("a b");
    });
  });

  describe("formatDate", () => {
    it("should format date in en-US format", () => {
      const date = new Date("2024-01-15");
      expect(formatDate(date)).toMatch(/Jan/);
    });
  });

  describe("debounce", () => {
    it("should debounce function calls", async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledOnce();
      vi.useRealTimers();
    });
  });
});`,
  },
];

const typeColors: Record<string, string> = { unit: "badge-purple", integration: "badge-cyan", api: "badge-emerald", component: "badge-amber" };

export default function TestsPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  const [expanded, setExpanded] = useState<string | null>("1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const avgCoverage = Math.round(testSuites.reduce((a, t) => a + t.coverageEstimate, 0) / testSuites.length);
  const estimatedTotalCoverage = Math.round(testSuites.reduce((a, t) => a + t.coverageEstimate, 0) / testSuites.length * 0.6);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="w-6 h-6 text-accent-400" />
          <h1 className="text-3xl font-bold">Test Generator</h1>
        </div>
        <p className="text-helios-400">AI-generated test suites with coverage estimation.</p>
      </motion.div>

      {/* Coverage Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass p-5 text-center">
          <div className="text-2xl font-bold gradient-text">{testSuites.length}</div>
          <div className="text-xs text-helios-400">Test Suites</div>
        </div>
        <div className="glass p-5 text-center">
          <div className="text-2xl font-bold gradient-text">{avgCoverage}%</div>
          <div className="text-xs text-helios-400">Suite Coverage</div>
        </div>
        <div className="glass p-5 text-center">
          <div className="text-2xl font-bold gradient-text">~{estimatedTotalCoverage}%</div>
          <div className="text-xs text-helios-400">Est. Total Coverage</div>
        </div>
        <div className="glass p-5 text-center">
          <div className="text-2xl font-bold gradient-text">Vitest</div>
          <div className="text-xs text-helios-400">Framework</div>
        </div>
      </motion.div>

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map((suite, i) => (
          <motion.div key={suite.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }} className="glass overflow-hidden">
            <button onClick={() => setExpanded(expanded === suite.id ? null : suite.id)} className="w-full flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                {expanded === suite.id ? <ChevronDown className="w-4 h-4 text-helios-400" /> : <ChevronRight className="w-4 h-4 text-helios-400" />}
                <FileCode2 className="w-5 h-5 text-accent-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-sm">{suite.name}</span>
                    <span className={`badge text-[10px] ${typeColors[suite.type]}`}>{suite.type}</span>
                  </div>
                  <div className="text-xs text-helios-500 mt-0.5">{suite.framework} · {suite.targetFile}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 bg-helios-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${suite.coverageEstimate}%` }} />
                </div>
                <span className="text-sm font-mono text-emerald-400">{suite.coverageEstimate}%</span>
              </div>
            </button>

            {expanded === suite.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-helios-700/50">
                <div className="flex items-center justify-between px-5 py-2 bg-helios-900/60">
                  <span className="text-xs text-helios-500 font-mono">{suite.targetFile}</span>
                  <button onClick={() => copyCode(suite.id, suite.code)} className="flex items-center gap-1.5 px-3 py-1 text-xs text-helios-400 hover:text-accent-400 transition-colors">
                    {copiedId === suite.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === suite.id ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="px-5 py-4 text-xs font-mono text-helios-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {suite.code}
                </pre>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
