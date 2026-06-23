CREATE TYPE "public"."briefing_provider" AS ENUM('ollama', 'rules-fallback');--> statement-breakpoint
CREATE TYPE "public"."briefing_status" AS ENUM('success', 'failure');--> statement-breakpoint
CREATE TYPE "public"."feedback_sentiment" AS ENUM('helpful', 'not_helpful');--> statement-breakpoint
CREATE TYPE "public"."segment" AS ENUM('SMB', 'Mid-Market', 'Enterprise');--> statement-breakpoint
CREATE TYPE "public"."source_system" AS ENUM('salesforce', 'gong', 'zendesk', 'product_analytics');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'pending', 'solved');--> statement-breakpoint
CREATE TYPE "public"."usage_trend" AS ENUM('up', 'flat', 'down');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"industry" text NOT NULL,
	"owner" text NOT NULL,
	"segment" "segment" NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "briefing_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider" "briefing_provider" NOT NULL,
	"status" "briefing_status" NOT NULL,
	"latency_ms" integer,
	"output_json" jsonb,
	"error_message" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calls" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"owner" text NOT NULL,
	"summary" text NOT NULL,
	"themes" jsonb NOT NULL,
	"excerpts" jsonb NOT NULL,
	"sentiment" text DEFAULT 'neutral' NOT NULL,
	"source_system" "source_system" NOT NULL,
	"source_id" text NOT NULL,
	"source_updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback_events" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"briefing_run_id" text,
	"sentiment" "feedback_sentiment" NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"health_score" integer NOT NULL,
	"usage_trend" "usage_trend" NOT NULL,
	"active_users" integer NOT NULL,
	"last_login_at" timestamp with time zone NOT NULL,
	"source_system" "source_system" NOT NULL,
	"source_id" text NOT NULL,
	"source_updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"stage" text NOT NULL,
	"amount" integer NOT NULL,
	"probability" integer NOT NULL,
	"close_date" timestamp with time zone NOT NULL,
	"days_in_stage" integer NOT NULL,
	"last_activity_at" timestamp with time zone NOT NULL,
	"owner" text NOT NULL,
	"source_system" "source_system" NOT NULL,
	"source_id" text NOT NULL,
	"source_updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"priority" "ticket_priority" NOT NULL,
	"status" "ticket_status" NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"summary" text NOT NULL,
	"source_system" "source_system" NOT NULL,
	"source_id" text NOT NULL,
	"source_updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "briefing_runs" ADD CONSTRAINT "briefing_runs_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_events" ADD CONSTRAINT "feedback_events_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_events" ADD CONSTRAINT "feedback_events_briefing_run_id_briefing_runs_id_fk" FOREIGN KEY ("briefing_run_id") REFERENCES "public"."briefing_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_snapshots" ADD CONSTRAINT "health_snapshots_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;