import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const segmentEnum = pgEnum("segment", ["SMB", "Mid-Market", "Enterprise"]);
export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "low",
  "normal",
  "high",
  "urgent",
]);
export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "pending",
  "solved",
]);
export const usageTrendEnum = pgEnum("usage_trend", ["up", "flat", "down"]);
export const briefingProviderEnum = pgEnum("briefing_provider", [
  "ollama",
  "rules-fallback",
]);
export const briefingStatusEnum = pgEnum("briefing_status", [
  "success",
  "failure",
]);
export const feedbackSentimentEnum = pgEnum("feedback_sentiment", [
  "helpful",
  "not_helpful",
]);
export const sourceSystemEnum = pgEnum("source_system", [
  "salesforce",
  "gong",
  "zendesk",
  "product_analytics",
]);

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  owner: text("owner").notNull(),
  segment: segmentEnum("segment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const opportunities = pgTable("opportunities", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  stage: text("stage").notNull(),
  amount: integer("amount").notNull(),
  probability: integer("probability").notNull(),
  closeDate: timestamp("close_date", { withTimezone: true }).notNull(),
  daysInStage: integer("days_in_stage").notNull(),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true }).notNull(),
  owner: text("owner").notNull(),
  sourceSystem: sourceSystemEnum("source_system").notNull(),
  sourceId: text("source_id").notNull(),
  sourceUpdatedAt: timestamp("source_updated_at", { withTimezone: true }).notNull(),
});

export const calls = pgTable("calls", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  owner: text("owner").notNull(),
  summary: text("summary").notNull(),
  themes: jsonb("themes").$type<string[]>().notNull(),
  excerpts: jsonb("excerpts").$type<string[]>().notNull(),
  sentiment: text("sentiment").notNull().default("neutral"),
  sourceSystem: sourceSystemEnum("source_system").notNull(),
  sourceId: text("source_id").notNull(),
  sourceUpdatedAt: timestamp("source_updated_at", { withTimezone: true }).notNull(),
});

export const supportTickets = pgTable("support_tickets", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  priority: ticketPriorityEnum("priority").notNull(),
  status: ticketStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  summary: text("summary").notNull(),
  sourceSystem: sourceSystemEnum("source_system").notNull(),
  sourceId: text("source_id").notNull(),
  sourceUpdatedAt: timestamp("source_updated_at", { withTimezone: true }).notNull(),
});

export const healthSnapshots = pgTable("health_snapshots", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  healthScore: integer("health_score").notNull(),
  usageTrend: usageTrendEnum("usage_trend").notNull(),
  activeUsers: integer("active_users").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }).notNull(),
  sourceSystem: sourceSystemEnum("source_system").notNull(),
  sourceId: text("source_id").notNull(),
  sourceUpdatedAt: timestamp("source_updated_at", { withTimezone: true }).notNull(),
});

export const briefingRuns = pgTable("briefing_runs", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  provider: briefingProviderEnum("provider").notNull(),
  status: briefingStatusEnum("status").notNull(),
  latencyMs: integer("latency_ms"),
  outputJson: jsonb("output_json"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const feedbackEvents = pgTable("feedback_events", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  briefingRunId: text("briefing_run_id").references(() => briefingRuns.id),
  sentiment: feedbackSentimentEnum("sentiment").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});
