import { pgTable, uuid, text, timestamp, integer, jsonb, varchar, boolean } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  repoUrl: varchar("repo_url", { length: 500 }),
  techStack: jsonb("tech_stack").$type<string[]>().default([]),
  healthScore: integer("health_score").default(0),
  architectureScore: integer("architecture_score").default(0),
  securityScore: integer("security_score").default(0),
  documentationScore: integer("documentation_score").default(0),
  coverageScore: integer("coverage_score").default(0),
  performanceScore: integer("performance_score").default(0),
  complexityScore: integer("complexity_score").default(0),
  techDebtScore: integer("tech_debt_score").default(0),
  accessibilityScore: integer("accessibility_score").default(0),
  fileCount: integer("file_count").default(0),
  apiCount: integer("api_count").default(0),
  componentCount: integer("component_count").default(0),
  issueCount: integer("issue_count").default(0),
  language: varchar("language", { length: 50 }).default("typescript"),
  status: varchar("status", { length: 50 }).default("scanning"),
  source: varchar("source", { length: 50 }).default("github"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectFiles = pgTable("project_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  path: text("path").notNull(),
  content: text("content"),
  language: varchar("language", { length: 50 }),
  size: integer("size").default(0),
  lastModified: timestamp("last_modified").defaultNow(),
});

export const projectIssues = pgTable("project_issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  severity: varchar("severity", { length: 50 }).notNull(),
  filePath: text("file_path"),
  description: text("description").notNull(),
  lineNumber: integer("line_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  agentType: varchar("agent_type", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apiEndpoints = pgTable("api_endpoints", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  url: text("url").notNull(),
  controller: varchar("controller", { length: 255 }),
  middleware: jsonb("middleware").$type<string[]>().default([]),
  description: text("description"),
  filePath: text("file_path"),
});

export const projectMemory = pgTable("project_memory", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  pinned: boolean("pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const codeReviews = pgTable("code_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  readabilityScore: integer("readability_score").default(0),
  maintainabilityScore: integer("maintainability_score").default(0),
  securityScore: integer("security_score").default(0),
  scalabilityScore: integer("scalability_score").default(0),
  performanceScore: integer("performance_score").default(0),
  architectureScore: integer("architecture_score").default(0),
  testingScore: integer("testing_score").default(0),
  documentationScore: integer("documentation_score").default(0),
  overallScore: integer("overall_score").default(0),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectExports = pgTable("project_exports", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  format: varchar("format", { length: 20 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentLogs = pgTable("agent_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  agentType: varchar("agent_type", { length: 50 }).notNull(),
  action: varchar("action", { length: 200 }).notNull(),
  detail: text("detail"),
  status: varchar("status", { length: 20 }).default("running"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const observabilityEvents = pgTable("observability_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  level: varchar("level", { length: 20 }).notNull(),
  source: varchar("source", { length: 100 }),
  message: text("message").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
